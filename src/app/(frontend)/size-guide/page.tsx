import type { Metadata } from 'next'
import React from 'react'
import { Ruler, Footprints, Info, CheckCircle, AlertCircle } from 'lucide-react'

export default function SizeGuidePage() {
  const sizeChart = [
    { eu: '36', uk: '3.5', us: '6', cm: '22.5' },
    { eu: '37', uk: '4', us: '6.5', cm: '23' },
    { eu: '38', uk: '4.5', us: '7', cm: '23.5' },
    { eu: '39', uk: '5.5', us: '8', cm: '24.5' },
    { eu: '40', uk: '6', us: '8.5', cm: '25' },
    { eu: '41', uk: '7', us: '9.5', cm: '25.5' },
    { eu: '42', uk: '7.5', us: '10', cm: '26' },
    { eu: '43', uk: '8.5', us: '11', cm: '27' },
    { eu: '44', uk: '9', us: '11.5', cm: '27.5' },
    { eu: '45', uk: '10', us: '12.5', cm: '28' },
  ]

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center">
              <Ruler className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-terra-display font-bold text-urban-black mb-4">
            Guide des Tailles
          </h1>
          <p className="text-lg font-terra-body text-gray-600 max-w-2xl mx-auto">
            Trouvez votre taille parfaite avec TERRA. Nos sneakers sont conçues pour un confort
            optimal et un ajustement précis.
          </p>
        </div>

        {/* Guide rapide */}
        <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-8 mb-12">
          <h2 className="text-xl font-terra-display font-bold text-urban-black mb-6 flex items-center">
            <Footprints className="h-5 w-5 text-terra-green mr-2" />
            Comment mesurer votre pied ?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                Étapes à suivre
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-terra-green text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <p className="font-terra-body text-gray-700">
                    Placez une feuille de papier contre un mur
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-terra-green text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <p className="font-terra-body text-gray-700">
                    Posez votre pied nu contre le mur, talon collé
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-terra-green text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <p className="font-terra-body text-gray-700">
                    Marquez l'extrémité de votre orteil le plus long
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-terra-green text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    4
                  </div>
                  <p className="font-terra-body text-gray-700">
                    Mesurez la distance entre le mur et la marque
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                Conseils importants
              </h3>
              <ul className="space-y-2 text-sm font-terra-body text-gray-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Mesurez en fin de journée (pieds légèrement gonflés)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Mesurez les deux pieds (prenez la plus grande mesure)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Portez vos chaussettes habituelles</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Restez debout, poids réparti sur les deux pieds</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tableau des tailles */}
        <div className="mb-12">
          <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
            Tableau de correspondance des tailles
          </h2>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-terra-display font-semibold text-urban-black">
                      EU
                    </th>
                    <th className="px-6 py-4 text-left font-terra-display font-semibold text-urban-black">
                      UK
                    </th>
                    <th className="px-6 py-4 text-left font-terra-display font-semibold text-urban-black">
                      US
                    </th>
                    <th className="px-6 py-4 text-left font-terra-display font-semibold text-urban-black">
                      Longueur (cm)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.map((size, index) => (
                    <tr key={size.eu} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 font-terra-body text-gray-900 font-semibold">
                        {size.eu}
                      </td>
                      <td className="px-6 py-4 font-terra-body text-gray-700">{size.uk}</td>
                      <td className="px-6 py-4 font-terra-body text-gray-700">{size.us}</td>
                      <td className="px-6 py-4 font-terra-body text-gray-700">{size.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex items-start space-x-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-terra-body text-blue-800 text-sm">
                <strong>Astuce :</strong> Si votre mesure se situe entre deux tailles, nous
                recommandons de prendre la taille supérieure pour un confort optimal.
              </p>
            </div>
          </div>
        </div>

        {/* Spécificités par collection */}
        <div className="mb-12">
          <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
            Spécificités par collection TERRA
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-terra-display font-bold text-urban-black mb-4 text-terra-green">
                TERRA Origin
              </h3>
              <p className="font-terra-body text-gray-700 mb-4 text-sm">
                Coupe classique, forme légèrement arrondie. Convient aux pieds de largeur normale à
                légèrement large.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-terra-body text-gray-600">Largeur :</span>
                  <span className="font-terra-display font-semibold">Standard</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-terra-body text-gray-600">Ajustement :</span>
                  <span className="font-terra-display font-semibold">Fidèle à la taille</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-terra-body text-gray-600">Conseil :</span>
                  <span className="font-terra-display font-semibold text-terra-green">
                    Taille habituelle
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-terra-display font-bold text-urban-black mb-4 text-terra-green">
                TERRA Move
              </h3>
              <p className="font-terra-body text-gray-700 mb-4 text-sm">
                Coupe sport, forme plus technique. Conçue pour le mouvement avec un maintien
                renforcé.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-terra-body text-gray-600">Largeur :</span>
                  <span className="font-terra-display font-semibold">Standard</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-terra-body text-gray-600">Ajustement :</span>
                  <span className="font-terra-display font-semibold">Légèrement serré</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-terra-body text-gray-600">Conseil :</span>
                  <span className="font-terra-display font-semibold text-terra-green">
                    +0.5 si entre 2 tailles
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-terra-display font-bold text-urban-black mb-4 text-terra-green">
                TERRA Limited
              </h3>
              <p className="font-terra-body text-gray-700 mb-4 text-sm">
                Coupe premium, matériaux nobles. Forme élégante qui s'assouplit avec le temps.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-terra-body text-gray-600">Largeur :</span>
                  <span className="font-terra-display font-semibold">Standard à étroit</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-terra-body text-gray-600">Ajustement :</span>
                  <span className="font-terra-display font-semibold">Fidèle, s'assouplit</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-terra-body text-gray-600">Conseil :</span>
                  <span className="font-terra-display font-semibold text-terra-green">
                    Taille habituelle
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Largeurs de pieds */}
        <div className="mb-12">
          <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
            Guide des largeurs
          </h2>

          <div className="bg-gray-50 rounded-lg p-8">
            <p className="font-terra-body text-gray-700 mb-6">
              Nos sneakers TERRA sont conçues pour s'adapter à différentes largeurs de pieds. Voici
              comment identifier la vôtre :
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-terra-display font-bold text-blue-600">B</span>
                </div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-2">
                  Pied étroit
                </h3>
                <p className="font-terra-body text-gray-600 text-sm">
                  Vous avez souvent besoin de serrer fort les lacets. Recommandation : taille
                  habituelle.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-terra-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-terra-display font-bold text-terra-green">D</span>
                </div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-2">
                  Pied standard
                </h3>
                <p className="font-terra-body text-gray-600 text-sm">
                  La plupart des chaussures vous vont bien. Recommandation : taille habituelle.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-terra-display font-bold text-orange-600">E</span>
                </div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-2">
                  Pied large
                </h3>
                <p className="font-terra-body text-gray-600 text-sm">
                  Vous ressentez souvent une pression sur les côtés. Recommandation : +0.5 taille.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Tailles */}
        <div className="mb-12">
          <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6">
            Questions fréquentes sur les tailles
          </h2>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-terra-display font-semibold text-urban-black mb-3">
                Que faire si je suis entre deux tailles ?
              </h3>
              <p className="font-terra-body text-gray-700">
                Nous recommandons généralement de prendre la taille supérieure, surtout si vous avez
                les pieds larges ou si vous portez des chaussettes épaisses. Pour les modèles TERRA
                Move (sport), privilégiez systématiquement la demi-taille au-dessus.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-terra-display font-semibold text-urban-black mb-3">
                Les tailles TERRA correspondent-elles aux autres marques ?
              </h3>
              <p className="font-terra-body text-gray-700">
                Nos tailles correspondent globalement aux standards européens. Si vous portez du 42
                chez Nike ou Adidas, vous devriez porter du 42 chez TERRA. Cependant, chaque
                collection a ses spécificités (voir ci-dessus).
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-terra-display font-semibold text-urban-black mb-3">
                Puis-je échanger si la taille ne convient pas ?
              </h3>
              <p className="font-terra-body text-gray-700">
                Absolument ! Vous disposez de 30 jours pour retourner ou échanger vos sneakers
                TERRA. L'échange de taille est gratuit en France métropolitaine. Consultez notre
                page
                <a href="/shipping" className="text-terra-green hover:underline font-semibold">
                  {' '}
                  Livraison & Retours
                </a>{' '}
                pour plus d'informations.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-terra-display font-semibold text-urban-black mb-3">
                Les sneakers TERRA se détendent-elles avec le temps ?
              </h3>
              <p className="font-terra-body text-gray-700">
                Nos sneakers en matériaux naturels (collection Limited notamment) s'assouplissent
                légèrement avec le port, surtout au niveau de la largeur. Les modèles en matériaux
                techniques (Origin et Move) gardent leur forme initiale plus longtemps.
              </p>
            </div>
          </div>
        </div>

        {/* Aide personnalisée */}
        <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-terra-display font-bold text-urban-black mb-4">
            Besoin d'aide pour choisir votre taille ?
          </h2>
          <p className="font-terra-body text-gray-700 mb-6">
            Notre équipe est là pour vous conseiller personnellement sur le choix de votre taille
            TERRA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/contact"
              className="bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Nous contacter
            </a>
            <a
              href="mailto:hello@terra-sneakers.com"
              className="border border-terra-green text-terra-green hover:bg-terra-green hover:text-white font-terra-display font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Email direct
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Guide des Tailles | TERRA - Sneakers Écoresponsables',
    description:
      'Trouvez votre taille parfaite avec le guide des tailles TERRA. Tableau de correspondance, conseils par collection et aide personnalisée.',
    openGraph: {
      title: 'Guide des Tailles | TERRA',
      description:
        'Trouvez votre taille parfaite avec TERRA. Nos sneakers sont conçues pour un confort optimal et un ajustement précis.',
    },
  }
}
