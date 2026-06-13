import SEO from '../components/SEO'
import ScrollReveal, { StaggerReveal } from '../components/ScrollReveal'
import { Link } from 'react-router-dom'
import { ArrowRight, Thermometer, Shield, Droplets, StretchHorizontal, Check, Minus } from 'lucide-react'

const materials = [
  {
    name: 'PLA',
    fullName: 'Polylactic Acid',
    tagline: 'Great for prototyping, models, and low-stress parts',
    priceFactor: 1.0,
    priceLabel: 'Base price',
    color: '#2d8a4e',
    icon: '/images/material-pla.jpg',
    properties: {
      strength: 'Medium',
      flexibility: 'Low',
      heatResistant: 'Low (up to 55°C)',
      uvResistant: 'No',
      chemicalResistant: 'Low',
      biodegradability: 'Yes',
    },
    bestFor: ['Prototypes', 'Concept models', 'Decorative parts', 'Low-stress fittings', 'Indoor use'],
    notFor: ['High heat', 'Outdoor use', 'Heavy mechanical loads'],
    description: 'PLA is the most popular 3D printing material. It is easy to print, produces great surface quality, and is biodegradable. Best for indoor applications and visual models.',
  },
  {
    name: 'PETG',
    fullName: 'Polyethylene Terephthalate Glycol',
    tagline: 'Excellent all-rounder — strong, durable, and easy to print',
    priceFactor: 1.2,
    priceLabel: '+20% vs PLA',
    color: '#2563eb',
    icon: '/images/material-petg.jpg',
    properties: {
      strength: 'High',
      flexibility: 'Medium',
      heatResistant: 'Medium (up to 75°C)',
      uvResistant: 'Moderate',
      chemicalResistant: 'High',
      biodegradability: 'No',
    },
    bestFor: ['Mechanical parts', 'Enclosures', 'Functional prototypes', 'Food-safe applications', 'Water-resistant parts'],
    notFor: ['Extreme heat', 'Flexible applications'],
    description: 'PETG combines the ease of printing of PLA with much higher strength and durability. It is chemical resistant, food-safe, and produces watertight prints. Our most recommended material for functional parts.',
  },
  {
    name: 'ABS',
    fullName: 'Acrylonitrile Butadiene Styrene',
    tagline: 'Tough, impact-resistant, and heat tolerant',
    priceFactor: 1.3,
    priceLabel: '+30% vs PLA',
    color: '#dc2626',
    icon: '/images/material-abs.jpg',
    properties: {
      strength: 'High',
      flexibility: 'Medium',
      heatResistant: 'High (up to 100°C)',
      uvResistant: 'No',
      chemicalResistant: 'Medium',
      biodegradability: 'No',
    },
    bestFor: ['Automotive parts', 'Enclosures', 'High-temp applications', 'Parts requiring post-processing', 'Snap-fit assemblies'],
    notFor: ['Outdoor UV exposure', 'Without enclosed printer'],
    description: 'ABS is a classic engineering plastic known for its toughness and heat resistance. It can be sanded, painted, and acetone-smoothed for a professional finish. Requires heated bed printing.',
  },
  {
    name: 'ASA',
    fullName: 'Acrylonitrile Styrene Acrylate',
    tagline: 'UV-stable outdoor performance with great aesthetics',
    priceFactor: 1.4,
    priceLabel: '+40% vs PLA',
    color: '#ea580c',
    icon: '/images/material-asa.jpg',
    properties: {
      strength: 'High',
      flexibility: 'Medium',
      heatResistant: 'High (up to 95°C)',
      uvResistant: 'Yes',
      chemicalResistant: 'Medium',
      biodegradability: 'No',
    },
    bestFor: ['Outdoor parts', 'Automotive trim', 'Marine applications', 'Garden equipment', 'Signage'],
    notFor: ['Flexible requirements', 'Food contact'],
    description: 'ASA is like ABS but with excellent UV resistance. It will not yellow or degrade in sunlight, making it the top choice for outdoor and automotive applications in New Zealand conditions.',
  },
  {
    name: 'TPU',
    fullName: 'Thermoplastic Polyurethane',
    tagline: 'Flexible, rubber-like, and highly durable',
    priceFactor: 1.5,
    priceLabel: '+50% vs PLA',
    color: '#7c3aed',
    icon: '/images/material-tpu.jpg',
    properties: {
      strength: 'Medium',
      flexibility: 'High',
      heatResistant: 'Medium (up to 80°C)',
      uvResistant: 'Moderate',
      chemicalResistant: 'Medium',
      biodegradability: 'No',
    },
    bestFor: ['Gaskets & seals', 'Phone cases', 'Wheels & tyres', 'Flexible hinges', 'Vibration dampeners', 'Wearables'],
    notFor: ['Rigid structural parts', 'Very high heat'],
    description: 'TPU is a flexible, rubber-like material that can bend, compress, and return to shape. Available in various shore hardnesses from soft (92A) to semi-rigid. Excellent abrasion resistance.',
  },
]

const comparisonRows = [
  { label: 'Strength', icon: Shield, key: 'strength' as const },
  { label: 'Flexibility', icon: StretchHorizontal, key: 'flexibility' as const },
  { label: 'Heat Resistance', icon: Thermometer, key: 'heatResistant' as const },
  { label: 'UV Resistance', icon: SunIcon, key: 'uvResistant' as const },
  { label: 'Chemical Resistance', icon: Droplets, key: 'chemicalResistant' as const },
]

function SunIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

/* Filament spool icon — symbolic roll of 3D printing filament */
function FilamentSpool({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Spool body */}
      <ellipse cx="12" cy="12" rx="7" ry="9" />
      {/* Top flange */}
      <ellipse cx="12" cy="5" rx="7" ry="2.5" />
      {/* Bottom flange */}
      <ellipse cx="12" cy="19" rx="7" ry="2.5" />
      {/* Center hole */}
      <ellipse cx="12" cy="12" rx="2.5" ry="3.5" />
      {/* Filament line */}
      <path d="M12 1.5c0 0-3 2-3 4.5" opacity="0.5" />
    </svg>
  )
}

export default function Materials() {
  return (
    <>
      <SEO
        title="3D Printing Materials Guide | PLA PETG ABS ASA TPU | KiwiKoru 3D"
        description="Compare 3D printing materials — PLA, PETG, ABS, ASA, TPU. Find the best material for your project with our comprehensive material guide and properties comparison."
        path="/materials"
      />

      {/* Hero */}
      <section className="relative bg-forest pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Material <span className="text-gold">Guide</span>
            </h1>
            <p className="mt-4 text-white/60 max-w-2xl text-lg">
              Choose the right material for your application. We offer five professional-grade filaments, each suited to different requirements.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Quick Comparison Table */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal">Quick Comparison</h2>
            <p className="mt-3 text-gray-600">At a glance — find the material that matches your needs</p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full min-w-[700px] border-collapse">
                <thead>
                  <tr className="border-b-2 border-forest/10">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                    {materials.map((m) => (
                      <th key={m.name} className="text-center py-4 px-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: m.color + '15', color: m.color }}>
                          <FilamentSpool size={13} /> {m.name}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.label} className="border-b border-gray-50 hover:bg-cream/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-charcoal">
                          <row.icon size={16} className="text-forest" />
                          {row.label}
                        </div>
                      </td>
                      {materials.map((m) => (
                        <td key={m.name} className="text-center py-4 px-3 text-sm text-gray-600">
                          {m.properties[row.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="border-b border-gray-50">
                    <td className="py-4 px-4 text-sm font-medium text-charcoal">Price Factor</td>
                    {materials.map((m) => (
                      <td key={m.name} className="text-center py-4 px-3">
                        <span className="text-sm font-semibold text-gold">{m.priceLabel}</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Detailed Material Cards */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal">Material Details</h2>
            <p className="mt-3 text-gray-600">Deep dive into each material's properties and ideal applications</p>
          </ScrollReveal>

          <div className="space-y-12">
            {materials.map((m) => (
              <ScrollReveal key={m.name}>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="grid lg:grid-cols-[300px_1fr]">
                    {/* Material Header */}
                    <div className="p-8 flex flex-col justify-center" style={{ backgroundColor: m.color + '08' }}>
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: m.color + '15' }}>
                        <span className="inline-flex items-center gap-2 text-2xl font-bold" style={{ color: m.color }}><FilamentSpool size={20} /> {m.name}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{m.fullName}</p>
                      <p className="text-sm font-medium text-gold mb-4">{m.priceLabel}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{m.tagline}</p>
                    </div>

                    {/* Material Details */}
                    <div className="p-8">
                      <p className="text-sm text-gray-600 leading-relaxed mb-6">{m.description}</p>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Best For</p>
                          <ul className="space-y-1.5">
                            {m.bestFor.map((item) => (
                              <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                                <Check size={14} className="text-green-500 shrink-0" /> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Not Ideal For</p>
                          <ul className="space-y-1.5">
                            {m.notFor.map((item) => (
                              <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                                <Minus size={14} className="text-gray-300 shrink-0" /> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {Object.entries(m.properties).map(([key, value]) => (
                            <div key={key} className="bg-cream rounded-lg px-3 py-2">
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                              <p className="text-xs font-medium text-charcoal mt-0.5">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendation Guide */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal">Material Selection Guide</h2>
            <p className="mt-3 text-gray-600">Match your application to the best material</p>
          </ScrollReveal>

          <StaggerReveal className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { scenario: 'First prototype / visual model', material: 'PLA', why: 'Best surface finish, lowest cost' },
              { scenario: 'Functional mechanical part', material: 'PETG', why: 'Strong, durable, easy to print' },
              { scenario: 'Outdoor / UV exposure', material: 'ASA', why: 'UV stable, weather resistant' },
              { scenario: 'High heat application', material: 'ABS', why: 'Highest heat resistance' },
              { scenario: 'Flexible / rubber part', material: 'TPU', why: 'Flexible with great abrasion resistance' },
              { scenario: 'Food contact / chemical exposure', material: 'PETG', why: 'Food-safe and chemical resistant' },
              { scenario: 'Snap-fit assembly', material: 'ABS or PETG', why: 'Good layer adhesion and toughness' },
              { scenario: 'Marine / wet environment', material: 'ASA', why: 'Water and UV resistant' },
              { scenario: 'Wearable / soft grip', material: 'TPU', why: 'Comfortable flexible material' },
            ].map((rec) => (
              <div key={rec.scenario} className="bg-cream rounded-xl p-5 border border-gray-100">
                <p className="text-sm font-medium text-charcoal mb-2">{rec.scenario}</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-forest/5 text-forest text-xs font-semibold rounded">{rec.material}</span>
                  <span className="text-xs text-gray-500">{rec.why}</span>
                </div>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-forest-dark">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Print?</h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Upload your 3D model and select your material. Our quote tool gives you an instant price estimate.
            </p>
            <Link
              to="/quote"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-forest-dark font-semibold rounded-lg hover:bg-gold-light transition-all"
            >
              Get an Instant Quote <ArrowRight size={18} />
            </Link>
          </ScrollReveal>
        </div>
   
      </section>
    </>
  )
}
