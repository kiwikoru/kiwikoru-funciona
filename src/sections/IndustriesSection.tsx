import ScrollReveal from '../components/ScrollReveal'
import { Tractor, Factory, Ship, Car, Lightbulb, GraduationCap } from 'lucide-react'

const industries = [
  {
    icon: Tractor,
    name: 'Agriculture',
    desc: 'Irrigation fittings, equipment brackets, sensor housings, and replacement parts engineered for harsh outdoor environments.',
    example: 'UV-resistant valve connectors',
    material: 'ASA',
  },
  {
    icon: Factory,
    name: 'Manufacturing',
    desc: 'Jigs, fixtures, tooling aids, and custom components that streamline production lines and reduce downtime.',
    example: 'Assembly jigs & custom brackets',
    material: 'PETG',
  },
  {
    icon: Ship,
    name: 'Marine',
    desc: 'Saltwater-resistant hardware, mounting brackets, and replacement fittings for boats and coastal infrastructure.',
    example: 'Corrosion-resistant hardware',
    material: 'ASA',
  },
  {
    icon: Car,
    name: 'Automotive',
    desc: 'Dashboard mounts, interior trim, brackets, and custom adapters for both restoration and modification projects.',
    example: 'Interior mounts & adapters',
    material: 'ABS',
  },
  {
    icon: Lightbulb,
    name: 'Product Development',
    desc: 'From concept models to functional prototypes — iterate quickly and validate designs before committing to tooling.',
    example: 'Functional prototypes',
    material: 'PLA',
  },
  {
    icon: GraduationCap,
    name: 'Education',
    desc: 'Teaching aids, scientific models, experimental components, and hands-on learning tools for schools and universities.',
    example: 'Anatomical & scientific models',
    material: 'PLA',
  },
]

export default function IndustriesSection() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-3">Industry Solutions</p>
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal">Industries We Serve</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            KiwiKoru works with businesses, engineers, and creators across New Zealand. Whatever your industry, we deliver parts that solve real problems.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((ind) => (
            <ScrollReveal key={ind.name}>
              <div className="group bg-white border border-gray-100 rounded-xl p-6 hover:border-forest/15 hover:shadow-md transition-all duration-300 h-full">
                <div className="w-11 h-11 bg-forest/[0.05] rounded-lg flex items-center justify-center mb-4 group-hover:bg-forest/[0.08] transition-colors">
                  <ind.icon size={20} className="text-forest" />
                </div>
                <h3 className="text-base font-semibold text-charcoal mb-2">{ind.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{ind.desc}</p>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                  <span className="text-[11px] text-gray-400">Example:</span>
                  <span className="text-[11px] text-forest font-medium">{ind.example}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-cream rounded text-gray-400 ml-auto">{ind.material}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
