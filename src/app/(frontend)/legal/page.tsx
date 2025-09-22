import type { Metadata } from 'next'
import React from 'react'
import { Leaf, MapPin, Mail, Phone } from 'lucide-react'

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center">
              <Leaf className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-terra-display font-bold text-urban-black mb-4">
            Mentions Légales
          </h1>
          <p className="text-lg font-terra-body text-gray-600 max-w-2xl mx-auto">
            Informations légales concernant TERRA, votre marque de sneakers écoresponsables
          </p>
        </div>

        {/* Contenu */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
              Informations sur l'entreprise
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  Raison sociale
                </h3>
                <p className="font-terra-body text-gray-700 mb-6">
                  TERRA SNEAKERS SAS
                  <br />
                  Société par Actions Simplifiée
                  <br />
                  Capital social : 250 000 €
                </p>

                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  Identification
                </h3>
                <p className="font-terra-body text-gray-700">
                  SIRET : 123 456 789 00012
                  <br />
                  RCS Paris : 123 456 789
                  <br />
                  TVA Intracommunautaire : FR12123456789
                  <br />
                  Code APE : 4642Z (Commerce de gros d'habillement et de chaussures)
                </p>
              </div>

              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  Siège social
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-terra-green mt-1 flex-shrink-0" />
                    <span className="font-terra-body text-gray-700">
                      15 rue de la Paix
                      <br />
                      75001 Paris, France
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-terra-green flex-shrink-0" />
                    <span className="font-terra-body text-gray-700">+33 1 42 86 87 88</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-terra-green flex-shrink-0" />
                    <span className="font-terra-body text-gray-700">hello@terra-sneakers.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
                Direction de la publication
              </h2>
              <p className="font-terra-body text-gray-700 mb-4">
                <strong>Directrice de la publication :</strong> Marie Dubois, Présidente
              </p>
              <p className="font-terra-body text-gray-700">
                <strong>Responsable de la rédaction :</strong> Sofia Rossi, Directrice Marketing
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
                Hébergement du site
              </h2>
              <p className="font-terra-body text-gray-700 mb-4">Ce site est hébergé par :</p>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="font-terra-body text-gray-700">
                  <strong>Vercel Inc.</strong>
                  <br />
                  340 S Lemon Ave #4133
                  <br />
                  Walnut, CA 91789, États-Unis
                  <br />
                  <a href="https://vercel.com" className="text-terra-green hover:underline">
                    https://vercel.com
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
                Propriété intellectuelle
              </h2>
              <p className="font-terra-body text-gray-700 mb-4">
                L'ensemble de ce site relève de la législation française et internationale sur le
                droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont
                réservés, y compris pour les documents téléchargeables et les représentations
                iconographiques et photographiques.
              </p>
              <p className="font-terra-body text-gray-700 mb-4">
                La marque TERRA, son logo, et tous les éléments distinctifs du site sont des marques
                déposées de TERRA SNEAKERS SAS. Toute reproduction non autorisée de ces éléments
                constitue une contrefaçon passible de sanctions pénales.
              </p>
              <p className="font-terra-body text-gray-700">
                Les utilisateurs du site ne peuvent extraire, réutiliser, diffuser ou exploiter le
                contenu du site qu'aux fins de consultation privée. Toute autre utilisation est
                soumise à autorisation préalable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
                Données personnelles
              </h2>
              <p className="font-terra-body text-gray-700 mb-4">
                Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au
                Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit
                d'accès, de rectification, de suppression et d'opposition aux données personnelles
                vous concernant.
              </p>
              <p className="font-terra-body text-gray-700">
                Pour exercer ces droits ou pour toute question sur le traitement de vos données,
                contactez-nous à :
                <a
                  href="mailto:privacy@terra-sneakers.com"
                  className="text-terra-green hover:underline ml-1"
                >
                  privacy@terra-sneakers.com
                </a>
              </p>
              <p className="font-terra-body text-gray-700 mt-4">
                Consultez notre{' '}
                <a href="/privacy" className="text-terra-green hover:underline">
                  Politique de Confidentialité
                </a>{' '}
                pour plus d'informations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
                Cookies
              </h2>
              <p className="font-terra-body text-gray-700 mb-4">
                Ce site utilise des cookies pour améliorer votre expérience de navigation et
                réaliser des statistiques de visite. En continuant à naviguer sur ce site, vous
                acceptez l'utilisation de cookies.
              </p>
              <p className="font-terra-body text-gray-700">
                Pour en savoir plus et paramétrer vos cookies, consultez notre{' '}
                <a href="/cookies" className="text-terra-green hover:underline">
                  Politique des Cookies
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
                Responsabilité
              </h2>
              <p className="font-terra-body text-gray-700 mb-4">
                TERRA SNEAKERS SAS s'efforce de fournir des informations aussi précises que possible
                sur ce site. Toutefois, elle ne pourra être tenue responsable des omissions, des
                inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du
                fait des tiers partenaires qui lui fournissent ces informations.
              </p>
              <p className="font-terra-body text-gray-700">
                Tous les informations proposées sur ce site sont données à titre indicatif, et sont
                susceptibles d'évoluer. Par ailleurs, les renseignements figurant sur ce site ne
                sont pas exhaustifs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
                Liens hypertextes
              </h2>
              <p className="font-terra-body text-gray-700 mb-4">
                Ce site peut contenir des liens vers d'autres sites. TERRA SNEAKERS SAS n'exerce
                aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
              </p>
              <p className="font-terra-body text-gray-700">
                L'existence d'un lien de ce site vers un autre site ne constitue pas une validation
                de ce site ou de son contenu. Il appartient à l'internaute d'utiliser ces
                informations avec discernement et esprit critique.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
                Droit applicable et juridiction compétente
              </h2>
              <p className="font-terra-body text-gray-700">
                Les présentes mentions légales sont régies par le droit français. En cas de litige,
                et à défaut de résolution amiable, les tribunaux français seront seuls compétents.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-200 text-center">
            <p className="font-terra-body text-gray-500 text-sm">
              Dernière mise à jour : Décembre 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Mentions Légales | TERRA - Sneakers Écoresponsables',
    description:
      "Mentions légales de TERRA, votre marque de sneakers écoresponsables. Informations sur l'entreprise, hébergement, propriété intellectuelle et données personnelles.",
    openGraph: {
      title: 'Mentions Légales | TERRA',
      description:
        'Informations légales concernant TERRA, votre marque de sneakers écoresponsables.',
    },
  }
}
