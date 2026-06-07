import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

const sLinks = [
  { l: 'Custom 3D Printing', p: '/services' },
  { l: 'Rapid Prototyping', p: '/services' },
  { l: 'Replacement Parts', p: '/services' },
  { l: 'Product Development', p: '/services' },
  { l: 'Engineering Solutions', p: '/services' },
  { l: 'Corporate Branding', p: '/services' },
]

export default function Footer() {
  return (
    <footer className="bg-forest-dark text-white/60">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.png" alt="" className="w-10 h-10 rounded-lg" />
              <span className="text-white font-semibold text-lg">KiwiKoru 3D</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">Custom 3D printing and product development services in New Zealand.</p>
            <div className="space-y-2 text-sm">
              <a href="mailto:kiwikoru3d@gmail.com" className="flex items-center gap-2 hover:text-gold transition-colors"><Mail size={14} />kiwikoru3d@gmail.com</a>
              <a href="tel:+640272602954" className="flex items-center gap-2 hover:text-gold transition-colors"><Phone size={14} />+64 027 260 2954</a>
              <span className="flex items-center gap-2"><MapPin size={14} />Whangārei, New Zealand</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              {sLinks.map((s) => (<li key={s.l}><Link to={s.p} className="hover:text-gold transition-colors">{s.l}</Link></li>))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/materials" className="hover:text-gold transition-colors">Material Guide</Link></li>
              <li><Link to="/quote" className="hover:text-gold transition-colors">Get a Quote</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 border border-white/20 rounded-full text-xs text-white/50">
              <span className="w-2 h-2 rounded-full bg-gold" />
              Proudly New Zealand Service
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <span>2026 KiwiKoru 3D. All rights reserved.</span>
          <span>Whangārei, New Zealand</span>
        </div>
      </div>
    </footer>
  )
}
