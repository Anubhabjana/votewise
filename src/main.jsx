import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { DemoProvider } from './contexts/DemoContext.jsx'
import { FirstTimerProvider } from './contexts/FirstTimerContext.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import { AccessibilityProvider } from './contexts/AccessibilityContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AccessibilityProvider>
        <DemoProvider>
          <LanguageProvider>
            <FirstTimerProvider>
              <App />
            </FirstTimerProvider>
          </LanguageProvider>
        </DemoProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  </StrictMode>,
)
