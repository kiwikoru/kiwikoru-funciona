import SEO from '../components/SEO'
import ScrollReveal from '../components/ScrollReveal'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle } from 'lucide-react'

const services = [
  {
    title: 'Rapid Prototyping',
    headline: 'Transform concepts into physical parts quickly',
    desc: 'Speed up your design process with fast-turnaround prototypes. We print functional parts that you can handle, test, and refine — often within 48 hours.',
    features: ['Design validation & fit testing', 'Functional prototypes', 'Multiple iterations quickly', 'Wide range of materials'],
    outcome: 'Faster iteration cycles',
    cta: 'Get a Prototype Quote',
    image: '/images/projects/1_Everything_You_Should_Know_About.png',
  },
  {
    title: 'Custom Manufacturing',
    headline: 'From one-off bespoke items to small production runs',
    desc: 'Need more than a prototype? We produce consistent, high-quality parts in small to medium batches with reliable lead times and competitive pricing.',
    features: ['Small batch production (5-500 units)', 'Consistent quality per batch', 'Material flexibility', 'Packaging & fulfilment options'],
    outcome: 'Reliable production partner',
    cta: 'Request Manufacturing Quote',
    image: '/images/projects/10_Rapid_Prototyping_Service_Dassault.png',
  },
  {
    title: 'Replacement Parts',
    headline: 'Recreate discontinued or hard-to-find components',
    desc: 'Broken a bracket that is no longer made? We can reverse-engineer from your sample or drawing and produce a durable replacement — often stronger than the original.',
    features: ['Reverse engineering from samples', 'Improved designs available', 'Stronger materials than OEM', 'Single part or batch orders'],
    outcome: 'Keep equipment running',
    cta: 'Order a Replacement Part',
    image: '/images/projects/5_3D_Printed_Set_of_Four_Small_Nylon.png',
  },
  {
    title: 'Product Development',
    headline: 'Collaborative approach from concept to production',
    desc: 'Work with us through every stage — ideation, CAD modelling, prototyping, testing, and final production. We help inventors and businesses bring new products to life.',
    features: ['Concept to CAD design', 'Iterative prototyping', 'Design for manufacturing (DfM)', 'Mould-ready files if needed'],
    outcome: 'Bring products to market',
    cta: 'Start Product Development',
    image: '/images/projects/2_How_3D_Printing_is_Changing_Prototyping.png',
  },
  {
    title: 'Engineering Solutions',
    headline: 'Complex geometries and functional assemblies',
    desc: 'We produce parts that solve real engineering problems — jigs, fixtures, housings, gears, and assemblies with tight tolerances and functional requirements.',
    features: ['Jigs & fixtures', 'Housings & enclosures', 'Gears & mechanical parts', 'Assembly-fit accuracy'],
    outcome: 'Solve engineering challenges',
    cta: 'Discuss Your Project',
    image: '/images/projects/6_The_Definitive_Guide_to_3D_Printing.png',
  },
  {
    title: 'Corporate Branding',
    headline: 'Custom branded products that stand out',
    desc: 'From keychains to desk accessories, we create memorable branded items for events, trade shows, client gifts, and employee welcome packs.',
    features: ['Branded keychains & accessories', 'Trade show giveaways', 'Employee welcome packs', 'Custom colours & logos'],
    outcome: 'Stand out from competitors',
    cta: 'Order Branded Items',
    image: '/images/projects/10_Custom_3D_Printed_Logo_Keychains.png',
  },
]

export default function Services() {
  return (
    <>
      <SEO
        title="3D Printing Services NZ | KiwiKoru 3D"
        description="Professional 3D printing services in New Zealand — rapid prototyping, custom manufacturing, replacement parts, product development, engineering solutions, and corporate branding."
        path="/services"
      />

      {/* Hero */}
      <section className="relative bg-forest pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Our <span className="text-gold">Services</span>
            </h1>
            <p className="mt-4 text-white/60 max-w-2xl text-lg">
              Professional 3D printing and product development for businesses, engineers, makers, and creators across New Zealand.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {services.map((s, i) => (
            <ScrollReveal key={s.title}>
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-3">{s.title}</h2>
                  <p className="text-lg text-forest font-medium mb-3">{s.headline}</p>
                  <p className="text-gray-600 leading-relaxed mb-6">{s.desc}</p>
                  <ul className="space-y-2 mb-6">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle size={16} className="text-gold shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/quote"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-white font-medium rounded-lg hover:bg-forest-light transition-all"
                  >
                    {s.cta} <ArrowRight size={16} />
                  </Link>
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="rounded-2xl border border-gray-100 overflow-hidden bg-cream aspect-[4/3]">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>
              </div>
              {i < services.length - 1 && <hr className="border-gray-100 mt-16" />}
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-charcoal mb-4">Not Sure Which Service You Need?</h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-8">
              Contact us with your project details and we will recommend the best approach, material, and process for your application.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/quote" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-forest-dark font-semibold rounded-lg hover:bg-gold-light transition-all">
                Get a Quote <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 border border-forest text-forest font-medium rounded-lg hover:bg-forest hover:text-white transition-all">
                Contact Us
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
