import ScrollReveal from '../components/ScrollReveal'
import { Check } from 'lucide-react'

const credibilityTags = [
  '10+ Years Experience',
  'Industrial Designer',
  'Product Development',
  'Rapid Prototyping',
  'Automotive Components',
  'Industrial Solutions',
  'NZ Based',
]

export default function FounderSection() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <ScrollReveal>
            <div className="relative mx-auto lg:mx-0 max-w-md">
              <div className="rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100">
                <img
                  src="/images/founder.jpg"
                  alt="Industrial designer and founder of KiwiKoru 3D in the workshop"
                  className="w-full aspect-[3/4] object-cover"
                  loading="lazy"
                  width="600"
                  height="800"
                />
              </div>
              {/* Subtle decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-gold/20 rounded-2xl -z-10" aria-hidden="true" />
              <div className="absolute -top-4 -left-4 w-16 h-16 border border-forest/10 rounded-2xl -z-10" aria-hidden="true" />
            </div>
          </ScrollReveal>

          {/* Content */}
          <ScrollReveal>
            <div>
              <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-3">The Maker Behind It All</p>
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal leading-tight">
                Experience Behind Every Project
              </h2>
              <p className="mt-3 text-lg font-semibold text-charcoal">Rod Castagno</p>
              <p className="text-xs text-gray-400 tracking-wide uppercase">an industrial designer</p>
              <div className="mt-6 space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  Rod leads KiwiKoru with over a decade of hands-on experience
                  in product development, rapid prototyping, and digital manufacturing. Every project
                  that comes through the workshop benefits from a deep understanding of design for
                  manufacturing, material selection, and production optimisation.
                </p>
                <p>
                  From automotive components and industrial brackets to consumer product prototypes
                  and replacement parts — the approach is always the same: understand the problem,
                  design the solution, and deliver parts that work. No shortcuts, no compromises.
                </p>
                <p>
                  Backed by a team of designers and engineers ready to solve any challenge.
                  Based in Whangārei, Northland, proudly serving clients across New Zealand
                  with a passion for solving real problems through efficient design.
                </p>
              </div>

              {/* Credibility Tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {credibilityTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-xs font-medium text-charcoal"
                  >
                    <Check size={12} className="text-forest" aria-hidden="true" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Experience Stats */}
              <div className="mt-8 grid grid-cols-4 gap-4 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-2xl font-bold text-charcoal">10+</p>
                  <p className="text-xs text-gray-500 mt-1">Years Experience</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-charcoal">500+</p>
                  <p className="text-xs text-gray-500 mt-1">Projects Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-charcoal">5</p>
                  <p className="text-xs text-gray-500 mt-1">Materials</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-charcoal">6</p>
                  <p className="text-xs text-gray-500 mt-1">Industries</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
