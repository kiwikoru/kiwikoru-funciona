import { Link } from 'react-router-dom'
import { CheckCircle, Sun, Thermometer, Droplets, Eye, ArrowRight } from 'lucide-react'
import ParticleCanvas from '../components/ParticleCanvas'
import ScrollReveal from '../components/ScrollReveal'
import SectionHeader from '../components/SectionHeader'
import SEO, { generateBreadcrumbSchema } from '../components/SEO'

const materials = [
  {
    name: 'PLA',
    subtitle: 'Standard',
    color: '#f5f0e8',
    properties: ['Easy to print', 'Biodegradable', 'Good detail', 'Low odor', 'Rigid'],
    bestFor: ['Prototypes', 'Display models', 'Indoor use', 'Beginner projects'],
    description:
      'Polylactic Acid is the most popular 3D printing material. It\'s easy to work with, produces great detail, and is made from renewable resources. Perfect for prototypes, decorative items, and any part that won\'t be exposed to high heat or outdoor conditions.',
  },
  {
    name: 'PETG',
    subtitle: 'Durable',
    color: '#e8e0d4',
    properties: ['Strong', 'Impact resistant', 'Chemical resistant', 'Food safe', 'Low shrinkage'],
    bestFor: ['Functional parts', 'Mechanical components', 'Outdoor use', 'Containers'],
    description:
      'Polyethylene Terephthalate Glycol combines the ease of printing of PLA with much greater durability. It\'s the go-to choice for functional parts that need to withstand stress, impact, or outdoor exposure.',
  },
  {
    name: 'ASA',
    subtitle: 'Impact Resistant',
    color: '#2a2a2a',
    properties: ['UV stable', 'Weather resistant', 'High impact', 'Glossy finish', 'Heat resistant'],
    bestFor: ['Outdoor parts', 'Automotive', 'Marine', 'Long-term exposure'],
    description:
      'Acrylonitrile Styrene Acrylate is the premium choice for outdoor and automotive applications. It resists UV degradation, maintains strength in harsh weather, and produces a smooth, glossy surface finish.',
  },
  {
    name: 'TPU',
    subtitle: 'Flexible',
    color: '#3d5a4e',
    properties: ['Rubber-like', 'Flexible', 'Abrasion resistant', 'Shock absorbing', 'Durable'],
    bestFor: ['Gaskets', 'Grips', 'Phone cases', 'Wearables', 'Seals'],
    description:
      'Thermoplastic Polyurethane is a flexible, rubber-like filament that combines elasticity with durability. Perfect for gaskets, grips, phone cases, wearables, and any part that needs to bend, flex, or absorb impact.',
  },
]

const tips = [
  {
    icon: Sun,
    title: 'Consider the Environment',
    desc: 'Will your part be used indoors or outdoors? PLA is great for indoor display, while PETG and ASA handle weather and UV exposure. TPU is ideal for flexible, rubber-like parts.',
  },
  {
    icon: Thermometer,
    title: 'Think About Function',
    desc: 'Does your part need to bear load or withstand impact? PETG offers the best strength-to-printability ratio for functional parts.',
  },
  {
    icon: Droplets,
    title: 'Check the Temperature',
    desc: 'Will your part be exposed to heat? ASA handles the highest temperatures, followed by PETG. PLA starts to deform around 55°C. TPU remains flexible across a wide temperature range.',
  },
  {
    icon: Eye,
    title: 'Surface Finish Matters',
    desc: 'PLA produces the finest detail and smoothest surfaces. ASA offers a glossy finish. PETG is slightly more textured. TPU has a matte, rubber-like feel.',
  },
]

export default function Materials() {
  const schema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://kiwikoru3d.com/' },
    { name: 'Materials', url: 'https://kiwikoru3d.com/materials' },
  ])

  return (
    <>
      <SEO
        title="3D Printing Materials Guide | PLA, PETG, ASA, TPU | KiwiKoru 3D NZ"
        description="Compare 3D printing materials — PLA, PETG, ASA, and TPU Flexible. Learn which filament is best for your project. Professional material advice from Whangārei's KiwiKoru 3D."
        path="/materials"
        schema={schema}
      />

      {/* Hero */}
      <section className="relative min-h-[320px] md:min-h-[40vh] bg-forest flex items-center justify-center" aria-label="Materials hero">
        <ParticleCanvas count={25} />
        <div className="relative z-10 text-center px-6 max-w-[600px]">
          <ScrollReveal>
            <h1 className="text-[36px] md:text-[48px] font-extrabold text-white leading-tight">
              3D Printing Materials Guide
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="mt-4 text-white/70 text-base leading-relaxed">
              Choose the right filament for your project. We stock premium-quality materials for every application.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Materials Comparison */}
      <section className="bg-white py-[60px] md:py-[100px]" aria-labelledby="materials-compare-heading">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader
            id="materials-compare-heading"
            headline="Compare Our Materials"
          />

          <ScrollReveal variant="stagger" className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {materials.map((m) => (
              <div
                key={m.name}
                className="border border-border-light rounded-xl overflow-hidden transition-all duration-400 hover:-translate-y-1 hover:shadow-card"
              >
                {/* Color swatch */}
                <div className="h-10" style={{ backgroundColor: m.color }} />

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-charcoal">
                    {m.name} <span className="text-base font-medium text-charcoal-light">— {m.subtitle}</span>
                  </h3>

                  <ul className="mt-4 space-y-2" role="list">
                    {m.properties.map((prop) => (
                      <li key={prop} className="flex items-center gap-2 text-sm text-charcoal-light">
                        <CheckCircle size={14} className="text-gold shrink-0" />
                        {prop}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {m.bestFor.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gold/15 text-gold text-xs font-medium rounded-pill"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 text-sm text-charcoal-light leading-relaxed">{m.description}</p>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Material Tips */}
      <section className="bg-off-white py-[60px] md:py-[100px]" aria-labelledby="tips-heading">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <h2 id="tips-heading" className="text-[28px] md:text-[36px] font-bold text-charcoal text-center">
              Not Sure Which Material to Choose?
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="stagger" delay={0.15} className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip) => (
              <div key={tip.title} className="bg-white border border-border-light rounded-xl p-8">
                <tip.icon size={24} className="text-forest mb-3" />
                <h3 className="text-lg font-semibold text-charcoal">{tip.title}</h3>
                <p className="mt-2 text-sm text-charcoal-light leading-relaxed">{tip.desc}</p>
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
              Ready to Print?
            </h2>
            <p className="mt-3 text-white/70 max-w-[480px] mx-auto">
              Upload your design and get a quote. We'll help you choose the right material.
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
