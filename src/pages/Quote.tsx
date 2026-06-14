import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { useCart } from '../contexts/CartContext'
import SEO from '../components/SEO'
import ScrollReveal from '../components/ScrollReveal'
import { Link, useNavigate } from 'react-router-dom'
import {
  Upload, X, Box, DollarSign, Settings, ChevronDown, ChevronUp,
  Info, AlertCircle, Layers, Thermometer, Sparkles, ArrowRight, Send,
  Minus, Plus, Clock, Truck, Palette, Ruler, Weight
} from 'lucide-react'
import { useQuote, type PrintColor } from '../contexts/QuoteContext'
import ModelViewer, { type ModelAnalysis } from '../components/ModelViewer'

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


function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function AnalysisPanel({ analysis }: { analysis: ModelAnalysis | null }) {
  if (!analysis) return null

  const hours = Math.floor(analysis.estimatedTime / 60)
  const mins = Math.round(analysis.estimatedTime % 60)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
      <div className="bg-cream rounded-lg px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <Box size={12} className="text-forest" />
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Volume</span>
        </div>
        <p className="text-sm font-semibold text-charcoal">
          {analysis.volume.toFixed(1)} <span className="text-xs text-gray-400 font-normal">cm³</span>
        </p>
      </div>

      <div className="bg-cream rounded-lg px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <Ruler size={12} className="text-forest" />
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Dimensions</span>
        </div>
        <p className="text-sm font-semibold text-charcoal">
          {analysis.bounds.x.toFixed(1)}×{analysis.bounds.y.toFixed(1)}×{analysis.bounds.z.toFixed(1)}
        </p>
      </div>

      <div className="bg-cream rounded-lg px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <Weight size={12} className="text-forest" />
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Est. Weight</span>
        </div>
        <p className="text-sm font-semibold text-charcoal">
          {analysis.estimatedWeight.toFixed(1)} <span className="text-xs text-gray-400 font-normal">g</span>
        </p>
      </div>

      <div className="bg-cream rounded-lg px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <Clock size={12} className="text-forest" />
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Print Time</span>
        </div>
        <p className="text-sm font-semibold text-charcoal">
          {hours > 0 ? `${hours}h ` : ''}{mins}m
        </p>
      </div>
    </div>
  )
}

export default function Quote() {
    const navigate = useNavigate()
  const { file: ctxFile, setFile: setCtxFile, setConfig } = useQuote()
  const { addItem } = useCart()

  const [localFile, setLocalFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<ModelAnalysis | null>(null)
  const [material, setMaterial] = useState('PLA')
  const [quantity, setQuantity] = useState(1)
  const [printColor, setPrintColor] = useState<PrintColor>('black')
  const [scalePercent, setScalePercent] = useState(100)
  const [scaleInput, setScaleInput] = useState('100')
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

  const file = localFile || ctxFile

  const materialFactor = materials.find(m => m.name === material)?.factor ?? 1.0
  const infillFactor = infillOptions.find(o => o.value === infill)?.factor ?? 1.0
  const layerFactor = layerOptions.find(o => o.value === layerHeight)?.factor ?? 1.0
  const finishFactor = finishOptions.find(o => o.value === finish)?.factor ?? 1.0
  const supportFactor = supportOptions.find(o => o.value === support)?.factor ?? 1.0
  const wallFactor = 1 + (walls - 2) * 0.12
  const topFactor = 1 + (topLayers - 4) * 0.04
  const bottomFactor = 1 + (bottomLayers - 3) * 0.04
  const applyScale = useCallback((nextScale: number) => {
  const safeScale = Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 100
  const clampedScale = Math.max(10, Math.min(300, safeScale))

  setScalePercent(clampedScale)
  setScaleInput(String(Number(clampedScale.toFixed(1))))
}, [])

  const scaleFactor = scalePercent / 100

  const scaledAnalysis = useMemo(() => {
    if (!analysis) return null

    return {
      ...analysis,
      volume: analysis.volume * Math.pow(scaleFactor, 3),
      estimatedWeight: analysis.estimatedWeight * Math.pow(scaleFactor, 3),
      estimatedTime: analysis.estimatedTime * Math.pow(scaleFactor, 3),
      bounds: {
        x: analysis.bounds.x * scaleFactor,
        y: analysis.bounds.y * scaleFactor,
        z: analysis.bounds.z * scaleFactor,
      },
    }
  }, [analysis, scaleFactor])

  const vol = scaledAnalysis?.volume ?? 0

  const pricePerUnit = useMemo(() => {
    if (vol <= 0) return 0

    const base = 8
    const volCost = vol * 0.35
    const calculatedTotal =
      (base + volCost) *
      materialFactor *
      infillFactor *
      wallFactor *
      topFactor *
      bottomFactor *
      layerFactor *
      supportFactor *
      finishFactor

    return Math.max(calculatedTotal, 5)
  }, [
    vol,
    materialFactor,
    infillFactor,
    wallFactor,
    topFactor,
    bottomFactor,
    layerFactor,
    supportFactor,
    finishFactor,
  ])

  const subtotal = pricePerUnit * quantity
  const total = subtotal

  useEffect(() => {
    if (ctxFile && !localFile) {
      setLocalFile(ctxFile)
      setAnalysis(null)
    }
  }, [ctxFile, localFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const f = e.dataTransfer.files[0]

    if (f && (f.name.endsWith('.stl') || f.name.endsWith('.obj') || f.name.endsWith('.3mf'))) {
      setLocalFile(f)
      setCtxFile(f)
      setAnalysis(null)
    }
  }, [setCtxFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]

    if (f) {
      setLocalFile(f)
      setCtxFile(f)
      setAnalysis(null)
    }
  }, [setCtxFile])

  const clearFile = useCallback(() => {
    setLocalFile(null)
    setCtxFile(null)
    setAnalysis(null)
  }, [setCtxFile])

const handleAddToCart = useCallback(() => {
  if (!file || !analysis || !scaledAnalysis) return

  addItem({
    file,
    fileName: file.name,
    volume: scaledAnalysis.volume,
    dimensions: scaledAnalysis.bounds,
    material,
    quantity,
    color: printColor,
    scalePercent,
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

  clearFile()
}, [
  file,
  analysis,
  scaledAnalysis,
  addItem,
  material,
  quantity,
  printColor,
  scalePercent,
  infill,
  walls,
  topLayers,
  bottomLayers,
  layerHeight,
  support,
  finish,
  pricePerUnit,
  total,
  clearFile,
])

const handleProceed = useCallback(async () => {
  if (!file || !analysis || !scaledAnalysis) return

  const quoteConfig = {
      file,
      fileName: file.name,
      volume: scaledAnalysis.volume,
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
    }

    setCtxFile(file)
    setConfig(quoteConfig)

    try {
      const dataUrl = await fileToDataUrl(file)

      sessionStorage.setItem(
        'kiwikoru_quote_request',
        JSON.stringify({
          config: {
            fileName: file.name,
            volume: scaledAnalysis.volume,
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
          },
          file: {
            name: file.name,
            type: file.type || 'application/octet-stream',
            lastModified: file.lastModified,
            dataUrl,
          },
        })
      )
    } catch (err) {
      console.error('[QUOTE] Could not save quote file fallback', err)
    }

    navigate('/contact')
  }, [
    file,
    analysis,
    scaledAnalysis,
    material,
    quantity,
    printColor,
    infill,
    walls,
    topLayers,
    bottomLayers,
    layerHeight,
    support,
    finish,
    pricePerUnit,
    total,
    setCtxFile,
    setConfig,
     navigate,
  ])

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
            <div>
              {!file && (
                <ScrollReveal>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragOver(true)
                    }}
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
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".stl,.obj,.3mf"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
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
                        <span className="text-xs text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <button
                        onClick={clearFile}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Remove file"
                      >
                        <X size={16} className="text-gray-400" />
                      </button>
                    </div>

                    <div className="h-[400px] md:h-[450px]">
                      <ModelViewer
                        file={file}
                        color={printColor}
                        material={material}
                        onAnalysis={setAnalysis}
                      />
                    </div>

                    {scaledAnalysis && <AnalysisPanel analysis={scaledAnalysis} />}
                  </div>
                </ScrollReveal>
              )}

              {file && analysis && (
                <ScrollReveal className="mt-6">
                  <div className="border border-gray-200 rounded-2xl p-6 bg-white">
                    <h3 className="text-lg font-semibold text-charcoal mb-5 flex items-center gap-2">
                      <Settings size={20} className="text-forest" /> Print Configuration
                    </h3>

                    {analysis && scaledAnalysis && (
                      <div className="mb-5 border border-gray-200 rounded-2xl p-5 bg-cream">
                        <h4 className="text-sm font-semibold text-charcoal mb-4">
                          Scale / Dimensions
                        </h4>

                        <div className="grid sm:grid-cols-4 gap-4">
                          <div>
                            <label className="text-xs text-gray-400 uppercase tracking-wider">
                              Scale
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                            <input
  type="number"
  min="10"
  max="300"
  step="1"
  value={scaleInput}
  onChange={(e) => {
    const nextValue = e.target.value
    setScaleInput(nextValue)

    const nextNumber = Number(nextValue)
    if (Number.isFinite(nextNumber) && nextNumber > 0) {
      setScalePercent(nextNumber)
    }
  }}
  onBlur={() => {
    applyScale(Number(scaleInput))
  }}
  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
/>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-gray-400 uppercase tracking-wider">
                              X Width
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="number"
                                step="0.1"
                                value={Number(scaledAnalysis.bounds.x.toFixed(1))}
                                onChange={(e) => {
                                  const nextX = Number(e.target.value)
                                  if (!nextX || !analysis.bounds.x) return
                                  applyScale((nextX / analysis.bounds.x) * 100)
                                }}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                              />
                              <span className="text-sm text-gray-400">mm</span>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-gray-400 uppercase tracking-wider">
                              Y Height
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="number"
                                step="0.1"
                                value={Number(scaledAnalysis.bounds.y.toFixed(1))}
                                onChange={(e) => {
                                  const nextY = Number(e.target.value)
                                  if (!nextY || !analysis.bounds.y) return
                                  applyScale((nextY / analysis.bounds.y) * 100)
                                }}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                              />
                              <span className="text-sm text-gray-400">mm</span>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-gray-400 uppercase tracking-wider">
                              Z Depth
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="number"
                                step="0.1"
                                value={Number(scaledAnalysis.bounds.z.toFixed(1))}
                                onChange={(e) => {
                                  const nextZ = Number(e.target.value)
                                  if (!nextZ || !analysis.bounds.z) return
                                 applyScale((nextZ / analysis.bounds.z) * 100)
                                }}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                              />
                              <span className="text-sm text-gray-400">mm</span>
                            </div>
                          </div>
                        </div>

                        <p className="mt-3 text-xs text-gray-400">
                          Changing one dimension scales the model proportionally. Volume, weight,
                          print time and price update automatically.
                        </p>
                      </div>
                    )}

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
                            <span className="text-sm font-semibold" style={{ color: m.color }}>
                              {m.name}
                            </span>
                            <span className="block text-[10px] text-gray-400 mt-0.5">
                              {m.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-5 grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium text-charcoal mb-2 block">Quantity</label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="w-16 text-center text-lg font-semibold">{quantity}</span>

                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus size={16} />
                          </button>

                          {quantity >= 2 && (
                            <span className="text-sm text-gold font-medium ml-2">
                              {getBulkLabel(quantity)}
                            </span>
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
                              style={
                                c.id === 'other'
                                  ? { background: c.bg }
                                  : { backgroundColor: c.bg, borderColor: c.border }
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>

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
                          <select
                            value={infill}
                            onChange={(e) => setInfill(Number(e.target.value))}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-white"
                          >
                            {infillOptions.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-charcoal mb-2 block">Wall Count</label>
                          <div className="flex items-center gap-3">
                            {[1, 2, 3, 4, 5].map((w) => (
                              <button
                                key={w}
                                onClick={() => setWalls(w)}
                                className={`w-10 h-10 rounded-lg border-2 text-sm font-medium transition-all ${
                                  walls === w ? 'border-forest bg-forest/5 text-forest' : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                {w}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-charcoal mb-2 block">Top Layers</label>
                            <div className="flex items-center gap-2">
                              {[2, 3, 4, 5, 6].map((t) => (
                                <button
                                  key={t}
                                  onClick={() => setTopLayers(t)}
                                  className={`w-9 h-9 rounded-lg border-2 text-sm transition-all ${
                                    topLayers === t ? 'border-forest bg-forest/5 text-forest' : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-charcoal mb-2 block">Bottom Layers</label>
                            <div className="flex items-center gap-2">
                              {[2, 3, 4, 5, 6].map((b) => (
                                <button
                                  key={b}
                                  onClick={() => setBottomLayers(b)}
                                  className={`w-9 h-9 rounded-lg border-2 text-sm transition-all ${
                                    bottomLayers === b ? 'border-forest bg-forest/5 text-forest' : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  {b}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-charcoal mb-2 block flex items-center gap-1">
                            <Thermometer size={14} className="text-forest" /> Layer Height
                          </label>
                          <select
                            value={layerHeight}
                            onChange={(e) => setLayerHeight(Number(e.target.value))}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-white"
                          >
                            {layerOptions.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-charcoal mb-2 block">Support Structures</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {supportOptions.map((o) => (
                              <button
                                key={o.value}
                                onClick={() => setSupport(o.value)}
                                className={`p-2.5 rounded-lg border-2 text-sm transition-all ${
                                  support === o.value ? 'border-forest bg-forest/5 text-forest' : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                {o.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-charcoal mb-2 block flex items-center gap-1">
                            <Sparkles size={14} className="text-forest" /> Surface Finish
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {finishOptions.map((o) => (
                              <button
                                key={o.value}
                                onClick={() => setFinish(o.value)}
                                className={`p-2.5 rounded-lg border-2 text-sm transition-all ${
                                  finish === o.value ? 'border-forest bg-forest/5 text-forest' : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                {o.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              )}
            </div>

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
                  ) : !analysis ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm text-gray-400">Analysing your model...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500"><span>Base fee</span><span>$8.00</span></div>
                        <div className="flex justify-between text-gray-500"><span>Material volume ({vol.toFixed(1)} cm³)</span><span>${(vol * 0.35).toFixed(2)}</span></div>
                        <div className="flex justify-between text-gray-500"><span>Material ({material})</span><span>×{materialFactor.toFixed(1)}</span></div>
                        <div className="flex justify-between text-gray-500"><span>Infill ({infill}%)</span><span>×{infillFactor.toFixed(2)}</span></div>

                        {advanced && (
                          <>
                            <div className="flex justify-between text-gray-500"><span>Walls ({walls})</span><span>×{wallFactor.toFixed(2)}</span></div>
                            <div className="flex justify-between text-gray-500"><span>Layer height ({layerHeight}mm)</span><span>×{layerFactor.toFixed(2)}</span></div>
                            <div className="flex justify-between text-gray-500"><span>Supports</span><span>×{supportFactor.toFixed(2)}</span></div>
                            <div className="flex justify-between text-gray-500"><span>Finish</span><span>×{finishFactor.toFixed(2)}</span></div>
                          </>
                        )}
                      </div>

                      <hr className="border-gray-100" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Price per unit</span>
                        <span className="text-lg font-semibold text-charcoal">${pricePerUnit.toFixed(2)}</span>
                      </div>

                      {quantity > 1 && (
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Quantity × {quantity}</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                      )}

                      <hr className="border-gray-100" />

                      <div className="flex justify-between items-center pt-1">
                        <span className="font-semibold text-charcoal">Total Estimate</span>
                        <span className="text-2xl font-bold text-forest">
                          ${total.toFixed(2)} <span className="text-sm font-normal text-gray-400">NZD</span>
                        </span>
                      </div>

                      {quantity >= 50 && (
                        <div className="flex items-start gap-2 p-3 bg-gold/5 border border-gold/20 rounded-lg mt-3">
                          <Info size={16} className="text-gold shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-600">
                            For orders of 50+, please <Link to="/contact" className="text-forest font-medium underline">contact us</Link> for custom pricing.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock size={14} /> Typical lead time: 48-72 hours
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Truck size={14} /> Nationwide delivery available
                    </div>
                  </div>

                  {file && analysis && (
  <div className="mt-6 space-y-2">
    <button
      onClick={handleAddToCart}
      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-forest text-forest font-semibold rounded-lg hover:bg-forest hover:text-white transition-all"
    >
      Add to Cart <Plus size={16} />
    </button>

    <button
      onClick={handleProceed}
      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gold text-forest-dark font-semibold rounded-lg hover:bg-gold-light transition-all"
    >
      Proceed to Order <Send size={16} />
    </button>
  </div>
)}

                  <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <p>
                      This is an estimate only. Final pricing may vary based on printability review. We will confirm within 24 hours.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal className="mt-4">
                <Link
                  to="/materials"
                  className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 rounded-2xl text-sm text-forest font-medium hover:bg-cream transition-all bg-white"
                >
                  View full material guide <ArrowRight size={14} />
                </Link>
              </ScrollReveal>

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
