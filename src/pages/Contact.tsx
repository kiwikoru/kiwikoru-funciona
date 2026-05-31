import { useState } from 'react'
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react'
import ParticleCanvas from '../components/ParticleCanvas'
import ScrollReveal from '../components/ScrollReveal'
import SEO, { generateBreadcrumbSchema } from '../components/SEO'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' })
  }

  const schema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://kiwikoru3d.com/' },
    { name: 'Contact', url: 'https://kiwikoru3d.com/contact' },
  ])

  return (
    <>
      <SEO
        title="Contact KiwiKoru 3D | 3D Printing Whangārei | Get a Quote"
        description="Contact KiwiKoru 3D for custom 3D printing in New Zealand. Email, WhatsApp, or fill out our form. Based in Morningside, Whangārei. Fast response times."
        path="/contact"
        schema={schema}
      />

      {/* Hero */}
      <section className="relative min-h-[320px] md:min-h-[40vh] bg-forest flex items-center justify-center" aria-label="Contact hero">
        <ParticleCanvas count={15} />
        <div className="relative z-10 text-center px-6 max-w-[500px]">
          <ScrollReveal>
            <h1 className="text-[36px] md:text-[48px] font-extrabold text-white leading-tight">
              Get in Touch
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="mt-4 text-white/70 text-base leading-relaxed">
              Have a question or ready to start your project? We'd love to hear from you.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="bg-white py-[60px] md:py-[100px]" aria-label="Contact information and form">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12">
            {/* Left — Contact Info */}
            <ScrollReveal>
              <div>
                <h2 className="text-[28px] md:text-[36px] font-bold text-charcoal mb-6">
                  Contact Information
                </h2>

                <ul className="space-y-5" role="list">
                  <li>
                    <a
                      href="mailto:kiwikoru3d@gmail.com"
                      className="flex items-center gap-3 text-charcoal hover:text-gold transition-colors duration-200 focus-gold"
                    >
                      <Mail size={20} className="text-gold shrink-0" />
                      <span className="font-medium">kiwikoru3d@gmail.com</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+640272602954"
                      className="flex items-center gap-3 text-charcoal hover:text-gold transition-colors duration-200 focus-gold"
                    >
                      <Phone size={20} className="text-gold shrink-0" />
                      <span className="font-medium">+64 027 260 2954</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/640272602954"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gold hover:text-gold-light transition-colors duration-200 focus-gold"
                    >
                      <MessageCircle size={20} className="shrink-0" />
                      <span className="font-medium">Message us on WhatsApp</span>
                    </a>
                  </li>
                  <li>
                    <span className="flex items-center gap-3 text-charcoal-light">
                      <MapPin size={20} className="text-gold shrink-0" />
                      Morningside, Whangārei, New Zealand
                    </span>
                  </li>
                </ul>

                <p className="mt-8 text-sm text-charcoal-light">
                  We typically respond within 24 hours on business days.
                </p>
              </div>
            </ScrollReveal>

            {/* Right — Form */}
            <ScrollReveal delay={0.2}>
              <div className="bg-white border border-border-light rounded-xl p-8 md:p-10">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4">
                      <Send size={28} className="text-gold" />
                    </div>
                    <h3 className="text-xl font-semibold text-charcoal">Message Sent!</h3>
                    <p className="mt-2 text-sm text-charcoal-light">
                      We'll respond within 24 hours. Thank you for reaching out.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-charcoal mb-1.5">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Smith"
                        className="w-full border border-border-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-charcoal mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full border border-border-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="block text-sm font-medium text-charcoal mb-1.5">
                        Subject
                      </label>
                      <select
                        id="contact-subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full border border-border-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                      >
                        <option>General Inquiry</option>
                        <option>Quote Request</option>
                        <option>File Upload Question</option>
                        <option>Material Advice</option>
                        <option>Order Status</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-charcoal mb-1.5">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your project..."
                        className="w-full border border-border-light rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-vertical"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-forest text-white font-semibold py-3.5 rounded-lg transition-all duration-200 hover:bg-forest-light focus-gold"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-off-white py-[60px] md:py-[80px]" aria-label="Studio location">
        <div className="max-w-[640px] mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-[28px] md:text-[36px] font-bold text-charcoal">
              Visit Our Studio
            </h2>
            <p className="mt-4 text-charcoal-light leading-relaxed">
              We're based in Morningside, Whangārei. While we're primarily a print-to-order service,
              local customers are welcome to arrange pickup of their finished parts.
            </p>
            <p className="mt-4 text-sm text-charcoal-light italic">
              Exact address provided via email when your order is ready for collection.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
