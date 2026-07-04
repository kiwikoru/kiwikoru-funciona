import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail, Phone, MapPin, Send, CheckCircle, Upload, X,
  ArrowRight, Clock, MessageSquare, Loader2, AlertCircle,
} from 'lucide-react'
import SEO from '../components/SEO'
import ScrollReveal from '../components/ScrollReveal'
import { useQuote } from '../contexts/QuoteContext'
import { useCart, type CartItem } from '../contexts/CartContext'
import { trpc } from '@/providers/trpc'
import type { PutBlobResult } from '@vercel/blob'
import { upload } from '@vercel/blob/client'

const CONTACT_EMAIL = 'kiwikoru3d@gmail.com'
const MAX_ATTACHMENT_MB = 100
const MAX_ATTACHMENT_BYTES = MAX_ATTACHMENT_MB * 1024 * 1024
const MAX_ATTACHMENT_FILES = 5

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

function formatFileSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(0)} KB`
}

type UploadedBlobFile = {
  originalName: string
  size: number
  pathname: string
  privateUrl: string
  downloadUrl: string
  downloadUrlValidUntil: number
  contentType: string
}

function normaliseUploadFile(file: File): File {
  if (file.type) {
    return file
  }

  return new File([file], file.name, {
    type: 'application/octet-stream',
    lastModified: file.lastModified,
  })
}

function sanitiseFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
}

async function createSignedDownloadUrl(pathname: string): Promise<{
  downloadUrl: string
  validUntil: number
}> {
  const response = await fetch('/api/blob/download-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pathname }),
  })

  const result = await response.json() as {
    downloadUrl?: string
    validUntil?: number
    error?: string
  }

  if (!response.ok || !result.downloadUrl || !result.validUntil) {
    throw new Error(
      result.error || 'The secure download link could not be created.'
    )
  }

  return {
    downloadUrl: result.downloadUrl,
    validUntil: result.validUntil,
  }
}

function appendUploadedFilesToMessage(
  message: string,
  uploadedFiles: UploadedBlobFile[]
): string {
  if (uploadedFiles.length === 0) {
    return message
  }

  const lines = [
    message.trimEnd(),
    '',
    '=== Securely Uploaded Files ===',
    '',
  ]

  uploadedFiles.forEach((file, index) => {
    lines.push(
      `${index + 1}. ${file.originalName}`,
      `Size: ${formatFileSize(file.size)}`,
      `Storage path: ${file.pathname}`,
      `Download link (valid for 7 days): ${file.downloadUrl}`,
      `Private Blob URL: ${file.privateUrl}`,
      ''
    )
  })

  lines.push(
    'These files are stored in the private KiwiKoru Blob store.',
    'The download links above are temporary and expire after 7 days.',
    ''
  )

  return lines.join('\n')
}

async function dataUrlToFile(
  dataUrl: string,
  name: string,
  type: string,
  lastModified?: number
): Promise<File> {
  const response = await fetch(dataUrl)
  const blob = await response.blob()

  return new File([blob], name, {
    type: type || 'application/octet-stream',
    lastModified: lastModified || Date.now(),
  })
}

function buildQuoteMessage(
  config: NonNullable<ReturnType<typeof useQuote>['config']>
): string {
  return [
    '=== Quote Request ===',
    '',
    `File: ${config.fileName}`,
    `Volume: ${config.volume.toFixed(1)} cm³`,
    `Material: ${config.material}`,
    `Colour: ${config.color}`,
    `Quantity: ${config.quantity}`,
    `Price per unit: $${config.pricePerUnit.toFixed(2)} NZD`,
    `Total estimate: $${config.total.toFixed(2)} NZD`,
    '',
    '--- Print Settings ---',
    `Infill: ${config.infill}%`,
    `Walls: ${config.walls}`,
    `Top layers: ${config.topLayers}`,
    `Bottom layers: ${config.bottomLayers}`,
    `Layer height: ${config.layerHeight}mm`,
    `Supports: ${config.support}`,
    `Finish: ${config.finish}`,
    '',
    '=== Additional Notes ===',
    '',
  ].filter((line, index, array) => !(line === '' && array[index - 1] === '')).join('\n')
}

function buildCartMessage(items: CartItem[], cartTotal: number): string {
  const lines = [
    '=== Multi-Model Quote Request ===',
    '',
    `Models: ${items.length}`,
    `Total units: ${items.reduce((sum, item) => sum + item.quantity, 0)}`,
    `Total estimate: $${cartTotal.toFixed(2)} NZD`,
    '',
  ]

  items.forEach((item, index) => {
    lines.push(
      `--- Model ${index + 1} ---`,
      `File: ${item.fileName}`,
      `File status: ${item.file ? 'Available for secure upload' : 'Must be attached again'}`,
      `Volume: ${item.volume.toFixed(1)} cm³`,
      `Dimensions: ${item.dimensions ? `${item.dimensions.x.toFixed(1)} × ${item.dimensions.y.toFixed(1)} × ${item.dimensions.z.toFixed(1)} mm` : 'Not available'}`,
      `Material: ${item.material}`,
      `Colour: ${item.color}`,
      `Quantity: ${item.quantity}`,
      `Scale: ${item.scalePercent.toFixed(1)}%`,
      `Price per unit: $${item.pricePerUnit.toFixed(2)} NZD`,
      `Item total: $${item.total.toFixed(2)} NZD`,
      `Infill: ${item.infill}%`,
      `Walls: ${item.walls}`,
      `Top layers: ${item.topLayers}`,
      `Bottom layers: ${item.bottomLayers}`,
      `Layer height: ${item.layerHeight}mm`,
      `Supports: ${item.support}`,
      `Finish: ${item.finish}`,
      ''
    )
  })

  lines.push('=== Additional Notes ===', '')
  return lines.join('\n')
}

export default function Contact() {
  const { config, setConfig, file: quoteFile, setFile: setQuoteFile } = useQuote()
  const { items: cartItems, cartTotal, clearCart } = useCart()

  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [emailNote, setEmailNote] = useState('')
  const [attachmentWarning, setAttachmentWarning] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState('')
  const [requestSource, setRequestSource] = useState<'none' | 'quote' | 'cart'>('none')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const loadedRef = useRef(false)

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
    if (loadedRef.current) return

    let cancelled = false

    async function loadRequest() {
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
            console.error('[CONTACT] Could not read quote request', err)
          }
        }
      }

      if (cancelled) return

      if (nextConfig) {
        loadedRef.current = true
        setRequestSource('quote')
        setForm((current) => ({
          ...current,
          subject: 'Get a Quote',
          message: buildQuoteMessage(nextConfig),
        }))

        if (nextFile && nextFile.size <= MAX_ATTACHMENT_BYTES) {
          setFiles([nextFile])
        } else if (nextFile) {
          setAttachmentWarning(
            `${nextFile.name} is ${formatFileSize(nextFile.size)} and was not added because the limit is ${MAX_ATTACHMENT_MB} MB per file.`
          )
        }

        setConfig(null)
        setQuoteFile(null)
        sessionStorage.removeItem('kiwikoru_quote_request')
        return
      }

      if (cartItems.length > 0) {
        loadedRef.current = true
        setRequestSource('cart')
        setForm((current) => ({
          ...current,
          subject: 'Get a Quote',
          message: buildCartMessage(cartItems, cartTotal),
        }))

        const availableFiles = cartItems
          .map((item) => item.file)
          .filter((file): file is File => Boolean(file))

        const acceptedFiles = availableFiles
          .filter((file) => file.size <= MAX_ATTACHMENT_BYTES)
          .slice(0, MAX_ATTACHMENT_FILES)

        setFiles(acceptedFiles)

        const missingCount = cartItems.filter((item) => !item.file).length
        const oversizedCount = availableFiles.filter(
          (file) => file.size > MAX_ATTACHMENT_BYTES
        ).length
        const validCount = availableFiles.filter(
          (file) => file.size <= MAX_ATTACHMENT_BYTES
        ).length
        const extraCount = Math.max(0, validCount - MAX_ATTACHMENT_FILES)

        const warnings: string[] = []

        if (missingCount > 0) {
          warnings.push(
            `${missingCount} saved model file${missingCount === 1 ? '' : 's'} must be attached again because browsers cannot permanently save the original file.`
          )
        }

        if (oversizedCount > 0) {
          warnings.push(
            `${oversizedCount} file${oversizedCount === 1 ? '' : 's'} exceeded ${MAX_ATTACHMENT_MB} MB and were not attached.`
          )
        }

        if (extraCount > 0) {
          warnings.push(
            `${extraCount} file${extraCount === 1 ? '' : 's'} exceeded the maximum of ${MAX_ATTACHMENT_FILES} attachments.`
          )
        }

        if (warnings.length > 0) {
          setAttachmentWarning(
            `${warnings.join(' ')} Please attach the missing files again before sending the request.`
          )
        }
      }
    }

    loadRequest()

    return () => {
      cancelled = true
    }
  }, [config, quoteFile, setConfig, setQuoteFile, cartItems, cartTotal])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])

    setFiles((currentFiles) => {
      const nextFiles = [...currentFiles]
      const skipped: string[] = []

      selectedFiles.forEach((file) => {
        if (nextFiles.length >= MAX_ATTACHMENT_FILES) {
          skipped.push(`${file.name} (maximum ${MAX_ATTACHMENT_FILES} files)`)
        } else if (file.size > MAX_ATTACHMENT_BYTES) {
          skipped.push(`${file.name} (${formatFileSize(file.size)})`)
        } else {
          nextFiles.push(file)
        }
      })

      setAttachmentWarning(
        skipped.length > 0
          ? `These files were not added: ${skipped.join(', ')}. Maximum ${MAX_ATTACHMENT_FILES} files and ${MAX_ATTACHMENT_MB} MB per file.`
          : ''
      )

      return nextFiles
    })

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setEmailNote('')
    setUploadProgress(0)
    setUploadStatus('')

    try {
      const filesToUpload = files
        .filter((file) => file.size <= MAX_ATTACHMENT_BYTES)
        .slice(0, MAX_ATTACHMENT_FILES)

      if (files.length > filesToUpload.length) {
        throw new Error(
          `Please select no more than ${MAX_ATTACHMENT_FILES} files and keep each file under ${MAX_ATTACHMENT_MB} MB.`
        )
      }

      const uploadedFiles: UploadedBlobFile[] = []

      for (let index = 0; index < filesToUpload.length; index += 1) {
        const originalFile = filesToUpload[index]
        const uploadFile = normaliseUploadFile(originalFile)
        const safeName = sanitiseFileName(originalFile.name)
        const pathname = `customer-uploads/${Date.now()}-${index + 1}-${safeName}`

        setUploadStatus(
          `Uploading file ${index + 1} of ${filesToUpload.length}: ${originalFile.name}`
        )

        const blob: PutBlobResult = await upload(pathname, uploadFile, {
          access: 'private',
          handleUploadUrl: '/api/blob/upload',
          multipart: originalFile.size > 20 * 1024 * 1024,
          onUploadProgress: (progress) => {
            const completedFiles = index
            const currentFileProgress = progress.percentage / 100
            const totalProgress =
              ((completedFiles + currentFileProgress) / filesToUpload.length) * 100

            setUploadProgress(Math.round(totalProgress))
          },
        })

        setUploadStatus(
          `Creating secure download link for file ${index + 1} of ${filesToUpload.length}: ${originalFile.name}`
        )

        const signedDownload = await createSignedDownloadUrl(blob.pathname)

        uploadedFiles.push({
          originalName: originalFile.name,
          size: originalFile.size,
          pathname: blob.pathname,
          privateUrl: blob.url,
          downloadUrl: signedDownload.downloadUrl,
          downloadUrlValidUntil: signedDownload.validUntil,
          contentType: blob.contentType,
        })
      }

      setUploadProgress(filesToUpload.length > 0 ? 100 : 0)
      setUploadStatus(
        filesToUpload.length > 0
          ? 'Files uploaded securely. Sending your message...'
          : 'Sending your message...'
      )

      const finalMessage = appendUploadedFilesToMessage(
        form.message,
        uploadedFiles
      )

      const emailResult = await sendEmail.mutateAsync({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: finalMessage,
        company: form.company || undefined,
        phone: form.phone || undefined,
        projectType: form.projectType || undefined,
        files: [],
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
          message: finalMessage,
        })
      } catch (dbErr) {
        console.warn(
          'Enquiry DB save failed, but email was sent:',
          dbErr
        )
      }

      if (requestSource === 'cart') {
        clearCart()
      }

      setFiles([])
      setSubmitted(true)
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setSubmitting(false)
      setUploadStatus('')
    }
  }

  const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all bg-white'
  const labelClass = 'text-sm font-medium text-charcoal mb-1.5 block'

  return (
    <>
      <SEO
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
                      type="button"
                      onClick={() => {
                        setSubmitted(false)
                        setRequestSource('none')
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
                        setError('')
                        setEmailNote('')
                        setUploadProgress(0)
                        setUploadStatus('')
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
                        onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Company</label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
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
                        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                        placeholder="your@email.com"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
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
                        onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                        className={inputClass}
                      >
                        {subjects.map((subject) => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Project Type</label>
                      <select
                        value={form.projectType}
                        onChange={(event) => setForm((current) => ({ ...current, projectType: event.target.value }))}
                        className={inputClass}
                      >
                        <option value="">Select project type</option>
                        {projectTypes.map((projectType) => (
                          <option key={projectType} value={projectType}>{projectType}</option>
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
                      onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                      placeholder="Tell us about your project..."
                      className={`${inputClass} resize-none text-sm leading-relaxed`}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Attachments</label>
                    <p className="text-xs text-gray-500 mb-2">
                      Max {MAX_ATTACHMENT_FILES} files, up to {MAX_ATTACHMENT_MB} MB each. Files are uploaded securely to private storage and sent with your enquiry.
                    </p>

                    {attachmentWarning && (
                      <div className="mb-3 flex items-start gap-2 rounded-xl bg-gold text-forest-dark px-4 py-3 text-sm font-medium shadow-sm">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <p>{attachmentWarning}</p>
                      </div>
                    )}

                    <div className="border border-gray-200 border-dashed rounded-lg p-4">
                      {files.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {files.map((file, index) => (
                            <div
                              key={`${file.name}-${file.lastModified}-${index}`}
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
                                onClick={() => setFiles((current) => current.filter((_, currentIndex) => currentIndex !== index))}
                                className="p-1 hover:bg-gray-200 rounded transition-colors shrink-0"
                                aria-label={`Remove ${file.name}`}
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
                        <Upload size={16} /> Attach files up to {MAX_ATTACHMENT_MB} MB each
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".stl,.obj,.3mf,.pdf,.png,.jpg,.jpeg,.step,.stp"
                        className="hidden"
                        onChange={handleFileSelect}
                      />

                      <p className="text-xs text-gray-400 mt-2">
                        Max {MAX_ATTACHMENT_FILES} files, up to {MAX_ATTACHMENT_MB} MB each. Supported: STL, OBJ, 3MF, STEP, STP, PDF, PNG and JPG.
                      </p>
                    </div>
                  </div>


                  {submitting && uploadStatus && (
                    <div className="rounded-xl border border-gold/30 bg-gold/10 p-4">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="text-sm font-medium text-forest-dark">
                          {uploadStatus}
                        </p>
                        {files.length > 0 && (
                          <span className="text-sm font-semibold text-forest">
                            {uploadProgress}%
                          </span>
                        )}
                      </div>

                      {files.length > 0 && (
                        <div className="h-2 overflow-hidden rounded-full bg-white">
                          <div
                            className="h-full rounded-full bg-gold transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}

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
                        <Loader2 size={18} className="animate-spin" /> {files.length > 0 ? 'Uploading & Sending...' : 'Sending...'}
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
                    <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-start gap-3 group">
                      <div className="w-10 h-10 bg-forest/5 rounded-lg flex items-center justify-center shrink-0">
                        <Mail size={18} className="text-forest" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-charcoal group-hover:text-forest transition-colors">
                          {CONTACT_EMAIL}
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
