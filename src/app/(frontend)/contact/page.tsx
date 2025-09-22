import type { Metadata } from 'next'
import React from 'react'
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle, Leaf, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-terra-display font-bold text-urban-black mb-4">
            Contactez-nous
          </h1>
          <p className="text-lg font-terra-body text-gray-600 max-w-2xl mx-auto">
            Une question, une suggestion, ou besoin d'aide ? Notre équipe TERRA est là pour vous
            accompagner.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <div className="bg-white">
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
              Envoyez-nous un message
            </h2>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block font-terra-display font-semibold text-urban-black mb-2"
                  >
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-terra-green/50 focus:border-terra-green font-terra-body"
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block font-terra-display font-semibold text-urban-black mb-2"
                  >
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-terra-green/50 focus:border-terra-green font-terra-body"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-terra-display font-semibold text-urban-black mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-terra-green/50 focus:border-terra-green font-terra-body"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block font-terra-display font-semibold text-urban-black mb-2"
                >
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-terra-green/50 focus:border-terra-green font-terra-body"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block font-terra-display font-semibold text-urban-black mb-2"
                >
                  Sujet *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-terra-green/50 focus:border-terra-green font-terra-body"
                >
                  <option value="">Choisissez un sujet</option>
                  <option value="commande">Question sur une commande</option>
                  <option value="produit">Information produit</option>
                  <option value="livraison">Livraison et retours</option>
                  <option value="taille">Aide au choix de taille</option>
                  <option value="technique">Problème technique</option>
                  <option value="partenariat">Partenariat / Presse</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="orderNumber"
                  className="block font-terra-display font-semibold text-urban-black mb-2"
                >
                  Numéro de commande (si applicable)
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  name="orderNumber"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-terra-green/50 focus:border-terra-green font-terra-body"
                  placeholder="TR-123456"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-terra-display font-semibold text-urban-black mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-terra-green/50 focus:border-terra-green font-terra-body resize-vertical"
                  placeholder="Décrivez votre demande en détail..."
                ></textarea>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                  className="mt-1 w-4 h-4 text-terra-green border-gray-300 rounded focus:ring-terra-green"
                />
                <label htmlFor="newsletter" className="font-terra-body text-gray-700 text-sm">
                  Je souhaite recevoir les actualités TERRA et bénéficier d'offres exclusives
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="privacy"
                  name="privacy"
                  required
                  className="mt-1 w-4 h-4 text-terra-green border-gray-300 rounded focus:ring-terra-green"
                />
                <label htmlFor="privacy" className="font-terra-body text-gray-700 text-sm">
                  J'accepte la{' '}
                  <a href="/privacy" className="text-terra-green hover:underline">
                    politique de confidentialité
                  </a>{' '}
                  et le traitement de mes données personnelles *
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold px-6 py-4 text-base group transition-colors"
              >
                Envoyer le message
                <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>

          {/* Informations de contact */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
                Autres moyens de nous contacter
              </h2>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-terra-display font-semibold text-urban-black mb-2">
                        Chat en direct
                      </h3>
                      <p className="font-terra-body text-gray-700 text-sm mb-3">
                        Discutez directement avec notre équipe customer care pour une réponse
                        immédiate.
                      </p>
                      <div className="flex items-center space-x-4 text-sm font-terra-body text-gray-600">
                        <span>Lun-Ven : 9h-18h</span>
                        <span>•</span>
                        <span>Sam : 10h-17h</span>
                      </div>
                      <button className="mt-3 bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
                        Démarrer le chat
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-terra-display font-semibold text-urban-black mb-2">
                        Téléphone
                      </h3>
                      <p className="font-terra-body text-gray-700 text-sm mb-3">
                        Appelez-nous pour une assistance personnalisée.
                      </p>
                      <div className="space-y-1">
                        <a
                          href="tel:+33142868788"
                          className="text-terra-green hover:underline font-terra-display font-semibold text-lg block"
                        >
                          +33 1 42 86 87 88
                        </a>
                        <p className="text-sm font-terra-body text-gray-600">
                          Lun-Ven : 9h-18h • Appel gratuit
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-terra-display font-semibold text-urban-black mb-2">
                        Email
                      </h3>
                      <p className="font-terra-body text-gray-700 text-sm mb-3">
                        Écrivez-nous, nous répondons sous 24h.
                      </p>
                      <a
                        href="mailto:hello@terra-sneakers.com"
                        className="text-terra-green hover:underline font-terra-display font-semibold block"
                      >
                        hello@terra-sneakers.com
                      </a>
                      <p className="text-sm font-terra-body text-gray-600 mt-1">
                        Réponse sous 24h • 7j/7
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Horaires */}
            <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-6">
              <h3 className="font-terra-display font-semibold text-urban-black mb-4 flex items-center">
                <Clock className="h-5 w-5 text-terra-green mr-2" />
                Horaires de notre service client
              </h3>
              <div className="space-y-2 text-sm font-terra-body text-gray-700">
                <div className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span className="font-semibold">9h00 - 18h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span className="font-semibold">10h00 - 17h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span className="text-gray-500">Fermé</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-3">
                  <span>Email</span>
                  <span className="font-semibold text-terra-green">24h/7j</span>
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-terra-display font-semibold text-urban-black mb-4 flex items-center">
                <MapPin className="h-5 w-5 text-terra-green mr-2" />
                Notre adresse
              </h3>
              <div className="space-y-2 font-terra-body text-gray-700">
                <p className="font-semibold">TERRA SNEAKERS</p>
                <p>15 rue de la Paix</p>
                <p>75001 Paris, France</p>
              </div>
              <p className="text-sm font-terra-body text-gray-600 mt-3">
                <strong>Note :</strong> Nous n'avons pas de boutique physique. Pour toute question,
                privilégiez nos canaux de contact en ligne.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ et ressources */}
        <div className="mt-20">
          <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-8 text-center">
            Besoin d'une réponse rapide ?
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <a
              href="/faq"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-terra-green hover:bg-terra-green/5 transition-colors group text-center"
            >
              <div className="w-12 h-12 bg-gray-100 group-hover:bg-terra-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-6 w-6 text-gray-600 group-hover:text-terra-green" />
              </div>
              <h3 className="font-terra-display font-semibold text-urban-black mb-2">FAQ</h3>
              <p className="font-terra-body text-gray-600 text-sm">
                Consultez notre foire aux questions pour trouver rapidement une réponse.
              </p>
            </a>

            <a
              href="/size-guide"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-terra-green hover:bg-terra-green/5 transition-colors group text-center"
            >
              <div className="w-12 h-12 bg-gray-100 group-hover:bg-terra-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-6 w-6 text-gray-600 group-hover:text-terra-green" />
              </div>
              <h3 className="font-terra-display font-semibold text-urban-black mb-2">
                Guide des tailles
              </h3>
              <p className="font-terra-body text-gray-600 text-sm">
                Trouvez votre taille parfaite avec notre guide détaillé.
              </p>
            </a>

            <a
              href="/shipping"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-terra-green hover:bg-terra-green/5 transition-colors group text-center"
            >
              <div className="w-12 h-12 bg-gray-100 group-hover:bg-terra-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-gray-600 group-hover:text-terra-green" />
              </div>
              <h3 className="font-terra-display font-semibold text-urban-black mb-2">
                Livraison & Retours
              </h3>
              <p className="font-terra-body text-gray-600 text-sm">
                Toutes les informations sur nos services de livraison.
              </p>
            </a>
          </div>

          {/* Contact specialises */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-xl font-terra-display font-bold text-urban-black mb-6 text-center">
              Contacts spécialisés
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                  Presse & Partenariats
                </h4>
                <p className="font-terra-body text-gray-700 text-sm mb-3">
                  Relations presse, collaborations, partenariats B2B
                </p>
                <a
                  href="mailto:press@terra-sneakers.com"
                  className="text-terra-green hover:underline font-terra-body font-semibold"
                >
                  press@terra-sneakers.com
                </a>
              </div>

              <div className="text-center">
                <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                  Données personnelles
                </h4>
                <p className="font-terra-body text-gray-700 text-sm mb-3">
                  RGPD, droits sur vos données, confidentialité
                </p>
                <a
                  href="mailto:privacy@terra-sneakers.com"
                  className="text-terra-green hover:underline font-terra-body font-semibold"
                >
                  privacy@terra-sneakers.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Contact | TERRA - Sneakers Écoresponsables',
    description:
      "Contactez l'équipe TERRA. Chat en direct, email, téléphone - nous sommes là pour répondre à toutes vos questions sur nos sneakers écoresponsables.",
    openGraph: {
      title: 'Contact | TERRA',
      description:
        "Une question, une suggestion, ou besoin d'aide ? Notre équipe TERRA est là pour vous accompagner.",
    },
  }
}
