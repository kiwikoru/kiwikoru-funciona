import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QuoteProvider } from './contexts/QuoteContext'
import { TRPCProvider } from '@/providers/trpc'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <TRPCProvider>
        <QuoteProvider>
          <App />
        </QuoteProvider>
      </TRPCProvider>
    </HashRouter>
  </StrictMode>,
)
