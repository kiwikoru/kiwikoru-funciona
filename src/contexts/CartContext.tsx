import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { PrintColor } from './QuoteContext'

export type CartItem = {
  id: string
  file: File
  fileName: string
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

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  clearCart: () => void
  cartTotal: number
  itemCount: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (item: Omit<CartItem, 'id'>) => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`

    setItems((current) => [
      ...current,
      {
        ...item,
        id,
      },
    ])
  }

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setItems([])
  }

  const cartTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }, [items])

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
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
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return context
}