import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

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
  const { itemCount } = useCart()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [loc.pathname])

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
            className="flex items-center gap-3 focus-gold"
            aria-label="KiwiKoru 3D — Home"
          >
            <img src="/images/logo.png" alt="" className="w-10 h-10 rounded-xl shadow-lg shadow-black/20" />
            <span className="text-white font-semibold text-base tracking-wide hidden sm:block">KiwiKoru</span>
          </Link>

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
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              )
            })}

            <Link
              to="/cart"
              aria-label="View cart"
              className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full border transition-all ${
                loc.pathname === '/cart'
                  ? 'border-gold text-gold bg-white/5'
                  : 'border-white/20 text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShoppingCart size={20} />

              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-gold text-forest-dark text-xs font-bold flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/cart"
              aria-label="View cart"
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full text-white"
            >
              <ShoppingCart size={22} />

              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-gold text-forest-dark text-xs font-bold flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              className="text-white p-2"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[60] bg-forest/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
          <button
            className="absolute top-5 right-6 text-white p-2"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
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

          <Link
            to="/cart"
            aria-current={loc.pathname === '/cart' ? 'page' : undefined}
            className={`relative inline-flex items-center gap-3 text-2xl font-semibold transition-colors ${
              loc.pathname === '/cart' ? 'text-gold' : 'text-white hover:text-gold'
            }`}
          >
            <ShoppingCart size={26} />
            Cart

            {itemCount > 0 && (
              <span className="min-w-[24px] h-6 px-2 rounded-full bg-gold text-forest-dark text-xs font-bold flex items-center justify-center shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      )}
    </>
  )
}