import ScrollReveal from '../components/ScrollReveal'

const projects = [
  { title: 'Replacement Bracket', industry: 'Industrial', material: 'PETG', app: 'Functional', desc: 'Custom bracket for machinery where OEM part was discontinued.', image: '/images/projects/4_3D_Printing_Replacement_Parts_Protote.png' },
  { title: 'Irrigation Valve', industry: 'Agricultural', material: 'ASA', app: 'Outdoor', desc: 'UV-resistant valve connector for farm irrigation system.', image: '/images/projects/1_irrigation_connectors_3D_Models_to.png' },
  { title: 'Dashboard Mount', industry: 'Automotive', material: 'ABS', app: 'Interior', desc: 'Custom phone mount integrated into vehicle dashboard.', image: '/images/projects/8_Objet_Geometrics_3D_Prints_Electric.png' },
  { title: 'Product Prototype', industry: 'Consumer', material: 'PLA', app: 'Prototyping', desc: 'Rapid prototype for consumer electronics housing.', image: '/images/projects/2_Custom_Design_3D_Printing_Mobile.png' },
  { title: 'Architectural Model', industry: 'Design', material: 'PLA', app: 'Presentation', desc: 'Detailed scale model for client presentation.', image: '/images/projects/3_White_Architectural_Model_Making.png' },
  { title: 'Promotional Keychains', industry: 'Corporate', material: 'PLA', app: 'Branding', desc: '100 branded keychains for conference giveaway.', image: '/images/projects/10_Custom_3D_Printed_Logo_Keychains.png' },
]

export default function ProjectsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal">Recent Projects</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">A selection of work we've delivered for clients across New Zealand.</p>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ScrollReveal key={p.title}>
              <div className="border border-gray-100 rounded-xl overflow-hidden hover:border-forest/20 hover:shadow-lg transition-all duration-300 bg-white">
                <div className="aspect-[4/3] bg-cream overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-forest/5 text-forest text-xs rounded">{p.industry}</span>
                    <span className="px-2 py-0.5 bg-gold/10 text-gold text-xs rounded">{p.material}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-charcoal mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{p.app}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
