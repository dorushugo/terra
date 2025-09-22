import type { Metadata } from 'next'
import React from 'react'
import { ShoppingBag, Truck, RotateCcw, CreditCard, Scale } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center">
              <Scale className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-terra-display font-bold text-urban-black mb-4">
            Conditions Générales de Vente
          </h1>
          <p className="text-lg font-terra-body text-gray-600 max-w-2xl mx-auto">
            Les conditions qui régissent vos achats sur TERRA. Transparentes, équitables, centrées
            sur votre satisfaction.
          </p>
        </div>

        {/* Navigation rapide */}
        <div className="bg-gray-50 rounded-lg p-6 mb-12">
          <h2 className="font-terra-display font-semibold text-urban-black mb-4">
            Navigation rapide
          </h2>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <a href="#article-1" className="text-terra-green hover:underline">
              1. Informations légales
            </a>
            <a href="#article-2" className="text-terra-green hover:underline">
              2. Produits et commandes
            </a>
            <a href="#article-3" className="text-terra-green hover:underline">
              3. Prix et paiement
            </a>
            <a href="#article-4" className="text-terra-green hover:underline">
              4. Livraison
            </a>
            <a href="#article-5" className="text-terra-green hover:underline">
              5. Droit de rétractation
            </a>
            <a href="#article-6" className="text-terra-green hover:underline">
              6. Garanties
            </a>
            <a href="#article-7" className="text-terra-green hover:underline">
              7. Responsabilité
            </a>
            <a href="#article-8" className="text-terra-green hover:underline">
              8. Données personnelles
            </a>
          </div>
        </div>

        {/* Préambule */}
        <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-8 mb-12">
          <h2 className="text-xl font-terra-display font-bold text-urban-black mb-4">Préambule</h2>
          <p className="font-terra-body text-gray-700 mb-4">
            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles
            entre TERRA SNEAKERS SAS et ses clients dans le cadre de la vente en ligne de sneakers
            écoresponsables.
          </p>
          <p className="font-terra-body text-gray-700">
            En passant commande sur notre site, vous acceptez sans réserve les présentes conditions
            générales de vente.
          </p>
        </div>

        {/* Articles */}
        <div className="space-y-12">
          <article id="article-1">
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6 flex items-center">
              <div className="w-8 h-8 bg-terra-green text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                1
              </div>
              Informations légales
            </h2>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-terra-display font-semibold text-urban-black mb-4">Vendeur</h3>
              <p className="font-terra-body text-gray-700">
                <strong>TERRA SNEAKERS SAS</strong>
                <br />
                Société par Actions Simplifiée au capital de 250 000 €<br />
                Siège social : 15 rue de la Paix, 75001 Paris, France
                <br />
                RCS Paris : 123 456 789
                <br />
                SIRET : 123 456 789 00012
                <br />
                TVA Intracommunautaire : FR12123456789
                <br />
                Email : hello@terra-sneakers.com
                <br />
                Téléphone : +33 1 42 86 87 88
              </p>
            </div>

            <p className="font-terra-body text-gray-700">
              Le site terra-sneakers.com est édité par TERRA SNEAKERS SAS, représentée par sa
              Présidente, Madame Marie Dubois.
            </p>
          </article>

          <article id="article-2">
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6 flex items-center">
              <div className="w-8 h-8 bg-terra-green text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                2
              </div>
              Produits et commandes
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  2.1 Produits
                </h3>
                <p className="font-terra-body text-gray-700 mb-4">
                  TERRA commercialise des sneakers écoresponsables fabriquées à partir de matériaux
                  durables et recyclés. Nos produits sont organisés en trois collections :
                </p>
                <ul className="font-terra-body text-gray-700 space-y-2 ml-6">
                  <li>
                    • <strong>TERRA Origin</strong> : L'essentiel réinventé, design minimaliste
                  </li>
                  <li>
                    • <strong>TERRA Move</strong> : Performance urbaine, confort technique
                  </li>
                  <li>
                    • <strong>TERRA Limited</strong> : Éditions exclusives, matériaux innovants
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  2.2 Descriptions et visuels
                </h3>
                <p className="font-terra-body text-gray-700 mb-4">
                  Les descriptions, caractéristiques et visuels des produits sont donnés à titre
                  indicatif. Nous nous efforçons de présenter les produits avec la plus grande
                  précision possible. Cependant, de légères variations peuvent exister notamment au
                  niveau des couleurs en fonction de votre écran.
                </p>
              </div>

              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  2.3 Disponibilité et stocks
                </h3>
                <p className="font-terra-body text-gray-700 mb-4">
                  Nos offres de produits sont valables tant qu'elles sont visibles sur le site, dans
                  la limite des stocks disponibles. En cas d'indisponibilité d'un produit après
                  passation de votre commande, nous vous en informerons dans les plus brefs délais.
                </p>
              </div>

              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  2.4 Commande
                </h3>
                <p className="font-terra-body text-gray-700">
                  Toute commande suppose l'adhésion aux présentes conditions générales. La
                  validation de votre commande vaut acceptation de ces conditions et reconnaissance
                  d'en avoir parfaitement connaissance.
                </p>
              </div>
            </div>
          </article>

          <article id="article-3">
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6 flex items-center">
              <div className="w-8 h-8 bg-terra-green text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                3
              </div>
              Prix et paiement
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 text-terra-green mr-2" />
                  3.1 Prix
                </h3>
                <p className="font-terra-body text-gray-700 mb-4">
                  Les prix sont indiqués en euros, toutes taxes comprises (TTC), hors frais de
                  livraison. Ils sont valables au jour de la commande et peuvent être modifiés à
                  tout moment.
                </p>
                <div className="bg-terra-green/5 rounded-lg p-4">
                  <p className="font-terra-body text-gray-700 text-sm">
                    <strong>Gammes de prix :</strong>
                    <br />
                    • TERRA Origin : À partir de 139€
                    <br />
                    • TERRA Move : À partir de 159€
                    <br />• TERRA Limited : À partir de 179€
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  3.2 Frais de livraison
                </h3>
                <p className="font-terra-body text-gray-700 mb-4">
                  Les frais de livraison sont calculés selon la destination et le mode de livraison
                  choisi :
                </p>
                <div className="space-y-2 text-sm font-terra-body text-gray-700">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>France métropolitaine (standard)</span>
                    <span className="font-semibold">4,90€</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>France métropolitaine (express 24h)</span>
                    <span className="font-semibold">9,90€</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Union Européenne</span>
                    <span className="font-semibold">12,90€</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Commandes &gt; 100€</span>
                    <span className="font-semibold text-terra-green">GRATUIT</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  3.3 Modalités de paiement
                </h3>
                <p className="font-terra-body text-gray-700 mb-4">
                  Le paiement s'effectue au moment de la commande par :
                </p>
                <ul className="font-terra-body text-gray-700 space-y-2 ml-6">
                  <li>• Carte bancaire (Visa, Mastercard, American Express)</li>
                  <li>• PayPal</li>
                  <li>• Apple Pay / Google Pay</li>
                  <li>• Paiement en 3 fois sans frais (via Klarna, commandes &gt; 100€)</li>
                </ul>
                <p className="font-terra-body text-gray-700 mt-4">
                  Toutes les transactions sont sécurisées par cryptage SSL. Nous ne stockons aucune
                  donnée bancaire.
                </p>
              </div>
            </div>
          </article>

          <article id="article-4">
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6 flex items-center">
              <div className="w-8 h-8 bg-terra-green text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                4
              </div>
              Livraison
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4 flex items-center">
                  <Truck className="h-5 w-5 text-terra-green mr-2" />
                  4.1 Zones de livraison
                </h3>
                <p className="font-terra-body text-gray-700 mb-4">
                  Nous livrons actuellement en France métropolitaine, Corse et dans l'Union
                  Européenne. D'autres destinations seront ajoutées prochainement.
                </p>
              </div>

              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  4.2 Délais de livraison
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="font-terra-body text-gray-700">
                      France - Livraison standard
                    </span>
                    <span className="font-terra-display font-semibold text-terra-green">
                      2-3 jours ouvrés
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="font-terra-body text-gray-700">
                      France - Livraison express
                    </span>
                    <span className="font-terra-display font-semibold text-terra-green">
                      24h ouvrées
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="font-terra-body text-gray-700">Union Européenne</span>
                    <span className="font-terra-display font-semibold text-terra-green">
                      3-5 jours ouvrés
                    </span>
                  </div>
                </div>
                <p className="font-terra-body text-gray-700 text-sm mt-4">
                  Les délais sont donnés à titre indicatif et courent à compter de l'expédition de
                  la commande.
                </p>
              </div>

              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  4.3 Modalités de livraison
                </h3>
                <p className="font-terra-body text-gray-700 mb-4">
                  La livraison s'effectue à l'adresse indiquée lors de la commande. Il est important
                  de s'assurer de l'exactitude de l'adresse de livraison car nous ne pourrons pas
                  être tenus responsables de la non-distribution d'un colis pour cette raison.
                </p>
                <p className="font-terra-body text-gray-700">
                  Un suivi de commande vous sera communiqué par email dès l'expédition.
                </p>
              </div>
            </div>
          </article>

          <article id="article-5">
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6 flex items-center">
              <div className="w-8 h-8 bg-terra-green text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                5
              </div>
              Droit de rétractation et retours
            </h2>

            <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <RotateCcw className="h-6 w-6 text-terra-green mr-3" />
                <h3 className="font-terra-display font-semibold text-urban-black">
                  Retours gratuits pendant 30 jours
                </h3>
              </div>
              <p className="font-terra-body text-gray-700">
                Chez TERRA, nous voulons que vous soyez 100% satisfait. C'est pourquoi nous offrons
                des retours gratuits pendant 30 jours.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  5.1 Délai de rétractation
                </h3>
                <p className="font-terra-body text-gray-700">
                  Conformément à l'article L221-18 du Code de la consommation, vous disposez d'un
                  délai de 14 jours pour exercer votre droit de rétractation sans avoir à justifier
                  de motifs ni à payer de pénalités. Ce délai court à compter de la réception des
                  produits.
                </p>
                <p className="font-terra-body text-gray-700 mt-4">
                  <strong>TERRA va plus loin :</strong> nous vous offrons 30 jours pour retourner
                  vos sneakers si elles ne vous conviennent pas.
                </p>
              </div>

              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  5.2 Conditions de retour
                </h3>
                <p className="font-terra-body text-gray-700 mb-4">
                  Pour être acceptés, les produits retournés doivent être :
                </p>
                <ul className="font-terra-body text-gray-700 space-y-2 ml-6">
                  <li>• Dans leur état d'origine, non portés à l'extérieur</li>
                  <li>• Accompagnés de tous leurs accessoires (lacets, boîte, etc.)</li>
                  <li>• Dans leur emballage d'origine</li>
                  <li>• Retournés dans les 30 jours suivant la réception</li>
                </ul>
              </div>

              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  5.3 Procédure de retour
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-terra-green text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <p className="font-terra-body text-gray-700">
                      Connectez-vous à votre compte et initiez le retour
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-terra-green text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <p className="font-terra-body text-gray-700">
                      Imprimez l'étiquette de retour gratuite
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-terra-green text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <p className="font-terra-body text-gray-700">
                      Emballez vos sneakers et collez l'étiquette
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-terra-green text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      4
                    </div>
                    <p className="font-terra-body text-gray-700">
                      Déposez le colis dans un point relais ou en boîte aux lettres
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  5.4 Remboursement
                </h3>
                <p className="font-terra-body text-gray-700">
                  Le remboursement s'effectue dans les 14 jours suivant la réception du produit
                  retourné, par le même moyen de paiement que celui utilisé lors de l'achat. Les
                  frais de livraison initiaux ne sont pas remboursés (sauf en cas de défaut du
                  produit).
                </p>
              </div>
            </div>
          </article>

          <article id="article-6">
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6 flex items-center">
              <div className="w-8 h-8 bg-terra-green text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                6
              </div>
              Garanties
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  6.1 Garantie légale de conformité
                </h3>
                <p className="font-terra-body text-gray-700 mb-4">
                  Tous nos produits bénéficient de la garantie légale de conformité (articles L217-4
                  à L217-12 du Code de la consommation) et de la garantie des vices cachés (articles
                  1641 à 1648 et 2232 du Code Civil).
                </p>
                <p className="font-terra-body text-gray-700">
                  Cette garantie s'applique pendant 2 ans à compter de la délivrance du bien.
                </p>
              </div>

              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  6.2 Garantie TERRA
                </h3>
                <div className="bg-terra-green/5 rounded-lg p-6">
                  <p className="font-terra-body text-gray-700 mb-4">
                    <strong>Engagement qualité TERRA :</strong> Nous garantissons nos sneakers
                    contre tout défaut de fabrication pendant 1 an. Si un défaut apparaît dans des
                    conditions normales d'utilisation, nous procédons à l'échange ou au
                    remboursement.
                  </p>
                  <p className="font-terra-body text-gray-700 text-sm">
                    Cette garantie ne couvre pas l'usure normale, les dommages dus à un mauvais
                    usage ou les modifications apportées au produit.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article id="article-7">
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6 flex items-center">
              <div className="w-8 h-8 bg-terra-green text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                7
              </div>
              Responsabilité
            </h2>

            <p className="font-terra-body text-gray-700 mb-6">
              TERRA SNEAKERS SAS ne saurait être tenue responsable de l'inexécution du contrat
              conclu en cas de rupture de stock ou indisponibilité du produit, de force majeure, de
              perturbation ou grève totale ou partielle notamment des services postaux et moyens de
              transport et/ou communications, d'inondation, d'incendie.
            </p>

            <p className="font-terra-body text-gray-700">
              La responsabilité de TERRA SNEAKERS SAS ne peut être engagée en cas de mauvaise
              utilisation du produit acheté. De même, la responsabilité de TERRA SNEAKERS SAS ne
              saurait être engagée pour tous les inconvénients ou dommages inhérents à l'utilisation
              du réseau Internet, notamment une rupture de service, une intrusion extérieure ou la
              présence de virus informatiques.
            </p>
          </article>

          <article id="article-8">
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6 flex items-center">
              <div className="w-8 h-8 bg-terra-green text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                8
              </div>
              Données personnelles et cookies
            </h2>

            <p className="font-terra-body text-gray-700 mb-6">
              Les données personnelles collectées dans le cadre des commandes sont traitées
              conformément à notre
              <a href="/privacy" className="text-terra-green hover:underline font-semibold">
                {' '}
                Politique de Confidentialité
              </a>
              .
            </p>

            <p className="font-terra-body text-gray-700">
              L'utilisation de cookies est détaillée dans notre
              <a href="/cookies" className="text-terra-green hover:underline font-semibold">
                {' '}
                Politique des Cookies
              </a>
              .
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6 flex items-center">
              <div className="w-8 h-8 bg-terra-green text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                9
              </div>
              Droit applicable et juridiction
            </h2>

            <p className="font-terra-body text-gray-700 mb-4">
              Les présentes conditions générales de vente sont soumises à la loi française. En cas
              de litige, une solution amiable sera recherchée avant toute action judiciaire.
            </p>

            <p className="font-terra-body text-gray-700 mb-6">
              À défaut de résolution amiable, les tribunaux français seront seuls compétents.
            </p>

            <div className="bg-terra-green/5 rounded-lg p-6">
              <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                Médiation de la consommation
              </h3>
              <p className="font-terra-body text-gray-700 mb-4">
                Conformément aux dispositions du Code de la consommation concernant le règlement
                amiable des litiges, TERRA SNEAKERS SAS adhère au Service du Médiateur du e-commerce
                de la FEVAD (Fédération du e-commerce et de la vente à distance).
              </p>
              <p className="font-terra-body text-gray-700 text-sm">
                En cas de litige, vous pouvez déposer votre réclamation sur la plateforme de
                résolution des litiges mise en ligne par la Commission Européenne :
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terra-green hover:underline ml-1"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
            </div>
          </article>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="font-terra-body text-gray-500 text-sm mb-4">
              Dernière mise à jour : Décembre 2024
            </p>
            <p className="font-terra-body text-gray-600">
              Pour toute question concernant ces conditions, contactez-nous à :
              <a
                href="mailto:hello@terra-sneakers.com"
                className="text-terra-green hover:underline ml-1"
              >
                hello@terra-sneakers.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Conditions Générales de Vente | TERRA - Sneakers Écoresponsables',
    description:
      'Consultez les conditions générales de vente de TERRA. Conditions transparentes pour vos achats de sneakers écoresponsables : livraison, retours, garanties.',
    openGraph: {
      title: 'Conditions Générales de Vente | TERRA',
      description:
        'Les conditions qui régissent vos achats sur TERRA. Transparentes, équitables, centrées sur votre satisfaction.',
    },
  }
}
