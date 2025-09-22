'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Cookie, Settings, X, Check, Info } from 'lucide-react'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  personalization: boolean
}

export const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Toujours activé
    analytics: false,
    marketing: false,
    personalization: false,
  })

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait son choix
    const cookieConsent = localStorage.getItem('terra-cookie-consent')
    if (!cookieConsent) {
      // Attendre un peu avant d'afficher le banner pour une meilleure UX
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    }
    setPreferences(allAccepted)
    saveCookiePreferences(allAccepted)
    setShowBanner(false)
  }

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    }
    setPreferences(necessaryOnly)
    saveCookiePreferences(necessaryOnly)
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    saveCookiePreferences(preferences)
    setShowPreferences(false)
    setShowBanner(false)
  }

  const saveCookiePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(
      'terra-cookie-consent',
      JSON.stringify({
        preferences: prefs,
        timestamp: Date.now(),
      }),
    )

    // Ici on pourrait intégrer avec Google Analytics, etc.
    if (prefs.analytics) {
      // Activer Google Analytics
      console.log('Analytics cookies enabled')
    }
    if (prefs.marketing) {
      // Activer les cookies marketing
      console.log('Marketing cookies enabled')
    }
    if (prefs.personalization) {
      // Activer les cookies de personnalisation
      console.log('Personalization cookies enabled')
    }
  }

  const handlePreferenceChange = (type: keyof CookiePreferences) => {
    if (type === 'necessary') return // Les cookies nécessaires ne peuvent pas être désactivés

    setPreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  if (!showBanner) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />

      {/* Banner principal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {!showPreferences ? (
            /* Vue principale */
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center flex-shrink-0">
                  <Cookie className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-terra-display font-bold text-urban-black mb-2">
                    Respect de votre vie privée
                  </h3>
                  <p className="font-terra-body text-gray-700 text-sm leading-relaxed">
                    Chez TERRA, nous utilisons des cookies pour améliorer votre expérience, analyser
                    notre trafic et personnaliser le contenu. Vous gardez le contrôle total de vos
                    données.{' '}
                    <a href="/cookies" className="text-terra-green hover:underline font-semibold">
                      En savoir plus
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={() => setShowPreferences(true)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 font-terra-body font-medium"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Personnaliser
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAcceptNecessary}
                  className="border-terra-green text-terra-green hover:bg-terra-green hover:text-white font-terra-body font-medium"
                >
                  Nécessaires uniquement
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  className="bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Tout accepter
                </Button>
              </div>
            </div>
          ) : (
            /* Vue préférences détaillées */
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-terra-display font-bold text-urban-black">
                  Gérer mes préférences de cookies
                </h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Cookies nécessaires */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-terra-display font-semibold text-urban-black">
                          Cookies strictement nécessaires
                        </h4>
                        <p className="text-sm font-terra-body text-gray-600">
                          Indispensables au fonctionnement du site
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-terra-body font-semibold">
                      OBLIGATOIRE
                    </div>
                  </div>
                  <p className="text-sm font-terra-body text-gray-700 ml-11">
                    Ces cookies permettent les fonctionnalités de base : panier, connexion,
                    sécurité. Ils ne peuvent pas être désactivés.
                  </p>
                </div>

                {/* Cookies d'analyse */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Info className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-terra-display font-semibold text-urban-black">
                          Cookies d'analyse
                        </h4>
                        <p className="text-sm font-terra-body text-gray-600">
                          Nous aident à améliorer le site
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => handlePreferenceChange('analytics')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-terra-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terra-green"></div>
                    </label>
                  </div>
                  <p className="text-sm font-terra-body text-gray-700 ml-11">
                    Google Analytics (anonymisé), statistiques de visite, amélioration de
                    l'expérience utilisateur.
                  </p>
                </div>

                {/* Cookies de personnalisation */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Settings className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-terra-display font-semibold text-urban-black">
                          Cookies de personnalisation
                        </h4>
                        <p className="text-sm font-terra-body text-gray-600">
                          Personnalisent votre expérience
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.personalization}
                        onChange={() => handlePreferenceChange('personalization')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-terra-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terra-green"></div>
                    </label>
                  </div>
                  <p className="text-sm font-terra-body text-gray-700 ml-11">
                    Préférences de taille, historique de navigation, recommandations personnalisées.
                  </p>
                </div>

                {/* Cookies marketing */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <Info className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-terra-display font-semibold text-urban-black">
                          Cookies marketing
                        </h4>
                        <p className="text-sm font-terra-body text-gray-600">
                          Publicités pertinentes sur d'autres sites
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => handlePreferenceChange('marketing')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-terra-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terra-green"></div>
                    </label>
                  </div>
                  <p className="text-sm font-terra-body text-gray-700 ml-11">
                    Facebook Pixel, Google Ads, retargeting pour des publicités plus pertinentes.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setShowPreferences(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 font-terra-body font-medium"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSavePreferences}
                  className="bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold flex-1 sm:flex-none"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Sauvegarder mes préférences
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
