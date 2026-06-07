import { MapPin, Clock, Shield, Truck, Leaf } from 'lucide-react'
import StaggerReveal from '../components/ScrollReveal'

const items = [
  { icon: MapPin, title: 'Based in Whangārei', desc: 'Northland, NZ' },
  { icon: Clock, title: 'Fast Turnaround', desc: '48-72 hours typical' },
  { icon: Shield, title: '5 Materials Available', desc: 'PLA, PETG, ABS, ASA, TPU' },
  { icon: Truck, title: 'Nationwide Delivery', desc: 'Courier anywhere in NZ' },
  { icon: Leaf, title: 'Sustainable Options', desc: 'Recycled PLA available' },
]

export default function TrustSection() {
  return (
    <section className="bg-cream border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <StaggerReveal className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <item.icon size={20} className="text-forest shrink-0" />
              <div>
                <p className="text-sm font-semibold text-charcoal">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  )
}
