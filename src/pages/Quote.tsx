import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import SEO from '../components/SEO'
import ScrollReveal from '../components/ScrollReveal'
import { Link } from 'react-router-dom'
import {
  Upload, X, Box, DollarSign, Settings, ChevronDown, ChevronUp,
  Info, AlertCircle, Layers, Thermometer, Sparkles, ArrowRight, Send,
  Minus, Plus, Clock, Truck, Palette
} from 'lucide-react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { useQuote, type PrintColor } from '../contexts/QuoteContext'

/* ─── Material data ─── */
const materials = [
  { name: 'PLA', factor: 1.0, desc: 'Best for prototypes & models', color: '#2d8a4e' },
  { name: 'PETG', factor: 1.2, desc: 'Strong, durable all-rounder', color: '#2563eb' },
  { name: 'ABS', factor: 1.3, desc: 'Tough & heat resistant', color: '#dc2626' },
  { name: 'ASA', factor: 1.4, desc: 'UV-stable for outdoors', color: '#ea580c' },
  { name: 'TPU', factor: 1.5, desc: 'Flexible & rubber-like', color: '#7c3aed' },
]

const infillOptions = [
  { value: 10, label: '10% — Visual / Light use', factor: 0.7 },
  { value: 20, label: '20% — Standard', factor: 0.85 },
  { value: 30, label: '30% — Functional', factor: 1.0 },
  { value: 50, label: '50% — Strong', factor: 1.25 },
  { value: 80, label: '80% — Very strong', factor: 1.6 },
  { value: 100, label: '100% — Solid', factor: 1.9 },
]

const layerOptions = [
  { value: 0.28, label: '0.28mm — Fast', factor: 0.9 },
  { value: 0.2, label: '0.20mm — Standard', factor: 1.0 },
  { value: 0.16, label: '0.16mm — Fine', factor: 1.1 },
  { value: 0.12, label: '0.12mm — Detailed', factor: 1.25 },
  { value: 0.08, label: '0.08mm — Ultra fine', factor: 1.5 },
]

const finishOptions = [
  { value: 'standard', label: 'Standard', factor: 1.0 },
  { value: 'smooth', label: 'Smooth (sanded)', factor: 1.3 },
  { value: 'premium', label: 'Premium (filled + painted)', factor: 1.8 },
]

const supportOptions = [
  { value: 'none', label: 'None needed', factor: 1.0 },
  { value: 'minimal', label: 'Minimal', factor: 1.08 },
  { value: 'standard', label: 'Standard', factor: 1.15 },
  { value: 'extensive', label: 'Extensive', factor: 1.3 },
]

const printColors: { id: PrintColor; label: string; bg: string; border?: string }[] = [
  { id: 'black', label: 'Black', bg: '#1a1a1a' },
  { id: 'white', label: 'White', bg: '#f5f5f5', border: '#d4d4d4' },
  { id: 'red', label: 'Red', bg: '#dc2626' },
  { id: 'blue', label: 'Blue', bg: '#2563eb' },
  { id: 'yellow', label: 'Yellow', bg: '#eab308' },
  { id: 'other', label: 'Other', bg: 'linear-gradient(135deg, #C9A96E 0%, #8BA888 50%, #2563eb 100%)' },
]

function getBulkLabel(qty: number): string {
  if (qty >= 50) return '30% (contact us)'
  if (qty >= 25) return '20% off'
  if (qty >= 10) return '15% off'
  if (qty >= 5) return '10% off'
  if (qty >= 2) return '5% off'
  return 'No discount'
}

/* ─── 3D Viewer Component ─── */
const colorMap: Record<PrintColor, number> = {
  black: 0x1a1a1a,
  white: 0xf5f5f5,
  red: 0xdc2626,
  blue: 0x2563eb,
  yellow: 0xeab308,
  other: 0xC9A96E,
}

function STLViewer({ file, color, onVolume }: { file: File; color: PrintColor; onVolume: (v: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f0)

    const w = container.clientWidth
    const h = container.clientHeight
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000)
    camera.position.set(0, 0, 80)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const dir = new THREE.DirectionalLight(0xffffff, 0.8)
    dir.position.set(10, 20, 10)
    dir.castShadow = true
    scene.add(dir)
    const fill = new THREE.DirectionalLight(0xffffff, 0.3)
    fill.position.set(-10, 0, -10)
    scene.add(fill)

    const grid = new THREE.GridHelper(100, 20, 0xcccccc, 0xe0e0e0)
    grid.position.y = -20
    scene.add(grid)

    const loader = new STLLoader()
    const reader = new FileReader()
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer
      try {
        const geometry = loader.parse(buffer)
        geometry.computeVertexNormals()
        const vol = computeVolume(geometry)
        onVolume(vol)

        geometry.computeBoundingBox()
        const box = geometry.boundingBox!
        const center = new THREE.Vector3()
        box.getCenter(center)
        geometry.translate(-center.x, -center.y, -center.z)

        const size = new THREE.Vector3()
        box.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = maxDim > 0 ? 40 / maxDim : 1
        geometry.scale(scale, scale, scale)

        const mat = new THREE.MeshStandardMaterial({ color: colorMap[color], roughness: 0.4, metalness: 0.1 })
        const mesh = new THREE.Mesh(geometry, mat)
        mesh.castShadow = true
        mesh.receiveShadow = true
        scene.add(mesh)

        // Mouse rotation
        let isDragging = false
        let prevX = 0
        let prevY = 0
        let rotX = 0
        let rotY = 0

        const onMouseDown = (e: MouseEvent) => { isDragging = true; prevX = e.clientX; prevY = e.clientY }
        const onMouseUp = () => { isDragging = false }
        const onMouseMove = (e: MouseEvent) => {
          if (!isDragging) return
          rotY += (e.clientX - prevX) * 0.01
          rotX += (e.clientY - prevY) * 0.01
          prevX = e.clientX
          prevY = e.clientY
          mesh.rotation.y = rotY
          mesh.rotation.x = rotX
        }
        renderer.domElement.addEventListener('mousedown', onMouseDown)
        window.addEventListener('mouseup', onMouseUp)
        window.addEventListener('mousemove', onMouseMove)

        let autoRotate = true
        const animate = () => {
          rafRef.current = requestAnimationFrame(animate)
          if (autoRotate && !isDragging) mesh.rotation.y += 0.005
          renderer.render(scene, camera)
        }
        animate()

        const onMouseEnter = () => { autoRotate = false }
        const onMouseLeave = () => { autoRotate = true }
        renderer.domElement.addEventListener('mouseenter', onMouseEnter)
        renderer.domElement.addEventListener('mouseleave', onMouseLeave)

        const onResize = () => {
          const cw = container.clientWidth
          const ch = container.clientHeight
          camera.aspect = cw / ch
          camera.updateProjectionMatrix()
          renderer.setSize(cw, ch)
        }
        window.addEventListener('resize', onResize)

        return () => {
          cancelAnimationFrame(rafRef.current)
          renderer.domElement.removeEventListener('mousedown', onMouseDown)
          window.removeEventListener('mouseup', onMouseUp)
          window.removeEventListener('mousemove', onMouseMove)
          renderer.domElement.removeEventListener('mouseenter', onMouseEnter)
          renderer.domElement.removeEventListener('mouseleave', onMouseLeave)
          window.removeEventListener('resize', onResize)
        }
      } catch {
        onVolume(0)
      }
    }
    reader.readAsArrayBuffer(file)

    return () => {
      cancelAnimationFrame(rafRef.current)
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [file, color, onVolume])

  return <div ref={containerRef} className="w-full h-full min-h-[350px] rounded-xl overflow-hidden bg-[#f5f5f0]" />
}

function computeVolume(geometry: THREE.BufferGeometry): number {
  const pos = geometry.attributes.position
  const arr = pos.array as Float32Array
  let vol = 0
  for (let i = 0; i < arr.length; i += 9) {
    const ax = arr[i], ay = arr[i + 1], az = arr[i + 2]
    const bx = arr[i + 3], by = arr[i + 4], bz = arr[i + 5]
    const cx = arr[i + 6], cy = arr[i + 7], cz = arr[i + 8]
    vol += (ax * (by * cz - bz * cy) + ay * (bz * cx - bx * cz) + az * (bx * cy - by * cx)) / 6
  }
  return Math.abs(vol) / 1000
}

/* ─── Main Quote Page ─── */
export default function Quote() {
  const { file: ctxFile, setFile: setCtxFile, setConfig } = useQuote()

  const [localFile, setLocalFile] = useState<File | null>(null)
  const [volume, setVolume] = useState(0)
  const [material, setMaterial] = useState('PLA')
  const [quantity, setQuantity] = useState(1)
  const [printColor, setPrintColor] = useState<PrintColor>('black')
  const [advanced, setAdvanced] = useState(false)
  const [infill, setInfill] = useState(20)
  const [walls, setWalls] = useState(2)
  const [topLayers, setTopLayers] = useState(4)
  const [bottomLayers, setBottomLayers] = useState(3)
  const [layerHeight, setLayerHeight] = useState(0.2)
  const [support, setSupport] = useState('standard')
  const [finish, setFinish] = useState('standard')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Use file from context if available (from Home upload)
  const file = localFile || ctxFile

  const materialFactor = materials.find(m => m.name === material)?.factor ?? 1.0
  const infillFactor = infillOptions.find(o => o.value === infill)?.factor ?? 1.0
  const layerFactor = layerOptions.find(o => o.value === layerHeight)?.factor ?? 1.0
  const finishFactor = finishOptions.find(o => o.value === finish)?.factor ?? 1.0
  const supportFactor = supportOptions.find(o => o.value === support)?.factor ?? 1.0
  const wallFactor = 1 + (walls - 2) * 0.12
  const topFactor = 1 + (topLayers - 4) * 0.04
  const bottomFactor = 1 + (bottomLayers - 3) * 0.04

  const pricePerUnit = useMemo(() => {
    if (volume <= 0) return 0
    const base = 8
    const volCost = volume * 0.35
    const total = (base + volCost) * materialFactor * infillFactor * wallFactor * topFactor * bottomFactor * layerFactor * supportFactor * finishFactor
    return Math.max(total, 5)
  }, [volume, materialFactor, infillFactor, wallFactor, topFactor, bottomFactor, layerFactor, supportFactor, finishFactor])

  const subtotal = pricePerUnit * quantity
  const total = subtotal

  // Clear context file when we use it locally
  useEffect(() => {
    if (ctxFile && !localFile) {
      setLocalFile(ctxFile)
      setCtxFile(null)
      setVolume(0)
    }
  }, [ctxFile, localFile, setCtxFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f && (f.name.endsWith('.stl') || f.name.endsWith('.obj') || f.name.endsWith('.3mf'))) {
      setLocalFile(f)
      setVolume(0)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) { setLocalFile(f); setVolume(0) }
  }, [])

  const clearFile = useCallback(() => {
    setLocalFile(null)
    setVolume(0)
  }, [])

  const handleProceed = useCallback(() => {
    if (!file) return
    setConfig({
      fileName: file.name,
      volume,
      material,
      quantity,
      color: printColor,
      infill,
      walls,
      topLayers,
      bottomLayers,
      layerHeight,
      support,
      finish,
      pricePerUnit,
      total,
    })
    window.location.hash = '/contact'
  }, [file, volume, material, quantity, printColor, infill, walls, topLayers, bottomLayers, layerHeight, support, finish, pricePerUnit, total, setConfig])

  return (
    <>
      <SEO
        title="Get a 3D Printing Quote | Instant Estimate | KiwiKoru 3D"
        description="Upload your STL file and get an instant 3D printing quote. Configure material, infill, and finish options. Serving all of New Zealand."
        path="/quote"
      />

      <section className="bg-forest pt-28 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Get Your <span className="text-gold">Quote</span>
            </h1>
            <p className="mt-3 text-white/60 max-w-xl">
              Upload your 3D model for an instant estimate. Configure material and settings to match your needs.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">

            {/* LEFT: Upload & Viewer */}
            <div>
              {!file && (
                <ScrollReveal>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                      dragOver ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-forest/30 bg-cream'
                    }`}
                  >
                    <Upload size={48} className="mx-auto mb-4 text-forest/40" />
                    <p className="text-lg font-medium text-charcoal mb-1">Drop your 3D model here</p>
                    <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                    <p className="text-xs text-gray-400">Supports STL, OBJ, and 3MF files</p>
                    <input ref={fileInputRef} type="file" accept=".stl,.obj,.3mf" className="hidden" onChange={handleFileSelect} />
                  </div>
                </ScrollReveal>
              )}

              {file && (
                <ScrollReveal>
                  <div className="border border-gray-200 rounded-2xl overflow-hidden bg-cream">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white">
                      <div className="flex items-center gap-3">
                        <Box size={18} className="text-forest" />
                        <span className="text-sm font-medium text-charcoal">{file.name}</span>
                        <span className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button onClick={clearFile} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Remove file">
                        <X size={16} className="text-gray-400" />
                      </button>
                    </div>
                    <div className="h-[400px] md:h-[450px]">
                      <STLViewer file={file} color={printColor} onVolume={setVolume} />
                    </div>
                    {volume > 0 && (
                      <div className="px-5 py-3 border-t border-gray-100 bg-white flex flex-wrap items-center gap-6 text-sm">
                        <span className="text-gray-500">Volume: <strong className="text-charcoal">{volume.toFixed(1)} cm³</strong></span>
                        <span className="text-gray-500">Est. print time: <strong className="text-charcoal">~{Math.ceil(volume * 12 / 60)}h {Math.ceil((volume * 12) % 60)}m</strong></span>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              )}

              {file && volume > 0 && (
                <ScrollReveal className="mt-6">
                  <div className="border border-gray-200 rounded-2xl p-6 bg-white">
                    <h3 className="text-lg font-semibold text-charcoal mb-5 flex items-center gap-2">
                      <Settings size={20} className="text-forest" /> Print Configuration
                    </h3>

                    {/* Material */}
                    <div className="mb-5">
                      <label className="text-sm font-medium text-charcoal mb-2 block">Material</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        {materials.map((m) => (
                          <button
                            key={m.name}
                            onClick={() => setMaterial(m.name)}
                            className={`p-3 rounded-xl border-2 text-left transition-all ${
                              material === m.name ? 'border-forest bg-forest/5' : 'border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <span className="text-sm font-semibold" style={{ color: m.color }}>{m.name}</span>
                            <span className="block text-[10px] text-gray-400 mt-0.5">{m.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity + Color */}
                    <div className="mb-5 grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium text-charcoal mb-2 block">Quantity</label>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <Minus size={16} />
                          </button>
                          <span className="w-16 text-center text-lg font-semibold">{quantity}</span>
                          <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <Plus size={16} />
                          </button>
                          {quantity >= 2 && (
                            <span className="text-sm text-gold font-medium ml-2">{getBulkLabel(quantity)}</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-charcoal mb-2 block flex items-center gap-1">
                          <Palette size={14} className="text-forest" /> Colour
                        </label>
                        <div className="flex items-center gap-2">
                          {printColors.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => setPrintColor(c.id)}
                              title={c.label}
                              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                                printColor === c.id ? 'border-gold scale-110 shadow-sm' : 'border-transparent hover:border-gray-300'
                              }`}
                              style={c.id === 'other' ? { background: c.bg } : { backgroundColor: c.bg, borderColor: c.border }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Advanced Toggle */}
                    <button
                      onClick={() => setAdvanced(!advanced)}
                      className="flex items-center gap-2 text-sm text-forest font-medium hover:text-forest-light transition-colors mb-4"
                    >
                      {advanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      Advanced Settings
                    </button>

                    {advanced && (
                      <div className="space-y-4 pb-2">
                        <div>
                          <label className="text-sm font-medium text-charcoal mb-2 block flex items-center gap-1">
                            <Layers size={14} className="text-forest" /> Infill Density
                          </label>
                          <select value={infill} onChange={(e) => setInfill(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-white">
                            {infillOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-charcoal mb-2 block">Wall Count</label>
                          <div className="flex items-center gap-3">
                            {[1, 2, 3, 4, 5].map((w) => (
                              <button key={w} onClick={() => setWalls(w)} className={`w-10 h-10 rounded-lg border-2 text-sm font-medium transition-all ${walls === w ? 'border-forest bg-forest/5 text-forest' : 'border-gray-200 hover:border-gray-300'}`}>{w}</button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-charcoal mb-2 block">Top Layers</label>
                            <div className="flex items-center gap-2">
                              {[2, 3, 4, 5, 6].map((t) => (
                                <button key={t} onClick={() => setTopLayers(t)} className={`w-9 h-9 rounded-lg border-2 text-sm transition-all ${topLayers === t ? 'border-forest bg-forest/5 text-forest' : 'border-gray-200 hover:border-gray-300'}`}>{t}</button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-charcoal mb-2 block">Bottom Layers</label>
                            <div className="flex items-center gap-2">
                              {[2, 3, 4, 5, 6].map((b) => (
                                <button key={b} onClick={() => setBottomLayers(b)} className={`w-9 h-9 rounded-lg border-2 text-sm transition-all ${bottomLayers === b ? 'border-forest bg-forest/5 text-forest' : 'border-gray-200 hover:border-gray-300'}`}>{b}</button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-charcoal mb-2 block flex items-center gap-1">
                            <Thermometer size={14} className="text-forest" /> Layer Height
                          </label>
                          <select value={layerHeight} onChange={(e) => setLayerHeight(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-white">
                            {layerOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-charcoal mb-2 block">Support Structures</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {supportOptions.map((o) => (
                              <button key={o.value} onClick={() => setSupport(o.value)} className={`p-2.5 rounded-lg border-2 text-sm transition-all ${support === o.value ? 'border-forest bg-forest/5 text-forest' : 'border-gray-200 hover:border-gray-300'}`}>{o.label}</button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-charcoal mb-2 block flex items-center gap-1">
                            <Sparkles size={14} className="text-forest" /> Surface Finish
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {finishOptions.map((o) => (
                              <button key={o.value} onClick={() => setFinish(o.value)} className={`p-2.5 rounded-lg border-2 text-sm transition-all ${finish === o.value ? 'border-forest bg-forest/5 text-forest' : 'border-gray-200 hover:border-gray-300'}`}>{o.label}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* RIGHT: Price Summary */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ScrollReveal>
                <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
                  <h3 className="text-lg font-semibold text-charcoal mb-5 flex items-center gap-2">
                    <DollarSign size={20} className="text-gold" /> Price Estimate
                  </h3>

                  {!file ? (
                    <div className="text-center py-8">
                      <Upload size={40} className="mx-auto mb-3 text-gray-200" />
                      <p className="text-sm text-gray-400">Upload a 3D model to see your estimate</p>
                    </div>
                  ) : volume <= 0 ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm text-gray-400">Analysing your model...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500"><span>Base fee</span><span>$8.00</span></div>
                        <div className="flex justify-between text-gray-500"><span>Material volume ({volume.toFixed(1)} cm³)</span><span>${(volume * 0.35).toFixed(2)}</span></div>
                        <div className="flex justify-between text-gray-500"><span>Material ({material})</span><span>×{materialFactor.toFixed(1)}</span></div>
                        <div className="flex justify-between text-gray-500"><span>Infill ({infill}%)</span><span>×{infillFactor.toFixed(2)}</span></div>
                        {advanced && (<>
                          <div className="flex justify-between text-gray-500"><span>Walls ({walls})</span><span>×{wallFactor.toFixed(2)}</span></div>
                          <div className="flex justify-between text-gray-500"><span>Layer height ({layerHeight}mm)</span><span>×{layerFactor.toFixed(2)}</span></div>
                          <div className="flex justify-between text-gray-500"><span>Supports</span><span>×{supportFactor.toFixed(2)}</span></div>
                          <div className="flex justify-between text-gray-500"><span>Finish</span><span>×{finishFactor.toFixed(2)}</span></div>
                        </>)}
                      </div>

                      <hr className="border-gray-100" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Price per unit</span>
                        <span className="text-lg font-semibold text-charcoal">${pricePerUnit.toFixed(2)}</span>
                      </div>

                      {quantity > 1 && (
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Quantity × {quantity}</span><span>${subtotal.toFixed(2)}</span>
                        </div>
                      )}

                      <hr className="border-gray-100" />

                      <div className="flex justify-between items-center pt-1">
                        <span className="font-semibold text-charcoal">Total Estimate</span>
                        <span className="text-2xl font-bold text-forest">${total.toFixed(2)} <span className="text-sm font-normal text-gray-400">NZD</span></span>
                      </div>

                      {quantity >= 50 && (
                        <div className="flex items-start gap-2 p-3 bg-gold/5 border border-gold/20 rounded-lg mt-3">
                          <Info size={16} className="text-gold shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-600">For orders of 50+, please <Link to="/contact" className="text-forest font-medium underline">contact us</Link> for custom pricing.</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400"><Clock size={14} /> Typical lead time: 48-72 hours</div>
                    <div className="flex items-center gap-2 text-xs text-gray-400"><Truck size={14} /> Nationwide delivery available</div>
                  </div>

                  {file && volume > 0 && (
                    <button
                      onClick={handleProceed}
                      className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gold text-forest-dark font-semibold rounded-lg hover:bg-gold-light transition-all"
                    >
                      Proceed to Order <Send size={16} />
                    </button>
                  )}

                  <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <p>This is an estimate only. Final pricing may vary based on printability review. We will confirm within 24 hours.</p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Material Guide Link Only */}
              <ScrollReveal className="mt-4">
                <Link
                  to="/materials"
                  className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 rounded-2xl text-sm text-forest font-medium hover:bg-cream transition-all bg-white"
                >
                  View full material guide <ArrowRight size={14} />
                </Link>
              </ScrollReveal>

              {/* Batch discount note */}
              <ScrollReveal className="mt-4">
                <div className="border border-gold/20 rounded-2xl p-5 bg-gold/5">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <span className="font-semibold text-gold">Production batch discounts available.</span> For orders of 10+ units, contact us for volume pricing.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
