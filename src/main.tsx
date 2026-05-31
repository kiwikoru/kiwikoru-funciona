import ScrollToTop from './components/ScrollToTop'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { TRPCProvider } from '@/providers/trpc'
import './index.css'
import App from './App'
import ScrollToTop from './components/ScrollToTop'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <TRPCProvider>
<HashRouter>
  <ScrollToTop />
  <App />
</HashRouter>
      </TRPCProvider>
    </HelmetProvider>
  </StrictMode>,
)
