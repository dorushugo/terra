import type { Metadata } from 'next'
import React from 'react'
import {
  HelpCircle,
  ChevronDown,
  ShoppingBag,
  Truck,
  RotateCcw,
  Leaf,
  CreditCard,
  Users,
} from 'lucide-react'

export default function FAQPage() {
  const faqCategories = [
    {
      title: 'Commandes & Paiements',
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600',
      questions: [
        {
          question: 'Comment passer une commande sur TERRA ?',
          answer:
            "Sélectionnez vos sneakers, choisissez votre taille et couleur, ajoutez au panier, puis suivez le processus de commande. Vous pouvez payer par carte bancaire, PayPal, Apple Pay ou Google Pay. Un compte TERRA n'est pas obligatoire mais recommandé pour un suivi optimal.",
        },
        {
          question: 'Quels moyens de paiement acceptez-vous ?',
          answer:
            'Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, et le paiement en 3 fois sans frais via Klarna pour les commandes supérieures à 100€. Tous les paiements sont sécurisés par cryptage SSL.',
        },
        {
          question: 'Puis-je modifier ou annuler ma commande ?',
          answer:
            "Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa validation, avant qu'elle ne soit préparée. Connectez-vous à votre compte ou contactez-nous rapidement. Passé ce délai, utilisez notre politique de retour gratuit de 30 jours.",
        },
        {
          question: 'Comment utiliser un code promo ?',
          answer:
            'Saisissez votre code promo dans le champ "Code de réduction" lors du processus de commande, avant le paiement. La réduction s\'applique automatiquement. Un seul code promo par commande, non cumulable avec d\'autres offres sauf mention contraire.',
        },
      ],
    },
    {
      title: 'Livraison & Expédition',
      icon: Truck,
      color: 'bg-green-100 text-green-600',
      questions: [
        {
          question: 'Quels sont les délais de livraison ?',
          answer:
            'France métropolitaine : 2-3 jours ouvrés (gratuit dès 100€). Express 24h : 1 jour ouvré (9,90€). Union Européenne : 3-5 jours ouvrés (12,90€). Les commandes passées avant 14h sont expédiées le jour même.',
        },
        {
          question: 'Comment suivre ma commande ?',
          answer:
            "Dès l'expédition, vous recevez un email avec le numéro de suivi. Connectez-vous à votre compte TERRA ou utilisez le lien dans l'email pour suivre votre colis en temps réel. Vous recevrez également des notifications SMS avant la livraison.",
        },
        {
          question: 'Livrez-vous dans les DOM-TOM ?',
          answer:
            'Actuellement, nous livrons uniquement en France métropolitaine, Corse et Union Européenne. Nous travaillons à étendre nos zones de livraison aux DOM-TOM prochainement. Inscrivez-vous à notre newsletter pour être informé des nouveautés.',
        },
        {
          question: 'Que faire si je ne suis pas présent à la livraison ?',
          answer:
            'Le transporteur laisse un avis de passage et tente une nouvelle livraison le lendemain. Après 2 tentatives, le colis est disponible en point relais pendant 14 jours. Vous pouvez aussi choisir directement la livraison en point relais lors de votre commande.',
        },
      ],
    },
    {
      title: 'Retours & Échanges',
      icon: RotateCcw,
      color: 'bg-purple-100 text-purple-600',
      questions: [
        {
          question: 'Comment retourner mes sneakers TERRA ?',
          answer:
            "Vous avez 30 jours pour retourner vos sneakers. Connectez-vous à votre compte, initiez le retour, imprimez l'étiquette gratuite, emballez le produit dans sa boîte d'origine et déposez le colis. Le remboursement intervient 3-5 jours après réception.",
        },
        {
          question: 'Les retours sont-ils vraiment gratuits ?',
          answer:
            "Oui, les retours sont entièrement gratuits en France métropolitaine et Corse. Nous fournissons l'étiquette prépayée. Pour l'Union Européenne, les frais de retour sont à votre charge (environ 8-12€ selon le pays).",
        },
        {
          question: 'Puis-je échanger mes sneakers contre une autre taille ?',
          answer:
            "Absolument ! L'échange de taille est gratuit en France. Initiez un retour et passez une nouvelle commande pour la taille souhaitée, ou contactez-nous pour un échange direct si la taille est disponible. Nous priorisons les échanges pour un traitement plus rapide.",
        },
        {
          question: 'Dans quel état doivent être les sneakers pour un retour ?',
          answer:
            "Les sneakers doivent être dans leur état d'origine : non portées à l'extérieur, sans traces d'usure, avec tous les accessoires (lacets, boîte). Vous pouvez les essayer à l'intérieur sur moquette ou parquet propre.",
        },
      ],
    },
    {
      title: 'Produits & Matériaux',
      icon: Leaf,
      color: 'bg-green-100 text-green-600',
      questions: [
        {
          question: 'Quels matériaux utilisez-vous pour vos sneakers ?',
          answer:
            'Nos sneakers sont fabriquées avec 60% de matériaux recyclés minimum : plastique océan récupéré, coton biologique, caoutchouc naturel, cuir tanné végétal. Chaque collection privilégie des matériaux spécifiques détaillés sur les fiches produits.',
        },
        {
          question: 'Vos sneakers sont-elles vraiment écoresponsables ?',
          answer:
            'Oui, nous sommes certifiés B Corp et nos sneakers respectent des standards environnementaux stricts : fabrication européenne, matériaux durables, emballages 100% recyclables, bilan carbone neutre. Chaque paire finance la plantation de 3 arbres.',
        },
        {
          question: 'Comment entretenir mes sneakers TERRA ?',
          answer:
            "Nettoyage à l'eau tiède avec une brosse douce et savon neutre. Évitez la machine à laver et le sèche-linge. Laissez sécher à l'air libre, loin des sources de chaleur. Utilisez des embauchoirs pour conserver la forme. Guide d'entretien détaillé fourni avec chaque paire.",
        },
        {
          question: 'Quelle est la durée de vie de vos sneakers ?',
          answer:
            "Nos sneakers sont conçues pour durer : semelles renforcées, coutures doubles, matériaux résistants. Avec un entretien normal, comptez 2-3 ans d'utilisation régulière. Nous proposons aussi un service de réparation pour prolonger leur durée de vie.",
        },
      ],
    },
    {
      title: 'Tailles & Ajustement',
      icon: Users,
      color: 'bg-orange-100 text-orange-600',
      questions: [
        {
          question: 'Comment choisir ma taille TERRA ?',
          answer:
            'Consultez notre guide des tailles détaillé. Mesurez votre pied en cm et reportez-vous au tableau de correspondance. Nos tailles sont fidèles aux standards européens. En cas de doute entre deux tailles, prenez la supérieure, surtout pour la collection Move.',
        },
        {
          question: 'Les tailles TERRA correspondent-elles aux autres marques ?',
          answer:
            "Nos tailles correspondent globalement aux standards européens (Nike, Adidas, Puma). Cependant, chaque collection a ses spécificités : Origin (fidèle), Move (prendre +0.5 si entre deux tailles), Limited (fidèle mais s'assouplit). Consultez les spécificités de chaque collection.",
        },
        {
          question: 'Que faire si mes sneakers ne me vont pas ?',
          answer:
            "Pas de panique ! Vous avez 30 jours pour les retourner ou les échanger gratuitement. L'échange de taille est prioritaire et traité en 2-3 jours. Nous pouvons aussi vous conseiller personnellement sur le choix de la taille.",
        },
        {
          question: 'Proposez-vous des demi-pointures ?',
          answer:
            'Oui, nous proposons des demi-pointures de 36 à 45 pour toutes nos collections. Les demi-pointures sont particulièrement importantes pour un ajustement parfait, surtout si vous avez les pieds fins ou larges.',
        },
      ],
    },
    {
      title: 'Compte & Services',
      icon: Users,
      color: 'bg-gray-100 text-gray-600',
      questions: [
        {
          question: 'Dois-je créer un compte pour commander ?',
          answer:
            "Non, vous pouvez commander en tant qu'invité. Cependant, un compte TERRA vous permet de suivre vos commandes, gérer vos retours, sauvegarder vos adresses, accéder aux ventes privées et bénéficier du programme de fidélité.",
        },
        {
          question: 'Comment fonctionne le programme de fidélité TERRA ?',
          answer:
            "Gagnez 1 point par euro dépensé. 100 points = 5€ de réduction. Bénéficiez aussi d'un accès prioritaire aux nouveautés, ventes privées, et offres exclusives. Les points sont valables 2 ans et cumulables sans limite.",
        },
        {
          question: 'Puis-je modifier mes informations personnelles ?',
          answer:
            'Oui, connectez-vous à votre compte TERRA et accédez à "Mon profil" pour modifier vos informations personnelles, adresses, préférences de communication et paramètres de confidentialité à tout moment.',
        },
        {
          question: 'Comment supprimer mon compte TERRA ?',
          answer:
            'Vous pouvez supprimer votre compte depuis "Mon profil" > "Supprimer mon compte" ou nous contacter. La suppression est effective sous 48h. Vos données sont supprimées conformément au RGPD, sauf obligations légales (factures).',
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-terra-display font-bold text-urban-black mb-4">
            Foire Aux Questions
          </h1>
          <p className="text-lg font-terra-body text-gray-600 max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions sur TERRA. Notre équipe a rassemblé les
            questions les plus fréquentes.
          </p>
        </div>

        {/* Recherche rapide */}
        <div className="bg-gray-50 rounded-lg p-6 mb-12">
          <div className="max-w-md mx-auto">
            <input
              type="search"
              placeholder="Rechercher dans la FAQ..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-terra-green/50 focus:border-terra-green font-terra-body"
            />
          </div>
        </div>

        {/* Navigation par catégories */}
        <div className="mb-12">
          <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6 text-center">
            Choisissez votre catégorie
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {faqCategories.map((category) => (
              <a
                key={category.title}
                href={`#${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center space-x-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-terra-green hover:bg-terra-green/5 transition-colors group"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}
                >
                  <category.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-terra-display font-semibold text-urban-black group-hover:text-terra-green">
                    {category.title}
                  </h3>
                  <p className="text-sm font-terra-body text-gray-500">
                    {category.questions.length} questions
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Questions par catégorie */}
        <div className="space-y-16">
          {faqCategories.map((category) => (
            <section
              key={category.title}
              id={category.title.toLowerCase().replace(/\s+/g, '-')}
              className="scroll-mt-24"
            >
              <div className="flex items-center mb-8">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color} mr-4`}
                >
                  <category.icon className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-terra-display font-bold text-urban-black">
                  {category.title}
                </h2>
              </div>

              <div className="space-y-4">
                {category.questions.map((faq, index) => (
                  <details
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden group"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                      <h3 className="font-terra-display font-semibold text-urban-black text-left">
                        {faq.question}
                      </h3>
                      <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
                    </summary>
                    <div className="px-6 pb-6 pt-2">
                      <p className="font-terra-body text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Section contact */}
        <div className="mt-20 bg-terra-green/5 border border-terra-green/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-4">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="font-terra-body text-gray-700 mb-6">
            Notre équipe customer care est là pour vous aider. Contactez-nous par le moyen qui vous
            convient le mieux.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="w-10 h-10 bg-terra-green rounded-full flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                Chat en direct
              </h4>
              <p className="font-terra-body text-gray-600 text-sm mb-3">
                Lun-Ven 9h-18h
                <br />
                Sam 10h-17h
              </p>
              <button className="text-terra-green hover:underline font-terra-body text-sm font-semibold">
                Démarrer le chat
              </button>
            </div>

            <div className="bg-white rounded-lg p-4 text-center">
              <div className="w-10 h-10 bg-terra-green rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-terra-display font-semibold text-urban-black mb-2">Email</h4>
              <p className="font-terra-body text-gray-600 text-sm mb-3">
                Réponse sous 24h
                <br />
                7j/7
              </p>
              <a
                href="mailto:hello@terra-sneakers.com"
                className="text-terra-green hover:underline font-terra-body text-sm font-semibold"
              >
                Nous écrire
              </a>
            </div>

            <div className="bg-white rounded-lg p-4 text-center">
              <div className="w-10 h-10 bg-terra-green rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-terra-display font-semibold text-urban-black mb-2">Téléphone</h4>
              <p className="font-terra-body text-gray-600 text-sm mb-3">
                Lun-Ven 9h-18h
                <br />
                Appel gratuit
              </p>
              <a
                href="tel:+33142868788"
                className="text-terra-green hover:underline font-terra-body text-sm font-semibold"
              >
                01 42 86 87 88
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/contact"
              className="bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Centre d'aide complet
            </a>
            <a
              href="/size-guide"
              className="border border-terra-green text-terra-green hover:bg-terra-green hover:text-white font-terra-display font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Guide des tailles
            </a>
          </div>
        </div>

        {/* Ressources utiles */}
        <div className="mt-16">
          <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6 text-center">
            Ressources utiles
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <a
              href="/size-guide"
              className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition-colors"
            >
              <div className="font-terra-display font-semibold text-urban-black mb-2">
                Guide des tailles
              </div>
              <div className="font-terra-body text-gray-600 text-sm">
                Trouvez votre taille parfaite
              </div>
            </a>
            <a
              href="/shipping"
              className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition-colors"
            >
              <div className="font-terra-display font-semibold text-urban-black mb-2">
                Livraison & Retours
              </div>
              <div className="font-terra-body text-gray-600 text-sm">Tout sur nos services</div>
            </a>
            <a
              href="/our-impact"
              className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition-colors"
            >
              <div className="font-terra-display font-semibold text-urban-black mb-2">
                Notre impact
              </div>
              <div className="font-terra-body text-gray-600 text-sm">
                Engagement environnemental
              </div>
            </a>
            <a
              href="/account"
              className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition-colors"
            >
              <div className="font-terra-display font-semibold text-urban-black mb-2">
                Mon compte
              </div>
              <div className="font-terra-body text-gray-600 text-sm">Gérer mes commandes</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'FAQ - Questions Fréquentes | TERRA - Sneakers Écoresponsables',
    description:
      'Trouvez rapidement les réponses à vos questions sur TERRA : commandes, livraison, retours, tailles, matériaux écoresponsables et plus encore.',
    openGraph: {
      title: 'FAQ - Questions Fréquentes | TERRA',
      description:
        'Trouvez rapidement les réponses à vos questions sur TERRA. Notre équipe a rassemblé les questions les plus fréquentes.',
    },
  }
}
