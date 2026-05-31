import { useState, useRef, useCallback } from 'react'
import { Upload, X, File, Zap, Lightbulb, PenTool, Layers, RotateCcw } from 'lucide-react'
import ParticleCanvas from '../components/ParticleCanvas'
import ScrollReveal from '../components/ScrollReveal'
import SEO, { generateBreadcrumbSchema } from '../components/SEO'
import STLViewer from '../components/STLViewer'
import EstimateTool from '../components/EstimateTool'
import { trpc } from '@/providers/trpc'

interface UploadedFile {
  id: string
  name: string
  size: string
  type: string
}

export default function Quote() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', description: '', quantity: '1', material: 'No preference',
  })
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitMsg, setSubmitMsg] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [modelInfo, setModelInfo] = useState<{ volume: number; dimensions: { x: number; y: number; z: number } } | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToContactForm = () => {
    const el = document.getElementById('contact-form-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const sendQuote = trpc.email.sendQuote.useMutation({
    onSuccess: (data) => {
      setSubmitted(true)
      setSubmitMsg(data.message)
      setFormData({ name: '', email: '', phone: '', description: '', quantity: '1', material: 'No preference' })
      setFiles([])
      setAgreed(false)
      setModelInfo(undefined)
    },
    onError: (error) => {
      setSubmitMsg(error.message || 'Failed to send. Please try again or email us directly.')
    },
  })

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return
    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`,
      type: file.name.split('.').pop()?.toUpperCase() || '',
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id))

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) return
    sendQuote.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      description: formData.description,
      quantity: formData.quantity,
      material: formData.material,
      files: files.map((f) => f.name),
    })
  }

  const schema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://kiwikoru3d.com/' },
    { name: 'Get a Quote', url: 'https://kiwikoru3d.com/quote' },
  ])

  return (
    <>
      <SEO
        title="Get a Quote | 3D Printing NZ | Upload STL | KiwiKoru 3D"
        description="Get an instant estimate for your 3D printing project. Upload STL, STEP, or OBJ files and preview in 3D. Custom 3D printing in Whangārei. NZ made."
        path="/quote"
        schema={schema}
      />

      {/* Hero */}
      <section className="relative min-h-[320px] md:min-h-[40vh] bg-forest flex items-center justify-center" aria-label="Quote hero">
        <ParticleCanvas count={15} />
        <div className="relative z-10 text-center px-6 max-w-[600px]">
          <ScrollReveal>
            <h1 className="text-[36px] md:text-[48px] font-extrabold text-white leading-tight">Get a Free Estimate</h1>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="mt-4 text-white/70 text-base leading-relaxed">
              Upload your 3D files, preview your model, and get an estimated price.
              We'll get back to you with a detailed quote within 24 hours.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 3D Viewer + Estimate Tool */}
      <section className="bg-off-white py-[60px] md:py-[80px]" aria-label="3D Model Viewer and Price Estimator">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-[28px] md:text-[36px] font-bold text-charcoal">Preview Your Model</h2>
              <p className="mt-2 text-charcoal-light">Upload an STL or OBJ file to view it in 3D and get an instant price estimate.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
            <ScrollReveal>
              <STLViewer onFileLoad={(vol, dims) => setModelInfo({ volume: vol, dimensions: dims })} />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <EstimateTool modelInfo={modelInfo} onContact={scrollToContactForm} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* No STL? No problem — Lead Generation */}
      <section className="bg-forest py-12" aria-label="Design services for non-technical customers">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <ScrollReveal>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Lightbulb size={20} className="text-gold" />
              <span className="text-gold font-semibold text-sm tracking-wide uppercase">No STL? No problem.</span>
            </div>
            <p className="text-white/80 text-base leading-relaxed max-w-[600px] mx-auto">
              We can design your idea from a sketch, photo, drawing, or simple description.
              Our team handles CAD design, product development, reverse engineering, and concept development — not just 3D printing.
            </p>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[600px] mx-auto">
              {[
                { icon: PenTool, label: 'CAD Design' },
                { icon: Lightbulb, label: 'Product Development' },
                { icon: RotateCcw, label: 'Reverse Engineering' },
                { icon: Layers, label: 'Concept Development' },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-2 bg-white/5 rounded-lg py-4 px-3">
                  <s.icon size={20} className="text-gold" />
                  <span className="text-white/70 text-xs font-medium">{s.label}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quote Form */}
      <section id="contact-form-section" className="bg-white py-[60px] md:py-[100px]" aria-label="Project submission form">
        <div className="max-w-[720px] mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-[28px] md:text-[36px] font-bold text-charcoal">Submit Your Project</h2>
              <p className="mt-2 text-charcoal-light">Tell us about your project and upload your files. We accept STL, STEP, OBJ, PDF, JPG, PNG, and sketches.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="bg-white border border-border-light rounded-xl p-8 md:p-10 shadow-sm">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4">
                    <Zap size={28} className="text-gold" />
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal">Quote Request Sent!</h3>
                  <p className="mt-2 text-sm text-charcoal-light max-w-[400px] mx-auto">{submitMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Your Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal mb-4">Your Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="q-name" className="block text-sm font-medium text-charcoal mb-1.5">Name <span className="text-red-500">*</span></label>
                        <input id="q-name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" className="w-full border border-border-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                      </div>
                      <div>
                        <label htmlFor="q-email" className="block text-sm font-medium text-charcoal mb-1.5">Email <span className="text-red-500">*</span></label>
                        <input id="q-email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" className="w-full border border-border-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="q-phone" className="block text-sm font-medium text-charcoal mb-1.5">Phone <span className="text-charcoal-light font-normal">(optional)</span></label>
                      <input id="q-phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+64 21 123 4567" className="w-full border border-border-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                    </div>
                  </div>

                  {/* Project Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal mb-4">Project Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="q-desc" className="block text-sm font-medium text-charcoal mb-1.5">Project Description <span className="text-red-500">*</span></label>
                        <textarea id="q-desc" required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your project — what the part is for, dimensions, material preference, quantity, finish requirements..." className="w-full border border-border-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-vertical" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="q-qty" className="block text-sm font-medium text-charcoal mb-1.5">Quantity</label>
                          <select id="q-qty" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="w-full border border-border-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white">
                            {['1', '2-5', '6-10', '11-25', '25+'].map((q) => (<option key={q}>{q}</option>))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="q-mat" className="block text-sm font-medium text-charcoal mb-1.5">Material Preference</label>
                          <select id="q-mat" value={formData.material} onChange={(e) => setFormData({ ...formData, material: e.target.value })} className="w-full border border-border-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white">
                            {['No preference — recommend', 'PLA', 'PETG', 'ASA', 'TPU Flexible', 'Not sure — need advice'].map((m) => (<option key={m}>{m}</option>))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal mb-4">Upload Your Files</h3>
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${dragOver ? 'border-gold bg-gold/5' : 'border-border-light hover:border-gold/50 hover:bg-gold/[0.02]'}`}
                      role="button" tabIndex={0} aria-label="Drop files here or click to browse"
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
                    >
                      <input ref={fileInputRef} type="file" multiple accept=".stl,.step,.stp,.obj,.pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />
                      <Upload size={48} className={`mx-auto mb-3 ${dragOver ? 'text-gold' : 'text-gold/50'}`} />
                      <p className="text-charcoal-light text-sm">Drag &amp; drop your files here</p>
                      <p className="text-gold text-sm mt-1">or click to browse</p>
                      <p className="text-charcoal-light text-xs mt-3">STL, STEP, OBJ, PDF, JPG, PNG (max 50MB each)</p>
                    </div>
                    {files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {files.map((f) => (
                          <div key={f.id} className="flex items-center gap-3 bg-forest/[0.04] rounded-lg px-4 py-3">
                            <File size={18} className="text-forest shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-charcoal truncate">{f.name}</p>
                              <p className="text-xs text-charcoal-light">{f.size} · {f.type}</p>
                            </div>
                            <button type="button" onClick={() => removeFile(f.id)} className="text-charcoal-light hover:text-red-500 transition-colors p-1 focus-gold" aria-label={`Remove ${f.name}`}>
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="mt-3 text-xs text-charcoal-light/70 italic text-center">
                      Don't have a 3D model? We can help design and develop your project from scratch.
                    </p>
                  </div>

                  {/* Terms + Submit */}
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 rounded border-border-light text-gold focus:ring-gold" />
                      <span className="text-sm text-charcoal-light">I agree to the <span className="text-gold">Terms of Service</span> and <span className="text-gold">Privacy Policy</span></span>
                    </label>
                    <button type="submit" disabled={!agreed || sendQuote.isPending} className="w-full bg-gold text-forest font-semibold py-4 rounded-lg transition-all duration-200 hover:bg-gold-light hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 focus-gold flex items-center justify-center gap-2">
                      {sendQuote.isPending ? <><div className="w-5 h-5 border-2 border-forest/30 border-t-forest rounded-full animate-spin" /> Sending...</> : 'Request Your Quote'}
                    </button>
                    {submitMsg && !submitted && (
                      <p className="text-center text-sm text-red-500">{submitMsg}</p>
                    )}
                    <p className="text-center text-xs text-charcoal-light">We'll review your files and respond within 24 hours with a detailed quote.</p>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Alternative Contact */}
      <section className="bg-off-white py-12" aria-label="Alternative contact method">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <ScrollReveal>
            <p className="text-charcoal-light">Prefer to email your files directly? Send them to{' '}
              <a href="mailto:kiwikoru3d@gmail.com" className="text-gold font-medium hover:underline focus-gold">kiwikoru3d@gmail.com</a>{' '}with your project details.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
