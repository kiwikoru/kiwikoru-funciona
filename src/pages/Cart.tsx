import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Package,
  Ruler,
  Layers,
  Palette,
  Send,
  AlertCircle,
  Mail,
} from 'lucide-react'
import SEO from '../components/SEO'
import ScrollReveal from '../components/ScrollReveal'
import { useCart } from '../contexts/CartContext'

const CONTACT_EMAIL = 'kiwikoru3d@gmail.com'

function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) {
    return 'Size unavailable'
  }

  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  return `${(bytes / 1024).toFixed(0)} KB`
}

export default function Cart() {
  const navigate = useNavigate()

  const {
    items,
    removeItem,
    clearCart,
    cartTotal,
    itemCount,
    unitCount,
  } = useCart()

  const missingFileCount = items.filter((item) => !item.file).length

  return (
    <>
      <SEO
        title="Cart | KiwiKoru 3D"
        description="Review your 3D printing quote cart before sending your request to KiwiKoru 3D."
        path="/cart"
      />

      <section className="bg-forest pt-28 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Your <span className="text-gold">Cart</span>
            </h1>

            <p className="mt-3 text-white/60 max-w-xl">
              Review the 3D printing items added to your quote request.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {items.length === 0 ? (
            <ScrollReveal>
              <div className="border border-gray-200 rounded-2xl p-12 text-center bg-cream">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <ShoppingCart
                    size={30}
                    className="text-forest"
                  />
                </div>

                <h2 className="text-2xl font-bold text-charcoal mb-3">
                  Your cart is empty
                </h2>

                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  Add one or more 3D models from the quote page to build your request.
                </p>

                <Link
                  to="/quote"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-forest-dark font-semibold rounded-lg hover:bg-gold-light transition-all"
                >
                  <ArrowLeft size={16} />
                  Go to Quote
                </Link>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid lg:grid-cols-[1fr_360px] gap-8">
              <div className="space-y-4">
                {missingFileCount > 0 && (
                  <ScrollReveal>
                    <div className="flex items-start gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-5">
                      <AlertCircle
                        size={20}
                        className="text-gold shrink-0 mt-0.5"
                      />

                      <div>
                        <h2 className="font-semibold text-charcoal mb-1">
                          Some original files need to be sent again
                        </h2>

                        <p className="text-sm text-gray-600 leading-relaxed">
                          Your cart details were restored, but browsers cannot permanently store the original 3D model files. Please attach the files again when submitting your request, or email them or a download link to{' '}
                          <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="font-semibold text-forest underline"
                          >
                            {CONTACT_EMAIL}
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {items.map((item, index) => {
                  const displayedFileSize =
                    item.file?.size ?? item.fileSize ?? 0

                  const originalFileAvailable = Boolean(item.file)

                  return (
                    <ScrollReveal key={item.id}>
                      <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Package
                                size={18}
                                className="text-forest shrink-0"
                              />

                              <h3 className="font-semibold text-charcoal truncate">
                                {index + 1}. {item.fileName}
                              </h3>
                            </div>

                            <p className="text-xs text-gray-400">
                              {formatFileSize(displayedFileSize)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                            aria-label={`Remove ${item.fileName}`}
                            title="Remove item"
                          >
                            <Trash2
                              size={18}
                              className="text-red-500"
                            />
                          </button>
                        </div>

                        {!originalFileAvailable && (
                          <div className="mt-4 flex items-start gap-2 rounded-xl border border-gold/30 bg-gold/10 p-3">
                            <AlertCircle
                              size={16}
                              className="text-gold shrink-0 mt-0.5"
                            />

                            <p className="text-xs text-gray-600 leading-relaxed">
                              The quote settings are saved, but the original file is no longer loaded. Please attach it again or send it to{' '}
                              <a
                                href={`mailto:${CONTACT_EMAIL}`}
                                className="font-semibold text-forest underline"
                              >
                                {CONTACT_EMAIL}
                              </a>
                              .
                            </p>
                          </div>
                        )}

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
                          <div className="bg-cream rounded-xl p-3">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                              Material
                            </p>

                            <p className="text-sm font-semibold text-charcoal">
                              {item.material}
                            </p>
                          </div>

                          <div className="bg-cream rounded-xl p-3">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                              <Palette size={11} />
                              Colour
                            </p>

                            <p className="text-sm font-semibold text-charcoal capitalize">
                              {item.color}
                            </p>
                          </div>

                          <div className="bg-cream rounded-xl p-3">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                              Quantity
                            </p>

                            <p className="text-sm font-semibold text-charcoal">
                              {item.quantity}
                            </p>
                          </div>

                          <div className="bg-cream rounded-xl p-3">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                              Scale
                            </p>

                            <p className="text-sm font-semibold text-charcoal">
                              {item.scalePercent.toFixed(1)}%
                            </p>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 mt-3">
                          <div className="bg-cream rounded-xl p-3">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                              <Ruler size={11} />
                              Dimensions
                            </p>

                            <p className="text-sm font-semibold text-charcoal">
                              {item.dimensions
                                ? `${item.dimensions.x.toFixed(1)} × ${item.dimensions.y.toFixed(1)} × ${item.dimensions.z.toFixed(1)} mm`
                                : 'Not available'}
                            </p>
                          </div>

                          <div className="bg-cream rounded-xl p-3">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                              <Layers size={11} />
                              Volume
                            </p>

                            <p className="text-sm font-semibold text-charcoal">
                              {item.volume.toFixed(1)} cm³
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                          <div className="text-sm text-gray-500">
                            ${item.pricePerUnit.toFixed(2)} each
                          </div>

                          <div className="text-lg font-bold text-forest">
                            ${item.total.toFixed(2)} NZD
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  )
                })}
              </div>

              <div className="lg:sticky lg:top-24 lg:self-start">
                <ScrollReveal>
                  <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
                    <h2 className="text-lg font-semibold text-charcoal mb-5 flex items-center gap-2">
                      <ShoppingCart
                        size={20}
                        className="text-gold"
                      />
                      Cart Summary
                    </h2>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-gray-500">
                        <span>Models</span>
                        <span>{itemCount}</span>
                      </div>

                      <div className="flex justify-between text-gray-500">
                        <span>Total units</span>
                        <span>{unitCount}</span>
                      </div>

                      {missingFileCount > 0 && (
                        <div className="flex justify-between text-gold">
                          <span>Files to resend</span>
                          <span>{missingFileCount}</span>
                        </div>
                      )}

                      <hr className="border-gray-100" />

                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-charcoal">
                          Total estimate
                        </span>

                        <span className="text-2xl font-bold text-forest">
                          ${cartTotal.toFixed(2)}
                          <span className="text-sm font-normal text-gray-400">
                            {' '}
                            NZD
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <Link
                        to="/quote"
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-forest text-forest font-semibold rounded-lg hover:bg-forest hover:text-white transition-all"
                      >
                        <ArrowLeft size={16} />
                        Add another model
                      </Link>

                      <button
                        type="button"
                        onClick={() => navigate('/contact')}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gold text-forest-dark font-semibold rounded-lg hover:bg-gold-light transition-all"
                      >
                        Send quote request
                        <Send size={16} />
                      </button>

                      {missingFileCount > 0 && (
                        <a
                          href={`mailto:${CONTACT_EMAIL}`}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-gold/40 text-forest font-medium rounded-lg hover:bg-gold/10 transition-all"
                        >
                          <Mail size={16} />
                          Email model files
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={clearCart}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={15} />
                        Clear cart
                      </button>
                    </div>

                    <p className="mt-5 text-xs text-gray-400 leading-relaxed">
                      This is an estimate only. Final pricing may vary after printability review.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}