import { Upload, Eye, Sliders, Calculator, Send } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'

const steps = [
  { icon: Upload, num: '01', title: 'Upload Your 3D Model', desc: 'Drop your STL, OBJ, or 3MF file into our quote tool. We support all major 3D file formats.' },
  { icon: Eye, num: '02', title: 'Preview & Configure', desc: 'Visualise your model in 3D. Select material, colour, infill, and print settings to match your needs.' },
  { icon: Sliders, num: '03', title: 'Review Estimate', desc: 'Get an instant price breakdown including material usage, print time, and cost per unit with bulk discounts.' },
  { icon: Calculator, num: '04', title: 'Refine Settings', desc: 'Toggle Advanced Settings to fine-tune layer height, wall count, supports, and surface finish.' },
  { icon: Send, num: '05', title: 'Submit & Produce', desc: 'Send your quote request. We\'ll confirm within 24 hours and start production. Delivery nationwide.' },
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal">How It Works</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">From upload to delivery in five simple steps.</p>
        </ScrollReveal>
        <div className="space-y-6">
          {steps.map((s, i) => (
            <ScrollReveal key={s.num} delay={i * 0.08}>
              <div className="flex items-start gap-6 bg-white rounded-xl p-6 border border-gray-100">
                <div className="w-12 h-12 bg-forest/5 rounded-lg flex items-center justify-center shrink-0">
                  <s.icon size={22} className="text-forest" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-gold">{s.num}</span>
                    <h3 className="text-lg font-semibold text-charcoal">{s.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
