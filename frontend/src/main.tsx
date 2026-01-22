// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from './providers/AppProviders'  // ✅ Import AppProviders
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
  </StrictMode>,
)
