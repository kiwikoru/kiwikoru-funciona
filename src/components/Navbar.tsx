import { useState, useEffect, useCallback } from 'react'
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

  // Logo click: navigate to home AND force scroll to top even when already on home
  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    if (loc.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [loc.pathname])

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[70] focus:bg-gold focus:text-forest-dark focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:text-sm focus:shadow-lg"
      >
        Skip to content
      </a>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-forest/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link
            to="/"
            onClick={handleLogoClick}
            className="focus-gold"
            aria-label="KiwiKoru 3D — Home"
          >
            <img src="/images/logo.png" alt="" className="w-10 h-10 rounded-xl shadow-lg shadow-black/20" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => {
              const isActive = loc.pathname === l.path
              return (
                <Link
                  key={l.path}
                  to={l.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-sm font-medium tracking-wide transition-colors relative ${
                    isActive ? 'text-gold' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {l.label}
                  {isActive && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold rounded-full" aria-hidden="true" />}
                </Link>
              )
            })}
          </div>

          <button className="md:hidden text-white p-2" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-forest/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
          <button className="absolute top-5 right-6 text-white p-2" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={28} />
          </button>
          {links.map((l) => {
            const isActive = loc.pathname === l.path
            return (
              <Link
                key={l.path}
                to={l.path}
                aria-current={isActive ? 'page' : undefined}
                className={`text-2xl font-semibold transition-colors ${isActive ? 'text-gold' : 'text-white hover:text-gold'}`}
              >
                {l.label}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
