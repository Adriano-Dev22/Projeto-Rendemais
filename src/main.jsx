import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import './index.css'
import App from './App.jsx'

const saved = localStorage.getItem('veskan-theme') || 'light'
document.documentElement.setAttribute('data-theme', saved)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)