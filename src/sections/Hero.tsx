import { useRef, useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ArrowRight, HelpCircle, Upload, Sparkles } from 'lucide-react'
import { useQuote } from '../contexts/QuoteContext'

/* ─── Floating dots only ─── */
function FloatingParticles() {
  const groupRef = useRef<THREE.Group>(null)

  const dots = useMemo(() => {
    const d: { pos: [number, number, number]; size: number; color: string; speed: number; phase: number }[] = []
    const colors = ['#C9A96E', '#A3C4A0', '#8BA888', '#D4BA8A', '#5a8a6a', '#C9A96E', '#7ab88a']

    for (let i = 0; i < 75; i++) {
      d.push({
        pos: [(Math.random() - 0.5) * 28, (Math.random() - 0.5) * 18, (Math.random() - 0.5) * 10 - 3],
        size: 0.012 + Math.random() * 0.065,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.5 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return d
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    groupRef.current.rotation.y = Math.sin(t * 0.018) * 0.06

    dots.forEach((dot, i) => {
      const mesh = groupRef.current!.children[i] as THREE.Mesh
      if (mesh) {
        mesh.position.y = dot.pos[1] + Math.sin(t * dot.speed * 0.8 + dot.phase) * 0.3
      }
    })
  })

  return (
    <group ref={groupRef}>
      {dots.map((dot, i) => (
        <mesh key={`d-${i}`} position={dot.pos}>
          <sphereGeometry args={[dot.size, 4, 4]} />
          <meshBasicMaterial color={dot.color} transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Upload block ─── */
function UploadBlock() {
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setFile } = useQuote()

  const goToQuote = useCallback((f: File) => {
    setFile(f)
    window.location.hash = '/quote'
  }, [setFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f && (f.name.endsWith('.stl') || f.name.endsWith('.obj') || f.name.endsWith('.3mf'))) {
      goToQuote(f)
    }
  }, [goToQuote])

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) goToQuote(f)
  }, [goToQuote])

  const containerClass = dragOver
    ? 'border-gold bg-gold/10 scale-[1.02] shadow-[0_0_40px_rgba(201,169,110,0.2)]'
    : 'border-white/20 bg-white/[0.03] backdrop-blur-md hover:border-gold/50 hover:bg-white/[0.06]'

  const iconBoxClass = dragOver
    ? 'bg-gold/20 shadow-[0_0_30px_rgba(201,169,110,0.3)]'
    : 'bg-white/5 group-hover:bg-gold/10'

  const iconClass = dragOver ? 'text-gold' : 'text-white/40 group-hover:text-gold/70'
  const titleClass = dragOver ? 'text-gold' : 'text-white/90 group-hover:text-white'
  const badgeClass = dragOver ? 'bg-gold/20 border-gold/40' : 'bg-white/[0.04] border-white/10'
  const contentScale = dragOver ? 'scale-110' : 'group-hover:scale-105'
  const glowOpacity = dragOver ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'

  return (
    <div
      onDragOver={(ev) => { ev.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={'relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-500 w-[320px] md:w-[380px] h-[420px] flex flex-col items-center justify-center text-center p-8 overflow-hidden ' + containerClass}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold/40 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/40 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold/40 rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold/40 rounded-br-2xl" />

      {/* Floating particles inside upload block */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-8 left-8 w-1.5 h-1.5 rounded-full bg-gold/30 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-16 right-12 w-1 h-1 rounded-full bg-gold/20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4s' }} />
        <div className="absolute bottom-12 left-16 w-1 h-1 rounded-full bg-gold/25 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }} />
        <div className="absolute bottom-20 right-8 w-1.5 h-1.5 rounded-full bg-gold/20 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }} />
      </div>

      {/* Content */}
      <div className={'relative z-10 transition-transform duration-500 ' + contentScale}>
        <div className={'w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-500 ' + iconBoxClass}>
          <Upload size={36} className={'transition-colors duration-500 ' + iconClass} />
        </div>

        <p className={'text-lg font-semibold transition-colors duration-300 ' + titleClass}>
          {dragOver ? 'Drop your file here' : 'Upload Your 3D Model'}
        </p>
        <p className="text-white/40 text-sm mt-2">STL &middot; OBJ &middot; 3MF</p>
      </div>

      {/* Bottom badge */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <div className={'flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ' + badgeClass}>
          <Sparkles size={14} className="text-gold/60" />
          <span className="text-white/50 text-xs font-medium">Instant Quote</span>
        </div>
      </div>

      {/* Glow ring */}
      <div className={'absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.08)_0%,transparent_70%)] ' + glowOpacity} />

      <input ref={fileInputRef} type="file" accept=".stl,.obj,.3mf" className="hidden" onChange={handleFile} />
    </div>
  )
}

/* ─── Hero ─── */
export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] bg-forest flex items-center overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 14], fov: 55 }} dpr={[1, 1]}>
          <FloatingParticles />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-white leading-none tracking-tight">
              <span className="block text-5xl md:text-7xl font-bold">YOUR IDEAS.</span>
              <span className="block text-5xl md:text-7xl font-bold text-gold mt-2">MADE IN REAL 3D.</span>
            </h1>
            <p className="mt-6 text-white/60 text-lg leading-relaxed max-w-lg">
              Professional 3D printing and product development in New Zealand. From rapid prototypes to finished products, we bring your concepts to life.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/quote" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold text-forest-dark font-semibold rounded-lg hover:bg-gold-light transition-all duration-300 hover:-translate-y-0.5">
                GET INSTANT ESTIMATE <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300">
                <HelpCircle size={18} /> NEED HELP WITH YOUR PROJECT?
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <UploadBlock />
          </div>
        </div>
      </div>
    </section>
  )
}
