import { useEffect, useState } from 'react'
import ScrollReveal from '../components/ScrollReveal'
import { Check } from 'lucide-react'

const credibilityTags = [
  'Interdisciplinary Team',
  'Industrial Design Studio',
  'Product Development',
  'Rapid Prototyping',
  '3D Printing Solutions',
  'Problem Solving',
  'NZ Based',
]

export default function FounderSection() {
  const [imagePosition, setImagePosition] = useState(50)

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('estudio-dit-section')
      if (!section) return

      const rect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight

      const progress =
        1 - Math.min(Math.max(rect.top / windowHeight, 0), 1)

      const position = 25 + progress * 50

      setImagePosition(position)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="estudio-dit-section" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <ScrollReveal>
            <div className="relative mx-auto lg:mx-0 max-w-md">
              <div className="rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100 bg-white">
                <img
                  src="/images/estudio-dit-team.png"
                  alt="Interdisciplinary industrial design team working in a 3D printing studio"
                  className="w-full aspect-[3/4] object-cover transition-[object-position] duration-300 ease-out"
                  style={{
                    objectPosition: `${imagePosition}% center`,
                  }}
                  loading="lazy"
                  width="600"
                  height="800"
                />
              </div>

              {/* Decorative accents */}
              <div
                className="absolute -bottom-4 -right-4 w-24 h-24 border border-gold/20 rounded-3xl -z-10"
                aria-hidden="true"
              />
              <div
                className="absolute -top-4 -left-4 w-16 h-16 border border-forest/10 rounded-3xl -z-10"
                aria-hidden="true"
              />
            </div>
          </ScrollReveal>

          {/* Content */}
          <ScrollReveal>
            <div>
              <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                The Team Behind It All
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-charcoal leading-tight">
                Experience Behind Every Project
              </h2>

              <p className="mt-3 text-lg font-semibold text-charcoal">
                Estudio Dit.
              </p>

              <p className="text-xs text-gray-400 tracking-wide uppercase">
                an interdisciplinary industrial design team
              </p>

              <div className="mt-6 space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  KiwiKoru is supported by <strong>Estudio Dit.</strong>, an
                  interdisciplinary team with a strong background in industrial
                  design, product development, rapid prototyping, and digital
                  manufacturing. Every project benefits from a collaborative
                  approach that combines creative thinking with practical,
                  production-focused solutions.
                </p>

                <p>
                  From functional prototypes and replacement parts to custom
                  components and industrial applications, the process always
                  begins with understanding the problem clearly and developing a
                  solution that is efficient, manufacturable, and fit for
                  purpose.
                </p>

                <p>
                  Based in Whangārei, Northland, KiwiKoru and Estudio Dit. work
                  together to deliver thoughtful design, reliable 3D printing,
                  and real-world problem solving for clients across New Zealand.
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