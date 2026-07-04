import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { PrintColor } from './QuoteContext'

const CART_STORAGE_KEY = 'kiwikoru_cart'

export type CartItem = {
  id: string

  /*
   * El archivo real solo existe mientras la página permanece abierta.
   * Los objetos File no pueden guardarse correctamente en localStorage.
   */
  file?: File
  fileSize: number
  fileName: string

  /*
   * Miniatura PNG/JPEG del modelo.
   * Se guarda como data URL para poder persistirla en localStorage
   * y mostrarla nuevamente en el carrito.
   */
  thumbnailDataUrl?: string

  volume: number
  dimensions?: {
    x: number
    y: number
    z: number
  }

  material: string
  quantity: number
  color: PrintColor
  scalePercent: number
  infill: number
  walls: number
  topLayers: number
  bottomLayers: number
  layerHeight: number
  support: string
  finish: string
  pricePerUnit: number
  total: number
}

type NewCartItem = Omit<CartItem, 'id' | 'fileSize'> & {
  fileSize?: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: NewCartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  cartTotal: number
  itemCount: number
  unitCount: number
}

const CartContext = createContext<CartContextValue | null>(null)

function loadStoredCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const savedCart = window.localStorage.getItem(CART_STORAGE_KEY)

    if (!savedCart) {
      return []
    }

    const parsed = JSON.parse(savedCart)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.map((item) => ({
      ...item,

      /*
       * El File original no puede recuperarse desde localStorage.
       * El resto de la información del modelo, incluida la miniatura,
       * sí permanece guardada.
       */
      file: undefined,
      fileSize:
        typeof item.fileSize === 'number'
          ? item.fileSize
          : 0,
      thumbnailDataUrl:
        typeof item.thumbnailDataUrl === 'string'
          ? item.thumbnailDataUrl
          : undefined,
    }))
  } catch (error) {
    console.error('[CART] Could not load saved cart', error)
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadStoredCart)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const persistentItems = items.map(({ file, ...item }) => ({
        ...item,
        fileSize: item.fileSize || file?.size || 0,
      }))

      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(persistentItems)
      )
    } catch (error) {
      console.error('[CART] Could not save cart', error)
    }
  }, [items])

  const addItem = (item: NewCartItem) => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`

    const newItem: CartItem = {
      ...item,
      id,
      fileSize: item.fileSize ?? item.file?.size ?? 0,
      thumbnailDataUrl:
        typeof item.thumbnailDataUrl === 'string'
          ? item.thumbnailDataUrl
          : undefined,
    }

    setItems((current) => [...current, newItem])
  }

  const removeItem = (id: string) => {
    setItems((current) =>
      current.filter((item) => item.id !== id)
    )
  }

  const clearCart = () => {
    setItems([])

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(CART_STORAGE_KEY)
    }
  }

  const cartTotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.total,
      0
    )
  }, [items])

  const itemCount = useMemo(() => {
    return items.length
  }, [items])

  const unitCount = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.quantity,
      0
    )
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        cartTotal,
        itemCount,
        unitCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider'
    )
  }

  return context
}
