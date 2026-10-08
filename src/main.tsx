import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/b612/latin-400.css'
import '@fontsource/b612/latin-700.css'
import '@fontsource/b612-mono/latin-400.css'
import { App } from './App'
import './styles.css'

// Ask the browser not to evict our data under storage pressure (no-op where unsupported).
navigator.storage?.persist?.().catch(() => {})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
