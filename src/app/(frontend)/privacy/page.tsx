import type { Metadata } from 'next'
import React from 'react'
import { Shield, Eye, Lock, UserCheck, Mail, Phone } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-terra-display font-bold text-urban-black mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-lg font-terra-body text-gray-600 max-w-2xl mx-auto">
            Votre vie privée est importante. Découvrez comment TERRA protège et utilise vos données
            personnelles.
          </p>
        </div>

        {/* Résumé */}
        <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-8 mb-12">
          <h2 className="text-xl font-terra-display font-bold text-urban-black mb-4 flex items-center">
            <Lock className="h-5 w-5 text-terra-green mr-2" />
            En résumé
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm font-terra-body text-gray-700">
            <div>
              <p className="mb-2">• Nous collectons uniquement les données nécessaires</p>
              <p className="mb-2">• Vos données ne sont jamais vendues à des tiers</p>
              <p>• Vous gardez le contrôle total de vos informations</p>
            </div>
            <div>
              <p className="mb-2">• Chiffrement et sécurité maximale</p>
              <p className="mb-2">• Conformité RGPD stricte</p>
              <p>• Transparence totale sur nos pratiques</p>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6 flex items-center">
              <Eye className="h-6 w-6 text-terra-green mr-3" />
              Quelles données collectons-nous ?
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  Données de compte et profil
                </h3>
                <ul className="font-terra-body text-gray-700 space-y-2">
                  <li>• Nom, prénom, adresse email</li>
                  <li>• Adresses de livraison et de facturation</li>
                  <li>• Numéro de téléphone (optionnel)</li>
                  <li>• Date de naissance (pour les offres personnalisées)</li>
                  <li>• Préférences de taille et style</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  Données de commande
                </h3>
                <ul className="font-terra-body text-gray-700 space-y-2">
                  <li>• Historique des achats et montants</li>
                  <li>• Méthodes de paiement (tokenisées, sécurisées)</li>
                  <li>• Statut de livraison et retours</li>
                  <li>• Communications liées aux commandes</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  Données de navigation
                </h3>
                <ul className="font-terra-body text-gray-700 space-y-2">
                  <li>• Pages visitées et temps passé</li>
                  <li>• Produits consultés et ajoutés au panier</li>
                  <li>• Adresse IP et informations techniques</li>
                  <li>• Cookies et identifiants de session</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
              Comment utilisons-nous vos données ?
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4 text-terra-green">
                  Services essentiels
                </h3>
                <ul className="font-terra-body text-gray-700 space-y-2">
                  <li>• Traitement et suivi des commandes</li>
                  <li>• Gestion de votre compte client</li>
                  <li>• Service client et support technique</li>
                  <li>• Prévention de la fraude</li>
                </ul>
              </div>

              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4 text-terra-green">
                  Amélioration de l'expérience
                </h3>
                <ul className="font-terra-body text-gray-700 space-y-2">
                  <li>• Recommandations personnalisées</li>
                  <li>• Optimisation du site web</li>
                  <li>• Analyses et statistiques anonymisées</li>
                  <li>• Communications marketing (avec consentement)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
              Partage des données
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <p className="font-terra-body text-red-800 font-semibold">
                🚫 TERRA ne vend jamais vos données personnelles à des tiers.
              </p>
            </div>

            <p className="font-terra-body text-gray-700 mb-6">
              Nous partageons vos données uniquement dans les cas suivants :
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-terra-green rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                    Prestataires de services
                  </h4>
                  <p className="font-terra-body text-gray-700 text-sm">
                    Transporteurs, processeurs de paiement, hébergeurs - tous sous contrat strict de
                    confidentialité
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-terra-green rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                    Obligations légales
                  </h4>
                  <p className="font-terra-body text-gray-700 text-sm">
                    Uniquement si requis par la loi ou une décision de justice
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-terra-green rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                    Avec votre consentement
                  </h4>
                  <p className="font-terra-body text-gray-700 text-sm">
                    Pour des partenariats ou services spécifiques que vous approuvez explicitement
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6 flex items-center">
              <UserCheck className="h-6 w-6 text-terra-green mr-3" />
              Vos droits RGPD
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-terra-green/5 rounded-lg p-4">
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                    Droit d'accès
                  </h4>
                  <p className="font-terra-body text-gray-700 text-sm">
                    Consultez toutes les données que nous avons sur vous
                  </p>
                </div>

                <div className="bg-terra-green/5 rounded-lg p-4">
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                    Droit de rectification
                  </h4>
                  <p className="font-terra-body text-gray-700 text-sm">
                    Corrigez ou mettez à jour vos informations
                  </p>
                </div>

                <div className="bg-terra-green/5 rounded-lg p-4">
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                    Droit à l'effacement
                  </h4>
                  <p className="font-terra-body text-gray-700 text-sm">
                    Supprimez vos données (droit à l'oubli)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-terra-green/5 rounded-lg p-4">
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                    Droit d'opposition
                  </h4>
                  <p className="font-terra-body text-gray-700 text-sm">
                    Refusez certains traitements de vos données
                  </p>
                </div>

                <div className="bg-terra-green/5 rounded-lg p-4">
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                    Droit à la portabilité
                  </h4>
                  <p className="font-terra-body text-gray-700 text-sm">
                    Récupérez vos données dans un format standard
                  </p>
                </div>

                <div className="bg-terra-green/5 rounded-lg p-4">
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                    Droit de limitation
                  </h4>
                  <p className="font-terra-body text-gray-700 text-sm">
                    Limitez l'utilisation de vos données
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
              Sécurité des données
            </h2>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                    Chiffrement SSL/TLS
                  </h4>
                  <p className="font-terra-body text-gray-600 text-sm">
                    Toutes les communications sont chiffrées
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                    Serveurs sécurisés
                  </h4>
                  <p className="font-terra-body text-gray-600 text-sm">
                    Infrastructure européenne certifiée
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                    Accès contrôlé
                  </h4>
                  <p className="font-terra-body text-gray-600 text-sm">
                    Personnel autorisé uniquement
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
              Conservation des données
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-terra-body text-gray-700">Données de compte actif</span>
                <span className="font-terra-display font-semibold text-terra-green">
                  Tant que le compte existe
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-terra-body text-gray-700">Historique des commandes</span>
                <span className="font-terra-display font-semibold text-terra-green">
                  10 ans (obligation légale)
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-terra-body text-gray-700">Données de navigation</span>
                <span className="font-terra-display font-semibold text-terra-green">
                  13 mois maximum
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-terra-body text-gray-700">Compte supprimé</span>
                <span className="font-terra-display font-semibold text-terra-green">
                  30 jours puis suppression
                </span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
              Cookies et technologies similaires
            </h2>

            <p className="font-terra-body text-gray-700 mb-6">
              Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez les paramétrer
              à tout moment.
            </p>

            <div className="bg-terra-green/5 rounded-lg p-6">
              <p className="font-terra-body text-gray-700">
                Pour plus de détails sur notre utilisation des cookies, consultez notre
                <a href="/cookies" className="text-terra-green hover:underline font-semibold ml-1">
                  Politique des Cookies
                </a>
                .
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
              Contact et exercice de vos droits
            </h2>

            <div className="bg-gray-50 rounded-lg p-8">
              <p className="font-terra-body text-gray-700 mb-6">
                Pour toute question sur cette politique ou pour exercer vos droits, contactez notre
                Délégué à la Protection des Données :
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-terra-green flex-shrink-0" />
                  <span className="font-terra-body text-gray-700">
                    <strong>Email :</strong> privacy@terra-sneakers.com
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-terra-green flex-shrink-0" />
                  <span className="font-terra-body text-gray-700">
                    <strong>Téléphone :</strong> +33 1 42 86 87 88
                  </span>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-terra-green flex-shrink-0 mt-1" />
                  <div className="font-terra-body text-gray-700">
                    <strong>Courrier :</strong>
                    <br />
                    TERRA SNEAKERS - DPO
                    <br />
                    15 rue de la Paix
                    <br />
                    75001 Paris, France
                  </div>
                </div>
              </div>

              <p className="font-terra-body text-gray-700 text-sm mt-6">
                Nous nous engageons à répondre à vos demandes dans un délai maximum de 30 jours.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="font-terra-body text-gray-500 text-sm">
            Dernière mise à jour : Décembre 2024
          </p>
          <p className="font-terra-body text-gray-500 text-sm mt-2">
            Cette politique peut être mise à jour. Nous vous informerons de tout changement
            important.
          </p>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Politique de Confidentialité | TERRA - Sneakers Écoresponsables',
    description:
      'Découvrez comment TERRA protège vos données personnelles. Politique de confidentialité transparente et conforme RGPD.',
    openGraph: {
      title: 'Politique de Confidentialité | TERRA',
      description:
        'Votre vie privée est importante. Découvrez comment TERRA protège et utilise vos données personnelles.',
    },
  }
}
