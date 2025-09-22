import type { Metadata } from 'next'
import React from 'react'
import { Truck, RotateCcw, Clock, MapPin, Package, Shield, Euro, Leaf } from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center">
              <Truck className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-terra-display font-bold text-urban-black mb-4">
            Livraison & Retours
          </h1>
          <p className="text-lg font-terra-body text-gray-600 max-w-2xl mx-auto">
            Livraison rapide, retours gratuits pendant 30 jours. Chez TERRA, votre satisfaction est
            notre priorité.
          </p>
        </div>

        {/* Avantages en bref */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-terra-display font-bold text-urban-black mb-2">
              Livraison gratuite dès 100€
            </h3>
            <p className="font-terra-body text-gray-600 text-sm">
              En France métropolitaine, profitez de la livraison offerte sur toutes vos commandes.
            </p>
          </div>

          <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-terra-display font-bold text-urban-black mb-2">
              Retours gratuits 30 jours
            </h3>
            <p className="font-terra-body text-gray-600 text-sm">
              Changé d'avis ? Pas de problème, nous vous offrons 30 jours pour retourner vos
              sneakers.
            </p>
          </div>

          <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-terra-display font-bold text-urban-black mb-2">
              Emballage écoresponsable
            </h3>
            <p className="font-terra-body text-gray-600 text-sm">
              Cartons recyclés, encres végétales, et zéro plastique pour respecter nos valeurs.
            </p>
          </div>
        </div>

        {/* Section Livraison */}
        <section className="mb-16">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 flex items-center">
            <Truck className="h-7 w-7 text-terra-green mr-3" />
            Livraison
          </h2>

          <div className="space-y-8">
            {/* Zones et délais */}
            <div>
              <h3 className="text-xl font-terra-display font-semibold text-urban-black mb-6">
                Zones de livraison et délais
              </h3>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left font-terra-display font-semibold text-urban-black">
                          Destination
                        </th>
                        <th className="px-6 py-4 text-left font-terra-display font-semibold text-urban-black">
                          Délai
                        </th>
                        <th className="px-6 py-4 text-left font-terra-display font-semibold text-urban-black">
                          Prix
                        </th>
                        <th className="px-6 py-4 text-left font-terra-display font-semibold text-urban-black">
                          Gratuit dès
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="px-6 py-4 font-terra-body text-gray-900">
                          France métropolitaine
                        </td>
                        <td className="px-6 py-4 font-terra-body text-gray-700">
                          2-3 jours ouvrés
                        </td>
                        <td className="px-6 py-4 font-terra-body text-gray-700">4,90€</td>
                        <td className="px-6 py-4 font-terra-body text-terra-green font-semibold">
                          100€
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-6 py-4 font-terra-body text-gray-900">
                          France express 24h
                        </td>
                        <td className="px-6 py-4 font-terra-body text-gray-700">1 jour ouvré</td>
                        <td className="px-6 py-4 font-terra-body text-gray-700">9,90€</td>
                        <td className="px-6 py-4 font-terra-body text-terra-green font-semibold">
                          150€
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-6 py-4 font-terra-body text-gray-900">Corse</td>
                        <td className="px-6 py-4 font-terra-body text-gray-700">
                          3-4 jours ouvrés
                        </td>
                        <td className="px-6 py-4 font-terra-body text-gray-700">7,90€</td>
                        <td className="px-6 py-4 font-terra-body text-terra-green font-semibold">
                          100€
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-6 py-4 font-terra-body text-gray-900">
                          Union Européenne
                        </td>
                        <td className="px-6 py-4 font-terra-body text-gray-700">
                          3-5 jours ouvrés
                        </td>
                        <td className="px-6 py-4 font-terra-body text-gray-700">12,90€</td>
                        <td className="px-6 py-4 font-terra-body text-terra-green font-semibold">
                          150€
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-terra-body text-gray-900">
                          Suisse, Royaume-Uni
                        </td>
                        <td className="px-6 py-4 font-terra-body text-gray-700">
                          4-6 jours ouvrés
                        </td>
                        <td className="px-6 py-4 font-terra-body text-gray-700">19,90€</td>
                        <td className="px-6 py-4 font-terra-body text-gray-700">—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modes de livraison */}
            <div>
              <h3 className="text-xl font-terra-display font-semibold text-urban-black mb-6">
                Modes de livraison disponibles
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Package className="h-6 w-6 text-terra-green mr-3" />
                    <h4 className="font-terra-display font-semibold text-urban-black">
                      Livraison à domicile
                    </h4>
                  </div>
                  <p className="font-terra-body text-gray-700 mb-4 text-sm">
                    Livraison directement à votre adresse par notre transporteur partenaire.
                    Signature requise.
                  </p>
                  <ul className="space-y-1 text-sm font-terra-body text-gray-600">
                    <li>• Créneau de livraison par SMS</li>
                    <li>• Possibilité de reporter la livraison</li>
                    <li>• Suivi en temps réel</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-6 w-6 text-terra-green mr-3" />
                    <h4 className="font-terra-display font-semibold text-urban-black">
                      Point relais
                    </h4>
                  </div>
                  <p className="font-terra-body text-gray-700 mb-4 text-sm">
                    Retrait dans l'un de nos 15 000 points relais partenaires en France.
                  </p>
                  <ul className="space-y-1 text-sm font-terra-body text-gray-600">
                    <li>• Horaires étendus (souvent 7j/7)</li>
                    <li>• Réduction de 1€ sur les frais de port</li>
                    <li>• Conservation 14 jours</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Préparation et expédition */}
            <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-6">
              <h3 className="text-xl font-terra-display font-semibold text-urban-black mb-4 flex items-center">
                <Clock className="h-6 w-6 text-terra-green mr-3" />
                Préparation et expédition
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-terra-display font-semibold text-urban-black mb-3">
                    Délais de préparation
                  </h4>
                  <ul className="space-y-2 text-sm font-terra-body text-gray-700">
                    <li>
                      • <strong>Produits en stock :</strong> 24h ouvrées
                    </li>
                    <li>
                      • <strong>Commandes avant 14h :</strong> Expédition le jour même
                    </li>
                    <li>
                      • <strong>Weekend et jours fériés :</strong> Préparation le jour ouvré suivant
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-terra-display font-semibold text-urban-black mb-3">
                    Suivi de commande
                  </h4>
                  <ul className="space-y-2 text-sm font-terra-body text-gray-700">
                    <li>• Email de confirmation d'expédition</li>
                    <li>• Numéro de suivi transporteur</li>
                    <li>• Notifications SMS pour la livraison</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Retours */}
        <section className="mb-16">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 flex items-center">
            <RotateCcw className="h-7 w-7 text-terra-green mr-3" />
            Retours et échanges
          </h2>

          <div className="space-y-8">
            {/* Politique de retour */}
            <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-8">
              <h3 className="text-xl font-terra-display font-semibold text-urban-black mb-4">
                Notre engagement : 30 jours pour changer d'avis
              </h3>
              <p className="font-terra-body text-gray-700 mb-6">
                Chez TERRA, nous voulons que vous soyez 100% satisfait de votre achat. C'est
                pourquoi nous vous offrons 30 jours (au lieu des 14 jours légaux) pour retourner ou
                échanger vos sneakers, sans frais et sans justification.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-terra-display font-semibold text-urban-black mb-3 text-terra-green">
                    ✓ Conditions acceptées
                  </h4>
                  <ul className="space-y-2 text-sm font-terra-body text-gray-700">
                    <li>• Sneakers non portées à l'extérieur</li>
                    <li>• Emballage d'origine conservé</li>
                    <li>• Tous les accessoires inclus (lacets, etc.)</li>
                    <li>• État neuf, sans traces d'usure</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-terra-display font-semibold text-urban-black mb-3 text-red-600">
                    ✗ Conditions refusées
                  </h4>
                  <ul className="space-y-2 text-sm font-terra-body text-gray-700">
                    <li>• Sneakers portées à l'extérieur</li>
                    <li>• Semelles salies ou abîmées</li>
                    <li>• Produits personnalisés</li>
                    <li>• Retour après 30 jours</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Procédure de retour */}
            <div>
              <h3 className="text-xl font-terra-display font-semibold text-urban-black mb-6">
                Comment procéder à un retour ?
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-terra-green text-white rounded-full flex items-center justify-center font-terra-display font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                      Initiez votre retour en ligne
                    </h4>
                    <p className="font-terra-body text-gray-700 text-sm">
                      Connectez-vous à votre compte TERRA et cliquez sur "Retourner un article" dans
                      votre historique de commandes. Sélectionnez les articles à retourner et le
                      motif.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-terra-green text-white rounded-full flex items-center justify-center font-terra-display font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                      Imprimez votre étiquette de retour
                    </h4>
                    <p className="font-terra-body text-gray-700 text-sm">
                      Téléchargez et imprimez l'étiquette de retour gratuite. Si vous n'avez pas
                      d'imprimante, contactez-nous pour recevoir l'étiquette par courrier.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-terra-green text-white rounded-full flex items-center justify-center font-terra-display font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                      Emballez vos sneakers
                    </h4>
                    <p className="font-terra-body text-gray-700 text-sm">
                      Replacez vos sneakers dans leur boîte d'origine avec tous les accessoires.
                      Collez l'étiquette de retour sur le colis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-terra-green text-white rounded-full flex items-center justify-center font-terra-display font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                      Déposez votre colis
                    </h4>
                    <p className="font-terra-body text-gray-700 text-sm">
                      Déposez votre colis dans un point relais, bureau de poste, ou programmez un
                      enlèvement à domicile (selon l'option choisie).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Délais de traitement */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-terra-display font-semibold text-urban-black mb-4 flex items-center">
                  <Euro className="h-5 w-5 text-terra-green mr-2" />
                  Remboursement
                </h4>
                <ul className="space-y-2 text-sm font-terra-body text-gray-700">
                  <li>
                    • <strong>Délai :</strong> 3-5 jours après réception
                  </li>
                  <li>
                    • <strong>Méthode :</strong> Même moyen de paiement
                  </li>
                  <li>
                    • <strong>Frais de port :</strong> Non remboursés (sauf défaut)
                  </li>
                  <li>
                    • <strong>Notification :</strong> Email de confirmation
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-terra-display font-semibold text-urban-black mb-4 flex items-center">
                  <Package className="h-5 w-5 text-terra-green mr-2" />
                  Échange
                </h4>
                <ul className="space-y-2 text-sm font-terra-body text-gray-700">
                  <li>
                    • <strong>Délai :</strong> 2-3 jours après réception
                  </li>
                  <li>
                    • <strong>Frais :</strong> Gratuit en France
                  </li>
                  <li>
                    • <strong>Disponibilité :</strong> Sous réserve de stock
                  </li>
                  <li>
                    • <strong>Expédition :</strong> Dès validation du retour
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section Garanties */}
        <section className="mb-16">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 flex items-center">
            <Shield className="h-7 w-7 text-terra-green mr-3" />
            Garanties
          </h2>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                Garantie qualité TERRA - 1 an
              </h3>
              <p className="font-terra-body text-gray-700 mb-4">
                Nous garantissons tous nos produits contre les défauts de fabrication pendant 1 an à
                compter de la date d'achat. Cette garantie couvre :
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm font-terra-body text-gray-700">
                  <li>• Défauts de couture ou collage</li>
                  <li>• Problèmes de semelle</li>
                  <li>• Défauts des matériaux</li>
                </ul>
                <ul className="space-y-2 text-sm font-terra-body text-gray-700">
                  <li>• Décoloration anormale</li>
                  <li>• Problèmes d'œillets ou lacets</li>
                  <li>• Défauts de forme</li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                Garantie légale de conformité - 2 ans
              </h3>
              <p className="font-terra-body text-gray-700 text-sm">
                Conformément à la législation française, tous nos produits bénéficient de la
                garantie légale de conformité de 2 ans et de la garantie contre les vices cachés.
                Ces garanties s'appliquent indépendamment de notre garantie commerciale.
              </p>
            </div>
          </div>
        </section>

        {/* Section Emballage écoresponsable */}
        <section className="mb-16">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 flex items-center">
            <Leaf className="h-7 w-7 text-terra-green mr-3" />
            Emballage écoresponsable
          </h2>

          <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-8">
            <p className="font-terra-body text-gray-700 mb-6">
              Fidèles à nos valeurs environnementales, nous avons repensé entièrement nos emballages
              pour minimiser notre impact :
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-terra-display font-semibold text-urban-black mb-4 text-terra-green">
                  Nos matériaux
                </h4>
                <ul className="space-y-2 text-sm font-terra-body text-gray-700">
                  <li>• Cartons 100% recyclés et recyclables</li>
                  <li>• Encres végétales pour l'impression</li>
                  <li>• Papier de soie sans blanchiment chlore</li>
                  <li>• Adhésifs à base d'eau</li>
                  <li>• Zéro plastique dans nos colis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-terra-display font-semibold text-urban-black mb-4 text-terra-green">
                  Notre engagement
                </h4>
                <ul className="space-y-2 text-sm font-terra-body text-gray-700">
                  <li>• Emballages optimisés pour réduire le volume</li>
                  <li>• Partenariat avec des fournisseurs certifiés FSC</li>
                  <li>• Instructions de tri incluses dans chaque colis</li>
                  <li>• Réutilisation encouragée de nos boîtes</li>
                  <li>• Bilan carbone neutre sur nos emballages</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact et aide */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-terra-display font-bold text-urban-black mb-4">
            Une question sur votre livraison ou retour ?
          </h2>
          <p className="font-terra-body text-gray-700 mb-6">
            Notre équipe customer care est là pour vous accompagner à chaque étape.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/contact"
              className="bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Centre d'aide
            </a>
            <a
              href="mailto:hello@terra-sneakers.com"
              className="border border-terra-green text-terra-green hover:bg-terra-green hover:text-white font-terra-display font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Nous écrire
            </a>
            <a href="tel:+33142868788" className="text-terra-green hover:underline font-terra-body">
              +33 1 42 86 87 88
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Livraison & Retours | TERRA - Sneakers Écoresponsables',
    description:
      'Livraison gratuite dès 100€, retours gratuits pendant 30 jours. Découvrez nos conditions de livraison et notre politique de retour TERRA.',
    openGraph: {
      title: 'Livraison & Retours | TERRA',
      description:
        'Livraison rapide, retours gratuits pendant 30 jours. Chez TERRA, votre satisfaction est notre priorité.',
    },
  }
}
