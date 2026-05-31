import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Upload, ArrowRight, Zap, MapPin, Truck, Clock, CheckCircle,
  Gamepad2, Home as HomeIcon, Wrench, Lightbulb, Award, Shield,
  Phone, Star, ChevronDown, Factory, Briefcase, Flag,
} from 'lucide-react'
import ParticleCanvas from '../components/ParticleCanvas'
import ScrollReveal from '../components/ScrollReveal'
import SectionHeader from '../components/SectionHeader'
import SEO, { generateOrganizationSchema, generateLocalBusinessSchema, generateFAQSchema } from '../components/SEO'

/* ─────────── HERO ─────────── */
function HeroSection() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative min-h-[100dvh] bg-forest flex items-center overflow-hidden" aria-label="Hero">
      <ParticleCanvas count={50} />
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-24 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-[52%_48%] gap-12 items-center">
          {/* Left */}
          <div>
            <h1 className="text-white text-shadow-hero">
              <span className="block text-[36px] md:text-[64px] font-extrabold leading-[1.05] tracking-tight">Your Ideas.</span>
              <span className="block text-[36px] md:text-[64px] font-extrabold leading-[1.05] tracking-tight">Made Real.</span>
              <span className="block text-[36px] md:text-[64px] font-extrabold leading-[1.05] tracking-tight text-gold">Made in NZ.</span>
            </h1>
            <p className="mt-5 text-white/70 text-base leading-[1.70] max-w-[480px]">
              From concept to physical product. Custom 3D printing, product development, and rapid prototyping — 
              all designed and manufactured right here in Whangārei, New Zealand.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/quote"
                className="inline-flex items-center px-7 py-3.5 bg-gold text-forest font-semibold text-sm rounded-pill transition-all duration-200 hover:bg-gold-light hover:-translate-y-0.5 focus-gold"
              >
                Get Instant Estimate <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-7 py-3.5 border border-white/40 text-white text-sm font-medium rounded-pill transition-all duration-200 hover:bg-white/10 focus-gold"
              >
                Contact Us <Phone size={14} className="ml-2" />
              </Link>
            </div>
          </div>

          {/* Right — Glass Card (20% wider: 320→384, 280→336) */}
          <ScrollReveal className="flex justify-center lg:justify-end">
            <Link
              to="/quote"
              className="glass-card rounded-2xl p-8 w-[336px] md:w-[384px] h-[340px] md:h-[380px] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 focus-gold"
            >
              <div>
                <Upload size={32} className="text-white/70 mb-5" />
                <h3 className="text-white text-xl font-semibold">Get an Instant Estimate</h3>
                <p className="text-white/50 text-sm mt-2 leading-relaxed">
                  Upload your STL, STEP, or OBJ files. Preview your model in 3D and receive an estimated quote within minutes.
                </p>
                <p className="text-gold/70 text-xs mt-3 italic">
                  Don&apos;t have a 3D model? We can help design and develop your project.
                </p>
              </div>
              <div className="flex justify-end">
                <span className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
                  <ArrowRight size={18} className="text-forest" />
                </span>
              </div>
            </Link>
          </ScrollReveal>
        </div>

        {/* 4 Trust Blocks */}
        <ScrollReveal delay={0.3} className="mt-12 md:mt-16 flex justify-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-[900px]">
            {[
              { icon: Zap, title: 'Instant Estimates', sub: 'Real-time quotes 24/7' },
              { icon: Flag, title: 'Proudly NZ Service', sub: 'From Whangārei' },
              { icon: Clock, title: 'Fast Turnaround', sub: '24-48 hour standard' },
              { icon: Truck, title: 'Nationwide Shipping', sub: 'Courier or pickup' },
            ].map((b) => (
              <div key={b.title} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-4 min-w-0">
                <b.icon size={20} className="text-gold shrink-0" />
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium leading-tight truncate">{b.title}</p>
                  <p className="text-white/50 text-xs truncate">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center transition-opacity duration-300 ${scrolled ? 'opacity-0' : 'opacity-100'}`} aria-hidden="true">
        <div className="relative w-px h-8 bg-white/30">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold animate-scroll-dot" />
        </div>
      </div>
    </section>
  )
}

/* ─────────── 3 STEPS ─────────── */
function StepsSection() {
  const steps = [
    { num: '1', title: 'Upload Your Design', desc: 'Send us your STL, STEP, OBJ, or even sketches and photos. No 3D model? We offer CAD design services too.', icon: Upload },
    { num: '2', title: 'Get Your Estimate', desc: 'We review your files and provide a transparent, detailed estimate. Preview your model in our 3D viewer.', icon: Zap },
    { num: '3', title: 'We Print & Deliver', desc: 'Your project is printed in our Whangārei studio with your chosen material. Shipped NZ-wide or collect locally.', icon: Truck },
  ]
  return (
    <section id="quote-section" className="bg-white py-[60px] md:py-[100px]" aria-labelledby="steps-heading">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader headline="From Idea to Product in 3 Steps" body="Our streamlined process makes it easier than ever to turn your concepts into physical products — locally manufactured in New Zealand." />
        <ScrollReveal variant="stagger" className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-6 left-[16.67%] right-[16.67%] h-px border-t border-dashed border-gold/30" aria-hidden="true" />
          {steps.map((s) => (
            <div key={s.num} className="text-center relative">
              <div className="w-12 h-12 rounded-full border-2 border-gold text-gold font-bold text-lg flex items-center justify-center mx-auto bg-white">{s.num}</div>
              <s.icon size={32} className="text-gold mx-auto mt-4" />
              <h3 className="mt-4 text-xl font-semibold text-charcoal">{s.title}</h3>
              <p className="mt-2 text-charcoal-light text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ─────────── FIND 3D MODELS ─────────── */
function FindModelsSection() {
  return (
    <section className="bg-forest-dark py-[60px] md:py-[100px]" aria-labelledby="models-heading">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <div>
              <span className="text-xs font-medium tracking-[0.12em] text-white/50 uppercase">No design? No problem.</span>
              <h2 id="models-heading" className="mt-4 text-[28px] md:text-[40px] font-bold text-white leading-tight">Where Can I Start?</h2>
              <p className="mt-4 text-white/70 text-base leading-[1.70]">
                You don&apos;t need to be a CAD expert. Whether you have a sketch, a photo, or just an idea, 
                we can help bring it to life. Our design team creates 3D models from your concepts.
              </p>
              <ul className="mt-6 space-y-3" role="list">
                {[
                  'Upload your existing STL, STEP, or OBJ file for instant estimate',
                  'Send sketches, photos, or reference images — we design from scratch',
                  'Search free repositories like Thingiverse or Printables',
                  'We handle CAD design, prototyping, and production in one place',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-gold shrink-0 mt-1" />
                    <span className="text-white/70 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <img src="/images/printer-farm.jpg" alt="3D printers in our Whangārei workshop" className="rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-full object-cover" loading="lazy" />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

/* ─────────── WHAT WE PRINT ─────────── */
function WhatWePrintSection() {
  const cards = [
    { img: '/images/hobbies-games.jpg', icon: Gamepad2, title: 'Hobbies & Games', desc: 'Minis, terrain, fidget toys, dice towers, and custom gaming accessories.' },
    { img: '/images/home-hacks.jpg', icon: HomeIcon, title: 'Home & DIY', desc: 'Custom brackets, organizers, cable management, and household solutions.' },
    { img: '/images/repairs-diy.jpg', icon: Wrench, title: 'Repairs & Parts', desc: 'Replacement parts for appliances, automotive, and hard-to-find components.' },
    { img: '/images/prototypes.jpg', icon: Lightbulb, title: 'Prototypes', desc: 'Rapid prototyping for product development, fit testing, and proof-of-concept.' },
    { img: '/images/business-branding.jpg', icon: Briefcase, title: 'Corporate Branding', desc: 'Custom keychains, promotional products, company gifts, event giveaways, branded accessories, and product displays.' },
  ]
  return (
    <section className="bg-white py-[60px] md:py-[100px]" aria-labelledby="print-heading">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader headline="What We Create" body="High-quality parts and products for every application. If you can imagine it, we can print it." />
        <ScrollReveal variant="stagger" className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {cards.map((c) => (
            <div key={c.title} className="group border border-border-light rounded-xl overflow-hidden transition-all duration-400 hover:-translate-y-1 hover:shadow-card hover:border-gold/30">
              <div className="h-[200px] overflow-hidden">
                <img src={c.img} alt={`${c.title} examples`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-6">
                <c.icon size={20} className="text-forest mb-2" />
                <h3 className="text-lg font-semibold text-charcoal">{c.title}</h3>
                <p className="mt-1 text-sm text-charcoal-light leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ─────────── FEATURED PROJECTS ─────────── */
function FeaturedProjectsSection() {
  const projects = [
    { img: '/images/project-lighting.jpg', cat: 'Lighting Products', title: 'Geometric Desk Lamp', challenge: 'Create a custom lamp shade with intricate patterns.', solution: 'Designed parametric lattice structure, printed in white PLA with 0.2mm layers.', result: 'Unique functional lamp sold at local markets.' },
    { img: '/images/project-prototype.jpg', cat: 'Functional Prototypes', title: 'Engineering Bracket', challenge: 'Rapid prototype for fit-checking before production tooling.', solution: '3D printed functional prototype in PETG with exact tolerances within 24 hours.', result: 'Verified design saved weeks of tooling rework.' },
    { img: '/images/project-parts.jpg', cat: 'Replacement Parts', title: 'Appliance Clips', challenge: 'Discontinued plastic clips needed for vintage appliances.', solution: 'Reverse-engineered from broken parts, printed in durable PETG.', result: 'Restored functionality for multiple households.' },
    { img: '/images/project-gifts.jpg', cat: 'Custom Gifts', title: 'Personalized Collection', challenge: 'Create unique, personalized gift items for a retail line.', solution: 'Designed and printed custom keychains, organizers, and planters.', result: 'Successful retail product line with repeat orders.' },
    { img: '/images/project-engineering.jpg', cat: 'Engineering Solutions', title: 'Gearbox Housing', challenge: 'Custom gearbox enclosure for a robotics project.', solution: 'Precision printed multi-part assembly with integrated mounting points.', result: 'Functional prototype tested and approved for production.' },
    { img: '/images/project-product-dev.jpg', cat: 'Product Development', title: 'Mouse Shell Iteration', challenge: 'Iterate ergonomic computer mouse designs quickly.', solution: 'Rapid prototyping workflow — 5 design iterations in one week.', result: 'Final design selected and moved to injection molding.' },
  ]
  return (
    <section id="projects-section" className="bg-off-white py-[60px] md:py-[100px]" aria-labelledby="projects-heading">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader headline="Featured Projects" body="Real projects that showcase our capabilities across design, prototyping, and production." />
        <ScrollReveal variant="stagger" className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.title} className="group bg-white border border-border-light rounded-xl overflow-hidden transition-all duration-400 hover:-translate-y-1 hover:shadow-card">
              <div className="h-[220px] overflow-hidden">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-6">
                <span className="text-[11px] font-semibold tracking-[0.08em] text-gold uppercase">{p.cat}</span>
                <h3 className="mt-2 text-lg font-semibold text-charcoal">{p.title}</h3>
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-charcoal-light"><strong className="text-charcoal">Challenge:</strong> {p.challenge}</p>
                  <p className="text-xs text-charcoal-light"><strong className="text-charcoal">Solution:</strong> {p.solution}</p>
                  <p className="text-xs text-charcoal-light"><strong className="text-gold">Result:</strong> {p.result}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ─────────── TRUST / STATS ─────────── */
function TrustSection() {
  const stats = [
    { icon: Award, num: '10+', label: 'Years Experience', desc: 'Decade of expertise in 3D printing and product development.' },
    { icon: Zap, num: '< 24h', label: 'Fast Response', desc: 'Quick turnaround on quotes and project inquiries.' },
    { icon: MapPin, num: 'NZ', label: 'Nationwide Service', desc: 'From Whangārei to anywhere in New Zealand.' },
    { icon: Lightbulb, num: 'CAD', label: 'Design Support', desc: 'Full CAD design and development assistance.' },
    { icon: Factory, num: 'Full', label: 'Proto to Production', desc: 'From first prototype to small batch manufacturing.' },
    { icon: Shield, num: '100%', label: 'Problem Solving', desc: 'We find solutions for even the most unique projects.' },
  ]
  return (
    <section className="bg-forest py-[60px] md:py-[100px]" aria-labelledby="trust-heading">
      <div className="max-w-[1200px] mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <img src="/images/logo.png" alt="" width="48" height="48" className="mx-auto mb-4 rounded-lg opacity-80" aria-hidden="true" />
            <h2 id="trust-heading" className="text-[28px] md:text-[40px] font-bold text-white leading-tight">Why Choose KiwiKoru</h2>
            <p className="mt-3 text-white/60 max-w-[520px] mx-auto">A trusted New Zealand partner for custom manufacturing, product development, and creative problem solving.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal variant="stagger" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <s.icon size={28} className="text-gold mx-auto mb-3" />
              <p className="text-2xl font-bold text-gold">{s.num}</p>
              <p className="mt-1 text-white font-semibold text-sm">{s.label}</p>
              <p className="mt-1 text-white/50 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ─────────── TESTIMONIALS ─────────── */
function TestimonialsSection() {
  const testimonials = [
    { name: 'James T.', industry: 'Product Design', project: 'Prototype Development', text: 'KiwiKoru turned my rough sketches into a working prototype in under a week. The communication was excellent and the quality exceeded expectations. Highly recommended for anyone in NZ looking for rapid prototyping.' },
    { name: 'Sarah M.', industry: 'Home & DIY', project: 'Replacement Parts', text: 'I needed a replacement bracket for an old appliance that was no longer manufactured. KiwiKoru reverse-engineered it from the broken piece and printed a better-than-new version. Saved me from buying a whole new unit.' },
    { name: 'Mike R.', industry: 'Engineering', project: 'Functional Prototypes', text: 'We use KiwiKoru for all our prototyping needs. The turnaround time is incredible and the print quality is always spot-on. Having a local NZ manufacturer makes the whole process so much smoother.' },
  ]
  return (
    <section className="bg-white py-[60px] md:py-[100px]" aria-labelledby="testimonials-heading">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader headline="What Our Customers Say" body="Real feedback from makers, engineers, and businesses across New Zealand." />
        <ScrollReveal variant="stagger" className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-off-white border border-border-light rounded-xl p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-gold" fill="#d4b896" />)}
              </div>
              <p className="text-charcoal-light text-sm leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-5 pt-4 border-t border-border-light">
                <p className="text-charcoal font-semibold text-sm">{t.name}</p>
                <p className="text-charcoal-light text-xs">{t.industry} — {t.project}</p>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ─────────── MATERIALS GLANCE ─────────── */
function MaterialsSection() {
  return (
    <section className="bg-off-white py-[60px] md:py-[100px]" aria-labelledby="materials-heading">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader headline="Materials at a Glance" body="Choosing the right material is key to a successful print. We stock premium-quality filaments for every application." />
        <ScrollReveal variant="stagger" className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { badge: 'Most Popular', badgeColor: 'bg-gold/15 text-gold', name: 'PLA — Standard', desc: 'Best value. Perfect for display models, prototypes, and indoor items. Easy to print with excellent detail.' },
            { badge: 'Impact Resistant', badgeColor: 'bg-forest/10 text-forest', name: 'PETG — Durable', desc: 'Strong and snap-resistant. Great for functional parts, mechanical components, and outdoor use.' },
            { badge: 'Impact Resistant', badgeColor: 'bg-forest/10 text-forest', name: 'ASA — Impact Resistant', desc: 'High impact strength and excellent weather resistance. Ideal for outdoor parts, automotive components, and durable prototypes.' },
            { badge: 'Flexible', badgeColor: 'bg-gold/15 text-gold', name: 'TPU — Flexible', desc: 'Rubber-like flexibility with excellent durability. Perfect for gaskets, grips, phone cases, and wearable parts.' },
          ].map((m) => (
            <div key={m.name} className="bg-white border border-border-light rounded-xl p-8">
              <span className={`inline-block px-3 py-1 ${m.badgeColor} text-xs font-medium tracking-wide rounded-pill uppercase`}>{m.badge}</span>
              <h3 className="mt-3 text-xl font-semibold text-charcoal">{m.name}</h3>
              <p className="mt-2 text-sm text-charcoal-light leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </ScrollReveal>
        <ScrollReveal className="mt-8 text-center">
          <Link to="/materials" className="inline-flex items-center gap-2 text-gold font-medium hover:gap-3 transition-all duration-200 focus-gold">Compare all materials <ArrowRight size={16} /></Link>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ─────────── FAQ (8 questions) ─────────── */
function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const faqs = [
    { q: 'What file types do you accept?', a: 'We accept STL, STEP, OBJ, 3MF, PDF, JPG, and PNG files. If you have a different format or just a sketch, send it through — we can usually work with it or convert it for you.' },
    { q: 'Do I need a 3D model to get started?', a: 'Not at all. While having a 3D model (STL, STEP, etc.) speeds up the process, we also offer CAD design services. Send us sketches, photos, or even a description of your idea and we can create the 3D model for you.' },
    { q: 'Can you help design my idea from scratch?', a: 'Yes, absolutely. Our design team can take your concept — whether it\'s a sketch on a napkin or a detailed brief — and turn it into a 3D model ready for printing. We handle everything from concept to final product.' },
    { q: 'How long does a typical project take?', a: 'Standard prints are ready within 24-48 hours. More complex projects, design work, or larger batches may take 3-7 days. We\'ll always give you a clear timeline when you request a quote.' },
    { q: 'Do you ship across New Zealand?', a: 'Yes, we ship nationwide via courier. We\'re based in Morningside, Whangārei, so local customers can also arrange pickup. All shipping costs are calculated and included in your quote.' },
    { q: 'What materials do you offer?', a: 'We print in PLA, PETG, ASA, and TPU (Flexible). PLA is great for prototypes and display items. PETG offers strength and durability. ASA is impact-resistant and weather-resistant for outdoor and automotive parts. TPU is rubber-like and flexible for gaskets, grips, and wearables. We can advise on the best choice for your project.' },
    { q: 'Can you create replacement parts?', a: 'Yes, replacement parts are one of our specialties. Whether it\'s a broken appliance clip, an automotive bracket, or a discontinued component, we can often reverse-engineer and print a perfect replacement.' },
    { q: 'Can you develop prototypes for my product idea?', a: 'Absolutely. Rapid prototyping is a core service. We can produce functional prototypes for fit-testing, presentation models for stakeholders, and iterative designs to refine your product before moving to production.' },
  ]
  return (
    <section className="bg-white py-[60px] md:py-[100px]" aria-labelledby="faq-heading">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader headline="Frequently Asked Questions" body="Everything you need to know about our 3D printing and product development services in Whangārei." />
        <div className="mt-12 md:mt-16 max-w-[800px] mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div className="bg-forest/[0.04] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left focus-gold"
                  aria-expanded={openIdx === i}
                >
                  <span className="flex items-start gap-3 text-charcoal font-semibold text-sm md:text-base">
                    <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-2" />
                    {faq.q}
                  </span>
                  <ChevronDown size={18} className={`text-gold shrink-0 transition-transform duration-300 ${openIdx === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openIdx === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-5 pb-5 pl-10 text-sm text-charcoal-light leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── CTA BANNER ─────────── */
function CTABanner() {
  return (
    <section id="contact-section" className="bg-forest py-16" aria-label="Call to action">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <ScrollReveal>
            <div>
              <h2 className="text-[28px] md:text-[36px] font-bold text-white leading-tight">Proudly <span className="text-gold">Northland</span> Owned.</h2>
              <p className="mt-2 text-white/70 text-base">Based in Morningside, Whangārei. Serving all of New Zealand.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap gap-4">
              <Link to="/quote" className="inline-flex items-center px-8 py-3.5 bg-gold text-forest font-semibold rounded-pill transition-all duration-200 hover:bg-gold-light hover:-translate-y-0.5 focus-gold">
                Get Instant Estimate
              </Link>
              <Link to="/contact" className="inline-flex items-center px-8 py-3.5 bg-white text-forest font-semibold rounded-pill transition-all duration-200 hover:bg-white/90 hover:-translate-y-0.5 focus-gold">
                Contact Us
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

/* ─────────── SEO SERVICES ─────────── */
function SEOServicesSection() {
  return (
    <section className="bg-white py-[60px] md:py-[100px]" aria-labelledby="seo-services-heading">
      <div className="max-w-[800px] mx-auto px-6">
        <ScrollReveal>
          <h2 id="seo-services-heading" className="text-[28px] md:text-[36px] font-bold text-charcoal leading-tight text-center">
            Professional 3D Printing &amp; Product Development in New Zealand
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15} className="mt-6 space-y-4 text-charcoal-light leading-[1.70]">
          <p><strong className="text-charcoal">KiwiKoru 3D</strong> is your trusted partner for <strong className="text-charcoal">custom 3D printing</strong>, <strong className="text-charcoal">rapid prototyping</strong>, <strong className="text-charcoal">CAD design</strong>, and <strong className="text-charcoal">product development</strong> right here in Whangārei, Northland. Our <strong className="text-charcoal">3D printing service in New Zealand</strong> transforms your concepts into physical products using industrial-grade FDM technology.</p>
          <p>From <strong className="text-charcoal">replacement parts</strong> and <strong className="text-charcoal">custom gifts</strong> to <strong className="text-charcoal">engineering prototypes</strong>, <strong className="text-charcoal">lighting products</strong>, and <strong className="text-charcoal">small batch manufacturing</strong>, our NZ-made studio serves customers nationwide with fast turnaround times and premium quality. Looking for <strong className="text-charcoal">3D printing NZ</strong> or <strong className="text-charcoal">custom manufacturing NZ</strong>? You&apos;ve found your partner.</p>
        </ScrollReveal>
        <ScrollReveal delay={0.3} className="mt-6 text-center">
          <Link to="/services" className="inline-flex items-center gap-2 text-gold font-medium hover:gap-3 transition-all duration-200 focus-gold">Learn more about our services <ArrowRight size={16} /></Link>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ─────────── SEO INDUSTRIES ─────────── */
function SEOIndustriesSection() {
  const industries = [
    { title: 'Hobbyists & Makers', desc: 'Custom gaming miniatures, terrain, fidget toys, and creative projects.' },
    { title: 'Home & DIY', desc: 'Replacement parts, brackets, storage solutions, and household gadgets.' },
    { title: 'Engineering', desc: 'Rapid prototyping, functional testing, fit-check models, and proof-of-concept parts.' },
    { title: 'Automotive', desc: 'Custom brackets, trim pieces, clips, and hard-to-find replacement components.' },
    { title: 'Product Design', desc: 'Iterative prototyping, presentation models, and pre-production samples.' },
    { title: 'Education', desc: 'Teaching aids, visual models, and student project parts for schools and universities.' },
  ]
  return (
    <section className="bg-off-white py-[60px] md:py-[100px]" aria-labelledby="industries-heading">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader headline="Industries We Serve Across NZ" />
        <ScrollReveal variant="stagger" className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind) => (
            <div key={ind.title} className="bg-white border border-border-light rounded-xl p-6">
              <h3 className="text-lg font-semibold text-charcoal">{ind.title}</h3>
              <p className="mt-2 text-sm text-charcoal-light leading-relaxed">{ind.desc}</p>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ─────────── HOME PAGE ─────────── */
export default function Home() {
  const schemas = [
    generateOrganizationSchema(),
    generateLocalBusinessSchema(),
    generateFAQSchema(),
  ]
  return (
    <>
      <SEO
        title="3D Printing NZ | Custom 3D Printing Whangārei | KiwiKoru 3D"
        description="Professional 3D printing and product development in Whangārei, New Zealand. Custom 3D printing, rapid prototyping, CAD design, replacement parts, and small batch manufacturing. NZ made & owned."
        path="/"
        schema={schemas.length === 1 ? schemas[0] : { '@context': 'https://schema.org', '@graph': schemas }}
      />
      <HeroSection />
      <StepsSection />
      <FindModelsSection />
      <WhatWePrintSection />
      <FeaturedProjectsSection />
      <TrustSection />
      <TestimonialsSection />
      <MaterialsSection />
      <FAQSection />
      <CTABanner />
      <SEOServicesSection />
      <SEOIndustriesSection />
    </>
  )
}
