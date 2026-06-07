import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Materials', path: '/materials' },
  { label: 'Get a Quote', path: '/quote' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { setOpen(false) }, [loc.pathname])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-forest/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 focus-gold">
            <img src="/images/logo.png" alt="KiwiKoru 3D" className="w-10 h-10 rounded-xl shadow-lg shadow-black/20" />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-white font-bold text-[17px] tracking-[0.12em] uppercase" style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', system-ui, sans-serif" }}>KiwiKoru</span>
              <span className="text-gold text-[9px] font-semibold tracking-[0.25em] uppercase mt-0.5">3D Printing NZ</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link key={l.path} to={l.path} className={`text-sm font-medium tracking-wide transition-colors ${loc.pathname === l.path ? 'text-gold' : 'text-white/70 hover:text-white'}`}>
                {l.label}
              </Link>
            ))}
          </div>
          <button className="md:hidden text-white p-2" onClick={() => setOpen(true)} aria-label="Menu"><Menu size={24} /></button>
        </div>
      </nav>
      {open && (
        <div className="fixed inset-0 z-[60] bg-forest/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
          <button className="absolute top-5 right-6 text-white p-2" onClick={() => setOpen(false)} aria-label="Close"><X size={28} /></button>
          {links.map((l) => (
            <Link key={l.path} to={l.path} className="text-2xl font-semibold text-white hover:text-gold transition-colors">{l.label}</Link>
          ))}
        </div>
      )}
    </>
  )
}
