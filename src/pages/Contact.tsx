import { useState, useRef, type FormEvent, useEffect } from 'react'
import SEO from '../components/SEO'
import ScrollReveal from '../components/ScrollReveal'
import { Link } from 'react-router-dom'
import {
Mail, Phone, MapPin, Send, CheckCircle, Upload, X,
ArrowRight, Clock, MessageSquare, Loader2, AlertCircle
} from 'lucide-react'
import { useQuote } from '../contexts/QuoteContext'
import { trpc } from '@/providers/trpc'

const projectTypes = [
'Rapid Prototyping',
'Custom Manufacturing',
'Replacement Parts',
'Product Development',
'Engineering Solutions',
'Corporate Branding',
'Other',
]

const subjects = [
'General Enquiry',
'Get a Quote',
'Project Discussion',
'Material Question',
'Order Status',
'Partnership',
'Other',
]

const CONTACT_EMAIL = 'kiwikoru3d@gmail.com'
const MAX_ATTACHMENT_MB = 3
const MAX_ATTACHMENT_BYTES = MAX_ATTACHMENT_MB * 1024 * 1024
const MAX_ATTACHMENT_FILES = 5

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  return `${(bytes / 1024).toFixed(0)} KB`
}

function getFilesTotalSize(files: File[]): number {
  return files.reduce((sum, file) => sum + file.size, 0)
}

function buildQuoteMessage(config: NonNullable<ReturnType<typeof useQuote>['config']>): string {
  const largeFileWarning = (config as { largeFileWarning?: string }).largeFileWarning

  const lines = [
    `=== Quote Request ===`,
    ``,
    `File: ${config.fileName}`,
    `Volume: ${config.volume.toFixed(1)} cm³`,
    `Material: ${config.material}`,
    `Colour: ${config.color.charAt(0).toUpperCase() + config.color.slice(1)}`,
    `Quantity: ${config.quantity}`,
    `Price per unit: $${config.pricePerUnit.toFixed(2)} NZD`,
    `Total estimate: $${config.total.toFixed(2)} NZD`,
    ...(largeFileWarning
      ? [
          ``,
          `--- File Attachment Note ---`,
          largeFileWarning,
        ]
      : []),
    ``,
    `--- Print Settings ---`,
    `Infill: ${config.infill}%`,
    `Walls: ${config.walls}`,
    `Top layers: ${config.topLayers}`,
    `Bottom layers: ${config.bottomLayers}`,
    `Layer height: ${config.layerHeight}mm`,
    `Supports: ${config.support}`,
    `Finish: ${config.finish}`,
    ``,
    `=== Additional Notes ===`,
    ``,
  ]

  return lines.join('\n')
}

function fileToBase64(file: File): Promise<string> {
return new Promise((resolve, reject) => {
const reader = new FileReader()


reader.onload = () => {
  const result = reader.result as string
  const base64 = result.split(',')[1]
  resolve(base64)
}

reader.onerror = reject
reader.readAsDataURL(file)


})
}


async function dataUrlToFile(dataUrl: string, name: string, type: string, lastModified?: number): Promise<File> {
  const response = await fetch(dataUrl)
  const blob = await response.blob()
  return new File([blob], name, {
    type: type || 'application/octet-stream',
    lastModified: lastModified || Date.now(),
  })
}

export default function Contact() {
const { config, setConfig, file: quoteFile, setFile: setQuoteFile } = useQuote()
const [submitted, setSubmitted] = useState(false)
const [submitting, setSubmitting] = useState(false)
const [error, setError] = useState('')
const [files, setFiles] = useState<File[]>([])
const [emailNote, setEmailNote] = useState('')
const [attachmentWarning, setAttachmentWarning] = useState('')
const fileInputRef = useRef<HTMLInputElement>(null)

const [form, setForm] = useState({
name: '',
company: '',
email: '',
phone: '',
subject: 'General Enquiry',
projectType: '',
message: '',
})

const createEnquiry = trpc.enquiry.create.useMutation()
const sendEmail = trpc.email.send.useMutation()

useEffect(() => {
  let cancelled = false

  async function loadQuoteRequest() {
    let nextConfig = config
    let nextFile = config?.file || quoteFile

    if (!nextConfig) {
      const savedQuote = sessionStorage.getItem('kiwikoru_quote_request')

      if (savedQuote) {
        try {
          const parsed = JSON.parse(savedQuote)
          nextConfig = parsed.config

          if (!nextFile && parsed.file?.dataUrl) {
            nextFile = await dataUrlToFile(
              parsed.file.dataUrl,
              parsed.file.name,
              parsed.file.type,
              parsed.file.lastModified
            )
          }
        } catch (err) {
          console.error('[CONTACT] Could not read quote fallback', err)
        }
      }
    }

    if (cancelled || !nextConfig) return

    setForm(f => ({
      ...f,
      subject: 'Get a Quote',
      message: buildQuoteMessage(nextConfig),
    }))

    if (nextFile) {
      if (nextFile.size <= MAX_ATTACHMENT_BYTES) {
        setFiles([nextFile])
        setAttachmentWarning('')
      } else {
        setFiles([])
        setAttachmentWarning(
          `This file is ${formatFileSize(nextFile.size)}, which is larger than the ${MAX_ATTACHMENT_MB} MB attachment limit. Please email the file or a download link to ${CONTACT_EMAIL}.`
        )
      }
    } else if ((nextConfig as { largeFileWarning?: string }).largeFileWarning) {
      setAttachmentWarning((nextConfig as { largeFileWarning?: string }).largeFileWarning || '')
    }

    setConfig(null)
    setQuoteFile(null)
    sessionStorage.removeItem('kiwikoru_quote_request')
  }

  loadQuoteRequest()

  return () => {
    cancelled = true
  }
}, [config, quoteFile, setConfig, setQuoteFile])

const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFiles = Array.from(e.target.files || [])

  if (selectedFiles.length === 0) return

  setFiles((prev) => {
    const nextFiles = [...prev]
    const skippedFiles: string[] = []

    for (const file of selectedFiles) {
      if (nextFiles.length >= MAX_ATTACHMENT_FILES) {
        skippedFiles.push(`${file.name} (too many files)`)
        continue
      }

      const nextTotal = getFilesTotalSize(nextFiles) + file.size

      if (nextTotal > MAX_ATTACHMENT_BYTES) {
        skippedFiles.push(`${file.name} (${formatFileSize(file.size)})`)
        continue
      }

      nextFiles.push(file)
    }

    if (skippedFiles.length > 0) {
      setAttachmentWarning(
        `Attachments must be under ${MAX_ATTACHMENT_MB} MB total. These files were not attached: ${skippedFiles.join(', ')}. Please email larger files or a download link to ${CONTACT_EMAIL}.`
      )
    } else {
      setAttachmentWarning('')
    }

    return nextFiles
  })

  if (fileInputRef.current) {
    fileInputRef.current.value = ''
  }
}

const removeFile = (index: number) => {
  setFiles(prev => {
    const nextFiles = prev.filter((_, i) => i !== index)

    if (getFilesTotalSize(nextFiles) <= MAX_ATTACHMENT_BYTES) {
      setAttachmentWarning('')
    }

    return nextFiles
  })
}

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  setSubmitting(true)
  setError('')
  setEmailNote('')

  try {
    const totalAttachmentSize = getFilesTotalSize(files)
    const filesToSend = totalAttachmentSize <= MAX_ATTACHMENT_BYTES ? files : []

    if (files.length > 0 && filesToSend.length === 0) {
      setAttachmentWarning(
        `Attachments must be under ${MAX_ATTACHMENT_MB} MB total. Your selected files total ${formatFileSize(totalAttachmentSize)}. Please email larger files or a download link to ${CONTACT_EMAIL}.`
      )
    }

    const emailFiles = await Promise.all(
      filesToSend.map(async (file) => ({
        name: file.name,
        type: file.type || 'application/octet-stream',
        content: await fileToBase64(file),
      }))
    )

    const emailResult = await sendEmail.mutateAsync({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
      company: form.company || undefined,
      phone: form.phone || undefined,
      projectType: form.projectType || undefined,
      files: emailFiles,
    })

    if (emailResult.note) {
      setEmailNote(emailResult.note)
    }

    try {
      await createEnquiry.mutateAsync({
        name: form.name,
        company: form.company || undefined,
        email: form.email,
        phone: form.phone || undefined,
        subject: form.subject,
        projectType: form.projectType || undefined,
        message: form.message,
      })
    } catch (dbErr) {
      console.warn('Enquiry DB save failed, but email was already sent:', dbErr)
    }

    setSubmitting(false)
    setSubmitted(true)
  } catch (err: any) {
    setSubmitting(false)
    setError(err?.message || 'Something went wrong. Please try again.')
  }
}

const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all bg-white'
const labelClass = 'text-sm font-medium text-charcoal mb-1.5 block'

return (
<> <SEO
     title="Contact KiwiKoru 3D | 3D Printing NZ"
     description="Get in touch with KiwiKoru 3D for custom 3D printing, rapid prototyping, and product development services in New Zealand."
     path="/contact"
   />

  <section className="bg-forest pt-28 pb-10">
    <div className="max-w-7xl mx-auto px-6">
      <ScrollReveal>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Contact <span className="text-gold">Us</span>
        </h1>
        <p className="mt-3 text-white/60 max-w-xl">
          Have a project in mind? Send us a message and we will get back to you within 24 hours.
        </p>
      </ScrollReveal>
    </div>
  </section>

  <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-[1fr_380px] gap-12">
        <ScrollReveal>
          {submitted ? (
            <div className="border border-gray-200 rounded-2xl p-12 text-center bg-cream">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={32} className="text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-charcoal mb-3">Message Sent!</h2>

              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Thank you for reaching out. We have received your enquiry and will respond within 24 hours.
              </p>

              {emailNote && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-4 py-2 mb-8 max-w-md mx-auto">
                  {emailNote}
                </p>
              )}

              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/quote"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-forest-dark font-semibold rounded-lg hover:bg-gold-light transition-all"
                >
                  Get a Quote <ArrowRight size={16} />
                </Link>

                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({
                      name: '',
                      company: '',
                      email: '',
                      phone: '',
                      subject: 'General Enquiry',
                      projectType: '',
                      message: '',
                    })
                    setFiles([])
                    setAttachmentWarning('')
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-charcoal font-medium rounded-lg hover:bg-gray-50 transition-all"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Company</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    placeholder="Your company (optional)"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+64 ..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Subject *</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className={inputClass}
                  >
                    {subjects.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Project Type</label>
                  <select
                    value={form.projectType}
                    onChange={e => setForm(f => ({ ...f, projectType: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="">Select project type</option>
                    {projectTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Message *</label>
                <textarea
                  required
                  rows={10}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us about your project..."
                  className={`${inputClass} resize-none text-sm leading-relaxed`}
                />
              </div>

              <div>
                <label className={labelClass}>Attachments</label>
                <p className="text-xs text-gray-500 mb-2">
                  Attachments must be under {MAX_ATTACHMENT_MB} MB total. For larger files or multiple large files, please email them or send a download link to{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-forest underline">
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>

                {attachmentWarning && (
                  <div className="mb-3 flex items-start gap-2 rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm text-gray-700">
                    <AlertCircle size={16} className="text-gold shrink-0 mt-0.5" />
                    <p>
                      {attachmentWarning}{' '}
                      <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-forest underline">
                        {CONTACT_EMAIL}
                      </a>
                    </p>
                  </div>
                )}

                <div className="border border-gray-200 border-dashed rounded-lg p-4">
                  {files.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {files.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-cream rounded-lg px-3 py-2 text-sm"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Upload size={14} className="text-forest shrink-0" />
                            <span className="truncate text-gray-600">{file.name}</span>
                            <span className="text-gray-400 text-xs shrink-0">
                              ({formatFileSize(file.size)})
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors shrink-0"
                          >
                            <X size={14} className="text-gray-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload size={16} /> Attach files under 3 MB total
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".stl,.obj,.3mf,.pdf,.png,.jpg,.jpeg,.step,.stp"
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  <p className="text-xs text-gray-400 mt-2">Max {MAX_ATTACHMENT_FILES} files, {MAX_ATTACHMENT_MB} MB total. Larger files should be emailed to {CONTACT_EMAIL}.</p>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-forest-dark font-semibold rounded-lg hover:bg-gold-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </ScrollReveal>

        <div className="space-y-6">
          <ScrollReveal>
            <div className="border border-gray-200 rounded-2xl p-6 bg-cream">
              <h3 className="text-lg font-semibold text-charcoal mb-5">Contact Information</h3>

              <div className="space-y-4">
                <a href="mailto:kiwikoru3d@gmail.com" className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-forest/5 rounded-lg flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-forest" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-charcoal group-hover:text-forest transition-colors">
                      kiwikoru3d@gmail.com
                    </p>
                    <p className="text-xs text-gray-400">Email us anytime</p>
                  </div>
                </a>

                <a href="tel:+640272602954" className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-forest/5 rounded-lg flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-forest" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-charcoal group-hover:text-forest transition-colors">
                      +64 027 260 2954
                    </p>
                    <p className="text-xs text-gray-400">Mon–Fri, 8am–5pm NZST</p>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-forest/5 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-forest" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-charcoal">Whangārei, Northland</p>
                    <p className="text-xs text-gray-400">New Zealand</p>
                  </div>
                </div>

                <a
                  href="https://wa.me/640272602954?text=Hi%20KiwiKoru%2C%20I%27m%20interested%20in%20your%203D%20printing%20services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 bg-[#25D366]/10 rounded-lg flex items-center justify-center shrink-0">
                    <MessageSquare size={18} className="text-[#25D366]" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-charcoal group-hover:text-[#25D366] transition-colors">
                      WhatsApp
                    </p>
                    <p className="text-xs text-gray-400">Quick chat on WhatsApp</p>
                  </div>
                </a>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="border border-gray-200 rounded-2xl p-6 bg-white">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Business Hours</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Monday – Friday</span>
                  <span className="font-medium text-charcoal">8:00 AM – 5:00 PM</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Saturday</span>
                  <span className="font-medium text-charcoal">By appointment</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Sunday</span>
                  <span className="text-gray-400">Closed</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-100 rounded-lg">
                <Clock size={14} className="text-green-600" />
                <span className="text-xs text-green-700 font-medium">
                  Currently accepting new projects
                </span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="border border-gray-200 rounded-2xl p-6 bg-white">
              <h3 className="text-lg font-semibold text-charcoal mb-3">Need a Quick Quote?</h3>

              <p className="text-sm text-gray-600 mb-4">
                Upload your 3D model and get an instant price estimate with our online quote tool.
              </p>

              <Link
                to="/quote"
                className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-white font-medium rounded-lg hover:bg-forest-light transition-all w-full justify-center"
              >
                Get Instant Quote <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  </section>
</>


)
}
