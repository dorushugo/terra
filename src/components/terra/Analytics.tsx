'use client'

import { useEffect } from 'react'
import { useCookieConsent } from '@/hooks/useCookieConsent'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export const Analytics: React.FC = () => {
  const { canUseAnalytics, hasConsent } = useCookieConsent()

  useEffect(() => {
    if (!hasConsent) return

    if (canUseAnalytics()) {
      // Charger Google Analytics seulement si l'utilisateur a donné son consentement
      const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID

      if (GA_MEASUREMENT_ID) {
        // Charger le script Google Analytics
        const script = document.createElement('script')
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
        script.async = true
        document.head.appendChild(script)

        // Initialiser Google Analytics
        window.dataLayer = window.dataLayer || []
        window.gtag = function gtag() {
          window.dataLayer.push(arguments)
        }
        window.gtag('js', new Date())
        window.gtag('config', GA_MEASUREMENT_ID, {
          anonymize_ip: true, // Anonymiser les IP pour la conformité RGPD
          cookie_flags: 'SameSite=None;Secure',
        })

        console.log('Google Analytics initialized with consent')
      }
    } else {
      // Désactiver Google Analytics si le consentement est retiré
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
        })
        console.log('Google Analytics disabled - no consent')
      }
    }
  }, [canUseAnalytics, hasConsent])

  // Ce composant ne rend rien visuellement
  return null
}

// Hook utilitaire pour tracker des événements
export function useAnalytics() {
  const { canUseAnalytics } = useCookieConsent()

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (canUseAnalytics() && typeof window.gtag === 'function') {
      window.gtag('event', eventName, parameters)
    }
  }

  const trackPageView = (url: string) => {
    if (canUseAnalytics() && typeof window.gtag === 'function') {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      })
    }
  }

  return {
    trackEvent,
    trackPageView,
    canTrack: canUseAnalytics(),
  }
}
