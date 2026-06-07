import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'

export default function CTASection() {
  return (
    <section className="py-20 bg-forest-dark">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Start Your Project?</h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">Upload your 3D model for an instant estimate, or contact us to discuss your requirements.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/quote" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-forest-dark font-semibold rounded-lg hover:bg-gold-light transition-all duration-300 hover:-translate-y-0.5">
              GET INSTANT ESTIMATE <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300">
              CONTACT US
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
