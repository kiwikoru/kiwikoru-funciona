import { createContext, useContext, useState, type ReactNode } from 'react'

export type PrintColor = 'black' | 'white' | 'red' | 'blue' | 'yellow' | 'other'

export interface QuoteConfig {
  fileName: string
  volume: number
  material: string
  quantity: number
  color: PrintColor
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

interface QuoteContextType {
  file: File | null
  setFile: (f: File | null) => void
  config: QuoteConfig | null
  setConfig: (c: QuoteConfig | null) => void
}

const QuoteContext = createContext<QuoteContextType>({
  file: null,
  setFile: () => {},
  config: null,
  setConfig: () => {},
})

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null)
  const [config, setConfig] = useState<QuoteConfig | null>(null)

  return (
    <QuoteContext.Provider value={{ file, setFile, config, setConfig }}>
      {children}
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  return useContext(QuoteContext)
}
