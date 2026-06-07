import ScrollReveal from '../components/ScrollReveal'

const cases = [
  { title: 'Replacement Parts', desc: 'Manufacturing facility needed 50 custom brackets for machinery. Delivered in PETG with 48-hour turnaround.', result: '50 parts delivered' },
  { title: 'Agricultural Solutions', desc: 'Farm required UV-resistant irrigation connectors. Printed in ASA for outdoor durability.', result: 'UV-resistant parts' },
  { title: 'Automotive Prototyping', desc: 'Engineer needed functional prototype of custom dashboard component for fit testing.', result: 'Functional prototype' },
  { title: 'Corporate Branding', desc: 'Business ordered 200 branded keychains and desk accessories for trade show. Printed in PLA with custom colours.', result: '200 branded items' },
]

export default function CaseStudiesSection() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal">Case Studies</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Real projects, real results for New Zealand businesses.</p>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-6">
          {cases.map((c) => (
            <ScrollReveal key={c.title}>
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-charcoal mb-2">{c.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{c.desc}</p>
                <span className="inline-block px-3 py-1 bg-forest/5 text-forest text-xs font-medium rounded-full">{c.result}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
