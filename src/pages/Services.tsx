import { Link } from 'react-router-dom'
import {
  Printer, Clock, Factory, FileCheck, FlaskConical, Paintbrush,
  Upload, FileSearch, Package, ArrowRight,
} from 'lucide-react'
import ParticleCanvas from '../components/ParticleCanvas'
import ScrollReveal from '../components/ScrollReveal'
import SectionHeader from '../components/SectionHeader'
import SEO, { generateServiceSchema, generateBreadcrumbSchema } from '../components/SEO'

const services = [
  {
    icon: Printer,
    title: 'FDM 3D Printing',
    desc: 'Industrial-grade fused deposition modeling with layer resolutions from 0.1mm to 0.3mm. Perfect for functional parts, prototypes, and end-use products.',
  },
  {
    icon: Clock,
    title: 'Rapid Prototyping',
    desc: 'Turn your concept into a physical model in 24-48 hours. Ideal for design validation, fit testing, and presentation models.',
  },
  {
    icon: Factory,
    title: 'Custom Manufacturing',
    desc: 'Low-volume production runs of 10-100+ identical parts. Consistent quality, competitive per-unit pricing, no minimum order.',
  },
  {
    icon: FileCheck,
    title: 'CAD File Preparation',
    desc: 'We review and optimize your STL, STEP, and 3MF files for the best print results. Recommendations on orientation, supports, and infill.',
  },
  {
    icon: FlaskConical,
    title: 'Material Consultation',
    desc: 'Not sure which filament to choose? We advise on PLA, PETG, ASA, and specialty materials based on your part\'s function and environment.',
  },
  {
    icon: Paintbrush,
    title: 'Post-Processing',
    desc: 'Optional finishing services including support removal, sanding, and assembly to deliver presentation-ready parts.',
  },
]

const steps = [
  { num: '1', title: 'Upload Your File', desc: 'Send us your STL, STEP, 3MF, or OBJ file via our instant quote form or email.', icon: Upload },
  { num: '2', title: 'Get a Quote', desc: 'We review your design and provide a transparent, itemized quote within hours.', icon: FileSearch },
  { num: '3', title: 'We Print', desc: 'Your part is printed on our professional FDM printers with your chosen material and settings.', icon: Printer },
  { num: '4', title: 'Receive', desc: 'Collect from our Whangārei studio or have it couriered anywhere in New Zealand.', icon: Package },
]

const formats = [
  { ext: 'STL', desc: 'Most common 3D printing format' },
  { ext: 'STEP', desc: 'CAD standard format' },
  { ext: '3MF', desc: 'Modern format with color' },
  { ext: 'OBJ', desc: 'Widely supported mesh' },
]

export default function Services() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      generateServiceSchema(),
      generateBreadcrumbSchema([
        { name: 'Home', url: 'https://kiwikoru3d.com/' },
        { name: 'Services', url: 'https://kiwikoru3d.com/services' },
      ]),
    ],
  }

  return (
    <>
      <SEO
        title="3D Printing Services NZ | Rapid Prototyping | Custom Parts | KiwiKoru 3D"
        description="Comprehensive 3D printing services including rapid prototyping, custom manufacturing, FDM printing, CAD file prep, and material consultation. Based in Whangārei, serving all NZ."
        path="/services"
        schema={schema}
      />

      {/* Hero */}
      <section className="relative min-h-[400px] md:min-h-[50vh] bg-forest flex items-center justify-center" aria-label="Services hero">
        <ParticleCanvas count={25} />
        <div className="relative z-10 text-center px-6 max-w-[600px]">
          <ScrollReveal>
            <h1 className="text-[36px] md:text-[48px] font-extrabold text-white leading-tight">
              Our 3D Printing Services
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="mt-4 text-white/70 text-base leading-relaxed">
              From rapid prototyping to custom end-use parts, we deliver precision FDM printing
              for makers, engineers, and businesses across New Zealand.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-white py-[60px] md:py-[100px]" aria-labelledby="services-grid-heading">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            id="services-grid-heading"
            headline="What We Offer"
            body="Comprehensive 3D printing solutions tailored to your project needs."
          />

          <ScrollReveal variant="stagger" className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="border border-border-light rounded-xl p-8 transition-all duration-400 hover:-translate-y-1 hover:shadow-card hover:border-gold/30"
              >
                <div className="w-12 h-12 rounded-lg bg-gold/15 flex items-center justify-center mb-5">
                  <s.icon size={24} className="text-forest" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal">{s.title}</h3>
                <p className="mt-2 text-sm text-charcoal-light leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Process */}
      <section className="bg-off-white py-[60px] md:py-[100px]" aria-labelledby="process-heading">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            id="process-heading"
            headline="How It Works"
            body="Simple 4-step process from your digital file to finished part."
          />

          <ScrollReveal variant="stagger" className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-px border-t border-dashed border-gold/30" aria-hidden="true" />

            {steps.map((step) => (
              <div key={step.num} className="text-center relative">
                <div className="w-12 h-12 rounded-full bg-gold text-forest font-bold text-lg flex items-center justify-center mx-auto">
                  {step.num}
                </div>
                <step.icon size={28} className="text-gold mx-auto mt-4" />
                <h3 className="mt-4 text-lg font-semibold text-charcoal">{step.title}</h3>
                <p className="mt-2 text-sm text-charcoal-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* File Formats */}
      <section className="bg-white py-[60px] md:py-[100px]" aria-labelledby="formats-heading">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <h2 id="formats-heading" className="text-[28px] md:text-[36px] font-bold text-charcoal text-center">
              Supported File Formats
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="stagger" delay={0.15} className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {formats.map((f) => (
              <div key={f.ext} className="bg-forest/[0.04] rounded-lg p-6 text-center">
                <span className="text-xl font-bold text-forest">{f.ext}</span>
                <p className="mt-2 text-xs text-charcoal-light">{f.desc}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-16" aria-label="Call to action">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-[28px] md:text-[36px] font-bold text-white">
              Ready to Start Your Project?
            </h2>
            <p className="mt-3 text-white/70 max-w-[480px] mx-auto">
              Upload your design and get a detailed quote. Fast turnaround, competitive pricing.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2} className="mt-8">
            <Link
              to="/quote"
              className="inline-flex items-center px-8 py-3.5 bg-gold text-forest font-semibold rounded-pill transition-all duration-200 hover:bg-gold-light hover:-translate-y-0.5 focus-gold"
            >
              Get Your Quote <ArrowRight size={18} className="ml-2" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
