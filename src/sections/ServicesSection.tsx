import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'

const services = [
  { title: 'Rapid Prototyping', desc: 'Transform concepts into physical parts quickly. Perfect for design validation and functional testing.', outcome: 'Faster iteration cycles', image: '/images/projects/1_Everything_You_Should_Know_About.png' },
  { title: 'Custom Manufacturing', desc: 'From one-off bespoke items to small production runs, with consistent quality and reliable lead times.', outcome: 'Reliable production partner', image: '/images/projects/10_Rapid_Prototyping_Service_Dassault.png' },
  { title: 'Replacement Parts', desc: 'Recreate discontinued or hard-to-find parts. Reverse engineer from samples or drawings.', outcome: 'Keep equipment running', image: '/images/projects/5_3D_Printed_Set_of_Four_Small_Nylon.png' },
  { title: 'Product Development', desc: 'Collaborative approach from concept through to production-ready designs with iterative refinement.', outcome: 'Bring products to market', image: '/images/projects/2_How_3D_Printing_is_Changing_Prototyping.png' },
  { title: 'Engineering Solutions', desc: 'Complex geometries and functional assemblies for testing, fit-checking, and proof of concept.', outcome: 'Solve engineering challenges', image: '/images/projects/6_The_Definitive_Guide_to_3D_Printing.png' },
  { title: 'Corporate Branding', desc: 'Custom keychains, promotional products, event giveaways, and branded accessories for your business.', outcome: 'Stand out from competitors', image: '/images/projects/10_Custom_3D_Printed_Logo_Keychains.png' },
]

export default function ServicesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal">What We Do</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Professional 3D printing services for businesses, engineers, makers, and creators across New Zealand.</p>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <ScrollReveal key={s.title} delay={0.05}>
              <div className="group border border-gray-100 rounded-xl overflow-hidden hover:border-forest/20 hover:shadow-lg transition-all duration-300 h-full bg-white">
                <div className="aspect-[16/10] bg-cream overflow-hidden">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-charcoal mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{s.desc}</p>
                  <span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs font-medium rounded-full">{s.outcome}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal className="text-center mt-12">
          <Link to="/services" className="inline-flex items-center gap-2 text-forest font-medium hover:text-gold transition-colors">
            View All Services <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
