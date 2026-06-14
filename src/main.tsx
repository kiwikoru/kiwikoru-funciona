import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QuoteProvider } from './contexts/QuoteContext'
import { TRPCProvider } from '@/providers/trpc'
import { CartProvider } from './contexts/CartContext'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <TRPCProvider>
        <QuoteProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </QuoteProvider>
      </TRPCProvider>
    </HashRouter>
  </StrictMode>,
)