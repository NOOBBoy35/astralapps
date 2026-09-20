import { useEffect, useState } from 'react'
import { IndustryProvider } from './context/IndustryContext'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { HomePage } from './components/pages/HomePage'
import { PricingPage } from './components/pages/PricingPage'
import { ContactPage } from './components/pages/ContactPage'
import { ROUTES, useLinkInterceptor, useRoute } from './lib/router'

export type ThemeMode = 'dark' | 'light'

/* Read the theme the pre-paint script in index.html already resolved (light default). */
function getInitialTheme(): ThemeMode {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function App() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme)
  const route = useRoute()
  useLinkInterceptor()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('astral-theme', theme)
    } catch {
      /* storage unavailable — non-fatal */
    }
  }, [theme])

  // Keep the browser tab title in step with the current page.
  useEffect(() => {
    const titles: Record<string, string> = {
      [ROUTES.pricing]: 'Pricing — AstralApps',
      [ROUTES.contact]: 'Contact — AstralApps',
    }
    document.title = titles[route] ?? 'AstralApps — AI automation studio'
  }, [route])

  return (
    <IndustryProvider>
      <div className="relative min-h-screen text-text">
        <Header theme={theme} onThemeChange={setTheme} route={route} />
        <main>
          {route === ROUTES.pricing ? (
            <PricingPage />
          ) : route === ROUTES.contact ? (
            <ContactPage />
          ) : (
            <HomePage />
          )}
        </main>
        <Footer />
      </div>
    </IndustryProvider>
  )
}

export default App
