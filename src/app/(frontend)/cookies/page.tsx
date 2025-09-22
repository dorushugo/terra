import type { Metadata } from 'next'
import React from 'react'
import { Cookie, Settings, BarChart3, Target, Shield, CheckCircle } from 'lucide-react'
import { CookieSettingsButton } from '@/components/terra/CookieSettingsButton'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center">
              <Cookie className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-terra-display font-bold text-urban-black mb-4">
            Politique des Cookies
          </h1>
          <p className="text-lg font-terra-body text-gray-600 max-w-2xl mx-auto">
            Découvrez comment TERRA utilise les cookies pour améliorer votre expérience de
            navigation et respecter vos choix.
          </p>
        </div>

        {/* Résumé */}
        <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-8 mb-12">
          <h2 className="text-xl font-terra-display font-bold text-urban-black mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-terra-green mr-2" />
            L'essentiel sur nos cookies
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm font-terra-body text-gray-700">
            <div>
              <p className="mb-2">• Cookies essentiels uniquement par défaut</p>
              <p className="mb-2">• Votre consentement pour les cookies optionnels</p>
              <p>• Gestion facile de vos préférences</p>
            </div>
            <div>
              <p className="mb-2">• Pas de vente de données à des tiers</p>
              <p className="mb-2">• Respect total de votre vie privée</p>
              <p>• Transparence complète sur leur utilisation</p>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
              Qu'est-ce qu'un cookie ?
            </h2>

            <p className="font-terra-body text-gray-700 mb-6">
              Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur,
              smartphone, tablette) lorsque vous visitez un site web. Il permet au site de "se
              souvenir" de vos actions et préférences pendant une période donnée.
            </p>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                Pourquoi utilisons-nous des cookies ?
              </h3>
              <ul className="font-terra-body text-gray-700 space-y-2">
                <li>
                  • <strong>Fonctionnement du site</strong> : Maintenir votre panier, votre session
                  de connexion
                </li>
                <li>
                  • <strong>Amélioration de l'expérience</strong> : Se souvenir de vos préférences
                  (taille, couleur)
                </li>
                <li>
                  • <strong>Analyse de performance</strong> : Comprendre comment améliorer notre
                  site
                </li>
                <li>
                  • <strong>Personnalisation</strong> : Vous proposer du contenu adapté à vos
                  intérêts
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
              Types de cookies utilisés
            </h2>

            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-green-600 mr-3" />
                  <h3 className="font-terra-display font-semibold text-urban-black">
                    Cookies strictement nécessaires
                  </h3>
                  <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    OBLIGATOIRES
                  </span>
                </div>
                <p className="font-terra-body text-gray-700 mb-4">
                  Ces cookies sont indispensables au fonctionnement du site. Ils ne peuvent pas être
                  désactivés.
                </p>
                <div className="space-y-2 text-sm font-terra-body text-gray-600">
                  <p>
                    • <strong>Session utilisateur</strong> : Maintien de votre connexion
                  </p>
                  <p>
                    • <strong>Panier d'achat</strong> : Conservation de vos articles sélectionnés
                  </p>
                  <p>
                    • <strong>Sécurité</strong> : Protection contre les attaques CSRF
                  </p>
                  <p>
                    • <strong>Préférences de cookies</strong> : Mémorisation de vos choix
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="font-terra-display font-semibold text-urban-black">
                    Cookies d'analyse et de performance
                  </h3>
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    OPTIONNELS
                  </span>
                </div>
                <p className="font-terra-body text-gray-700 mb-4">
                  Ces cookies nous aident à comprendre comment vous utilisez notre site pour
                  l'améliorer.
                </p>
                <div className="space-y-2 text-sm font-terra-body text-gray-600">
                  <p>
                    • <strong>Google Analytics</strong> : Statistiques de visite anonymisées
                  </p>
                  <p>
                    • <strong>Hotjar</strong> : Analyse du comportement utilisateur (avec
                    anonymisation)
                  </p>
                  <p>
                    • <strong>Performance du site</strong> : Temps de chargement, erreurs techniques
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Target className="h-6 w-6 text-purple-600 mr-3" />
                  <h3 className="font-terra-display font-semibold text-urban-black">
                    Cookies de personnalisation
                  </h3>
                  <span className="ml-auto bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    OPTIONNELS
                  </span>
                </div>
                <p className="font-terra-body text-gray-700 mb-4">
                  Ces cookies personnalisent votre expérience en fonction de vos préférences.
                </p>
                <div className="space-y-2 text-sm font-terra-body text-gray-600">
                  <p>
                    • <strong>Préférences produits</strong> : Tailles, couleurs favorites
                  </p>
                  <p>
                    • <strong>Historique de navigation</strong> : Produits récemment consultés
                  </p>
                  <p>
                    • <strong>Recommandations</strong> : Suggestions basées sur vos goûts
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Target className="h-6 w-6 text-orange-600 mr-3" />
                  <h3 className="font-terra-display font-semibold text-urban-black">
                    Cookies marketing et publicitaires
                  </h3>
                  <span className="ml-auto bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                    OPTIONNELS
                  </span>
                </div>
                <p className="font-terra-body text-gray-700 mb-4">
                  Ces cookies permettent de vous proposer des publicités pertinentes sur d'autres
                  sites.
                </p>
                <div className="space-y-2 text-sm font-terra-body text-gray-600">
                  <p>
                    • <strong>Facebook Pixel</strong> : Publicités ciblées sur Facebook/Instagram
                  </p>
                  <p>
                    • <strong>Google Ads</strong> : Retargeting et mesure de performance
                  </p>
                  <p>
                    • <strong>Criteo</strong> : Recommandations produits personnalisées
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
              Cookies de tiers
            </h2>

            <p className="font-terra-body text-gray-700 mb-6">
              Certains cookies sont déposés par des services tiers que nous utilisons pour améliorer
              votre expérience :
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-gray-600">GA</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                    Google Analytics
                  </h4>
                  <p className="font-terra-body text-gray-600 text-sm mb-2">
                    Analyse d'audience anonymisée pour améliorer notre site
                  </p>
                  <p className="text-xs text-gray-500">
                    Durée : 2 ans •
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terra-green hover:underline ml-1"
                    >
                      Politique de confidentialité Google
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-gray-600">HJ</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">Hotjar</h4>
                  <p className="font-terra-body text-gray-600 text-sm mb-2">
                    Analyse du comportement utilisateur pour optimiser l'UX
                  </p>
                  <p className="text-xs text-gray-500">
                    Durée : 1 an •
                    <a
                      href="https://www.hotjar.com/legal/policies/privacy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terra-green hover:underline ml-1"
                    >
                      Politique de confidentialité Hotjar
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-gray-600">ST</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">Stripe</h4>
                  <p className="font-terra-body text-gray-600 text-sm mb-2">
                    Traitement sécurisé des paiements
                  </p>
                  <p className="text-xs text-gray-500">
                    Durée : Session •
                    <a
                      href="https://stripe.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terra-green hover:underline ml-1"
                    >
                      Politique de confidentialité Stripe
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6 flex items-center">
              <Settings className="h-6 w-6 text-terra-green mr-3" />
              Gérer vos préférences de cookies
            </h2>

            <div className="space-y-6">
              <div className="bg-terra-green/5 rounded-lg p-6">
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  Centre de préférences TERRA
                </h3>
                <p className="font-terra-body text-gray-700 mb-4">
                  Vous pouvez modifier vos préférences de cookies à tout moment en cliquant sur le
                  bouton ci-dessous :
                </p>
                <CookieSettingsButton />
              </div>

              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  Paramètres de votre navigateur
                </h3>
                <p className="font-terra-body text-gray-700 mb-4">
                  Vous pouvez également gérer les cookies directement dans votre navigateur :
                </p>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="font-terra-body text-gray-700">
                      <strong>Chrome :</strong>
                      <a
                        href="https://support.google.com/chrome/answer/95647"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-terra-green hover:underline ml-1"
                      >
                        Guide cookies Chrome
                      </a>
                    </p>
                    <p className="font-terra-body text-gray-700">
                      <strong>Firefox :</strong>
                      <a
                        href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies-preferences"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-terra-green hover:underline ml-1"
                      >
                        Guide cookies Firefox
                      </a>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-terra-body text-gray-700">
                      <strong>Safari :</strong>
                      <a
                        href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-terra-green hover:underline ml-1"
                      >
                        Guide cookies Safari
                      </a>
                    </p>
                    <p className="font-terra-body text-gray-700">
                      <strong>Edge :</strong>
                      <a
                        href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-terra-green hover:underline ml-1"
                      >
                        Guide cookies Edge
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                  ⚠️ Important à savoir
                </h4>
                <p className="font-terra-body text-gray-700 text-sm">
                  Si vous désactivez tous les cookies, certaines fonctionnalités du site pourraient
                  ne plus fonctionner correctement (panier, connexion, préférences). Les cookies
                  strictement nécessaires ne peuvent pas être désactivés.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
              Durée de conservation
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-terra-body text-gray-700">Cookies de session</span>
                <span className="font-terra-display font-semibold text-terra-green">
                  Fin de session
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-terra-body text-gray-700">Cookies de préférences</span>
                <span className="font-terra-display font-semibold text-terra-green">1 an</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-terra-body text-gray-700">Cookies d'analyse</span>
                <span className="font-terra-display font-semibold text-terra-green">2 ans</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-terra-body text-gray-700">Cookies publicitaires</span>
                <span className="font-terra-display font-semibold text-terra-green">13 mois</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
              Contact et questions
            </h2>

            <div className="bg-gray-50 rounded-lg p-6">
              <p className="font-terra-body text-gray-700 mb-4">
                Si vous avez des questions concernant notre utilisation des cookies ou souhaitez
                exercer vos droits, contactez-nous :
              </p>

              <div className="space-y-2 text-sm font-terra-body text-gray-700">
                <p>
                  <strong>Email :</strong> privacy@terra-sneakers.com
                </p>
                <p>
                  <strong>Téléphone :</strong> +33 1 42 86 87 88
                </p>
                <p>
                  <strong>Courrier :</strong> TERRA SNEAKERS - DPO, 15 rue de la Paix, 75001 Paris
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="font-terra-body text-gray-500 text-sm">
            Dernière mise à jour : Décembre 2024
          </p>
          <p className="font-terra-body text-gray-500 text-sm mt-2">
            Cette politique peut être mise à jour pour refléter les évolutions de nos pratiques ou
            de la réglementation.
          </p>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Politique des Cookies | TERRA - Sneakers Écoresponsables',
    description:
      'Découvrez comment TERRA utilise les cookies pour améliorer votre expérience. Gestion transparente de vos préférences de confidentialité.',
    openGraph: {
      title: 'Politique des Cookies | TERRA',
      description:
        'Découvrez comment TERRA utilise les cookies pour améliorer votre expérience de navigation et respecter vos choix.',
    },
  }
}
