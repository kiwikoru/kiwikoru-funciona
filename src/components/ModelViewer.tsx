import { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import type { PrintColor } from '../contexts/QuoteContext'
import { Maximize, RotateCcw, Move, ZoomIn } from 'lucide-react'

const colorMap: Record<PrintColor, number> = {
  black: 0x1a1a1a,
  white: 0xf5f5f5,
  red: 0xdc2626,
  blue: 0x2563eb,
  yellow: 0xeab308,
  other: 0xC9A96E,
}

const MATERIAL_DENSITY: Record<string, number> = {
  PLA: 1.24,
  PETG: 1.27,
  ABS: 1.04,
  ASA: 1.07,
  TPU: 1.21,
}

export interface ModelAnalysis {
  volume: number
  bounds: { x: number; y: number; z: number }
  triangles: number
  estimatedWeight: number
  estimatedTime: number
}

interface Props {
  file: File
  color: PrintColor
  material: string
  onAnalysis: (a: ModelAnalysis) => void
}

export default function ModelViewer({ file, color, material, onAnalysis }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const frameRef = useRef<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    setLoading(true)
    setError('')

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f0)

    const w = container.clientWidth
    const h = container.clientHeight
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 2000)
    camera.position.set(40, 30, 50)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    rendererRef.current = renderer

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0)
    keyLight.position.set(20, 40, 20)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(1024, 1024)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xe8e0d8, 0.4)
    fillLight.position.set(-20, 10, -10)
    scene.add(fillLight)

    const grid = new THREE.GridHelper(100, 20, 0xd0d0d0, 0xe8e8e8)
    grid.position.y = -15
    scene.add(grid)
    const axesHelper = new THREE.AxesHelper(22)
axesHelper.position.set(-42, -14.5, -42)
scene.add(axesHelper)

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ opacity: 0.08 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -15
    ground.receiveShadow = true
    scene.add(ground)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.rotateSpeed = 0.6
    controls.zoomSpeed = 0.8
    controls.panSpeed = 0.6
    controls.minDistance = 10
    controls.maxDistance = 150
    controls.target.set(0, 0, 0)
    controlsRef.current = controls

    const ext = file.name.split('.').pop()?.toLowerCase()
    const reader = new FileReader()

    
      reader.onload = () => {
  const buffer = reader.result as ArrayBuffer

  try {
    let geometry: THREE.BufferGeometry | null = null

    if (ext === 'stl') {
      const loader = new STLLoader()
      geometry = loader.parse(buffer)
    } else if (ext === 'obj') {
      const text = new TextDecoder().decode(buffer)
      const obj = new OBJLoader().parse(text)
      const geos: THREE.BufferGeometry[] = []

      obj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const g = (child as THREE.Mesh).geometry.clone()
          g.applyMatrix4(child.matrixWorld)
          geos.push(g)
        }
      })

      if (geos.length > 0) {
        geometry = mergeGeometries(geos)
      }
    } else if (ext === '3mf') {
      try {
        geometry = new STLLoader().parse(buffer)
      } catch {
        setError('3MF parsing requires additional libraries. Please convert to STL or OBJ.')
        setLoading(false)
        return
      }
    }

    if (!geometry) {
      setError('Could not parse the 3D model. Check the file format.')
      setLoading(false)
      return
    }

    geometry.computeVertexNormals()

    geometry.computeBoundingBox()
    const originalBox = geometry.boundingBox!
    const originalSize = new THREE.Vector3()
    originalBox.getSize(originalSize)

    const volumeCm3 = computeVolume(geometry)

    const center = new THREE.Vector3()
    originalBox.getCenter(center)
    geometry.translate(-center.x, -center.y, -center.z)

    const maxDim = Math.max(originalSize.x, originalSize.y, originalSize.z)
    const s = maxDim > 0 ? 30 / maxDim : 1
    geometry.scale(s, s, s)

    geometry.computeBoundingBox()
    const sBox = geometry.boundingBox!
    const sSize = new THREE.Vector3()
    sBox.getSize(sSize)

    const triCount = geometry.index
      ? geometry.index.count / 3
      : geometry.attributes.position.count / 3

    const density = MATERIAL_DENSITY[material] || 1.24
    const weight = volumeCm3 * density
    const estMin = Math.max(20, volumeCm3 * 10)

    onAnalysis({
      volume: volumeCm3,
      bounds: {
        x: originalSize.x,
        y: originalSize.y,
        z: originalSize.z,
      },
      triangles: Math.round(triCount),
      estimatedWeight: weight,
      estimatedTime: estMin,
    })

    const matColor = colorMap[color] || 0x1A2F23
    const mat = new THREE.MeshStandardMaterial({
      color: matColor,
      roughness: 0.35,
      metalness: 0.15,
    })

    const mesh = new THREE.Mesh(geometry, mat)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.y = sSize.y / 2 - 12

    scene.add(mesh)
    meshRef.current = mesh

    controls.target.set(0, mesh.position.y, 0)
    setLoading(false)
  } catch {
    setError('Failed to load model. Please check the file.')
    setLoading(false)
  }
}

    reader.readAsArrayBuffer(file)

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const ro = new ResizeObserver(() => {
      const cw = container.clientWidth
      const ch = container.clientHeight
      if (cw === 0 || ch === 0) return
      camera.aspect = cw / ch
      camera.updateProjectionMatrix()
      renderer.setSize(cw, ch)
    })
    ro.observe(container)

    return () => {
      cancelAnimationFrame(frameRef.current)
      ro.disconnect()
      controls.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [file, color, material, onAnalysis])

  useEffect(() => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshStandardMaterial).color.setHex(colorMap[color] || 0x1A2F23)
    }
  }, [color])

  const resetCamera = useCallback(() => {
    if (cameraRef.current && controlsRef.current && meshRef.current) {
      cameraRef.current.position.set(40, 30, 50)
      controlsRef.current.target.copy(meshRef.current.position)
      controlsRef.current.update()
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  return (
    <div className="relative w-full h-full min-h-[350px] rounded-xl overflow-hidden bg-[#f5f5f0]">
      <div ref={containerRef} className="absolute inset-0" />

      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
        <button onClick={resetCamera} title="Reset camera" className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white shadow-sm transition-all">
          <RotateCcw size={14} className="text-gray-600" />
        </button>
        <button onClick={toggleFullscreen} title="Fullscreen" className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white shadow-sm transition-all">
          <Maximize size={14} className="text-gray-600" />
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f5f5f0] z-20">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400 mt-3">Loading 3D model...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f0] z-20 p-6">
          <p className="text-sm text-red-500 text-center">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="absolute bottom-3 left-3 flex items-center gap-3 z-10">
          <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-white/70 backdrop-blur-sm px-2 py-1 rounded">
            <RotateCcw size={9} /> Rotate
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-white/70 backdrop-blur-sm px-2 py-1 rounded">
            <ZoomIn size={9} /> Zoom
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-white/70 backdrop-blur-sm px-2 py-1 rounded">
            <Move size={9} /> Pan
          </span>
        </div>
      )}

      {!loading && !error && (
        <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm text-[10px] text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" /> X Width
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" /> Y Height
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Z Depth
          </span>
        </div>
      )}
    </div>
  )
}

function computeVolume(geometry: THREE.BufferGeometry): number {
  const position = geometry.attributes.position
  if (!position) return 0

  const index = geometry.index

  const vA = new THREE.Vector3()
  const vB = new THREE.Vector3()
  const vC = new THREE.Vector3()

  let volumeMm3 = 0

  if (index) {
    for (let i = 0; i < index.count; i += 3) {
      vA.fromBufferAttribute(position, index.getX(i))
      vB.fromBufferAttribute(position, index.getX(i + 1))
      vC.fromBufferAttribute(position, index.getX(i + 2))

      volumeMm3 += vA.dot(vB.cross(vC)) / 6
    }
  } else {
    for (let i = 0; i < position.count; i += 3) {
      vA.fromBufferAttribute(position, i)
      vB.fromBufferAttribute(position, i + 1)
      vC.fromBufferAttribute(position, i + 2)

      volumeMm3 += vA.dot(vB.cross(vC)) / 6
    }
  }

  return Math.abs(volumeMm3) / 1000
}

function mergeGeometries(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const merged = new THREE.BufferGeometry()
  const positions: number[] = []
  geos.forEach((g) => {
    const arr = (g.attributes.position.array as Float32Array)
    for (let i = 0; i < arr.length; i++) positions.push(arr[i])
  })
  merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return merged
}
