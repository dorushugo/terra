'use client'

import { useState, useEffect } from 'react'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  personalization: boolean
}

interface CookieConsent {
  preferences: CookiePreferences
  timestamp: number
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null)
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    const savedConsent = localStorage.getItem('terra-cookie-consent')
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent) as CookieConsent
        setConsent(parsed)
        setHasConsent(true)
      } catch (error) {
        console.error('Error parsing cookie consent:', error)
        localStorage.removeItem('terra-cookie-consent')
      }
    }
  }, [])

  const updateConsent = (preferences: CookiePreferences) => {
    const newConsent = {
      preferences,
      timestamp: Date.now(),
    }
    localStorage.setItem('terra-cookie-consent', JSON.stringify(newConsent))
    setConsent(newConsent)
    setHasConsent(true)
  }

  const clearConsent = () => {
    localStorage.removeItem('terra-cookie-consent')
    setConsent(null)
    setHasConsent(false)
  }

  const canUseAnalytics = () => {
    return consent?.preferences.analytics || false
  }

  const canUseMarketing = () => {
    return consent?.preferences.marketing || false
  }

  const canUsePersonalization = () => {
    return consent?.preferences.personalization || false
  }

  return {
    consent,
    hasConsent,
    updateConsent,
    clearConsent,
    canUseAnalytics,
    canUseMarketing,
    canUsePersonalization,
  }
}
