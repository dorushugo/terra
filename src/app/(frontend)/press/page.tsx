import type { Metadata } from 'next'
import React from 'react'
import { Newspaper, Download, Mail, Camera, Award, TrendingUp, Users, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PressPage() {
  const pressReleases = [
    {
      date: '15 Décembre 2024',
      title: 'TERRA lève 5M€ en série A pour accélérer son expansion européenne',
      summary:
        'La startup française de sneakers écoresponsables annonce une levée de fonds menée par Partech Ventures pour développer sa présence en Europe.',
      downloadUrl: '#',
      featured: true,
    },
    {
      date: '28 Novembre 2024',
      title: 'TERRA obtient la certification B Corp avec un score de 95/100',
      summary:
        "La marque rejoint le mouvement des entreprises à mission avec l'une des meilleures notes obtenues dans le secteur de la mode.",
      downloadUrl: '#',
      featured: false,
    },
    {
      date: '10 Octobre 2024',
      title: 'Lancement de la collection TERRA Limited : 1000 paires en édition limitée',
      summary:
        "La nouvelle collection premium utilise 80% de matériaux recyclés océaniques et s'épuise en moins de 48h.",
      downloadUrl: '#',
      featured: false,
    },
    {
      date: '22 Septembre 2024',
      title: 'TERRA plante son 100 000ème arbre grâce à ses ventes',
      summary:
        "Partenariat avec Reforest'Action : 3 arbres plantés par paire vendue, objectif de 1 million d'arbres d'ici 2026.",
      downloadUrl: '#',
      featured: false,
    },
  ]

  const mediaAssets = [
    {
      category: 'Logos',
      items: [
        { name: 'Logo TERRA - PNG Haute Définition', size: '2.1 MB', format: 'PNG' },
        { name: 'Logo TERRA - Vectoriel', size: '156 KB', format: 'SVG' },
        { name: 'Logo TERRA - Versions couleurs', size: '3.8 MB', format: 'ZIP' },
      ],
    },
    {
      category: 'Photos Produits',
      items: [
        { name: 'Collection Origin - Pack complet', size: '45 MB', format: 'ZIP' },
        { name: 'Collection Move - Pack complet', size: '52 MB', format: 'ZIP' },
        { name: 'Collection Limited - Pack complet', size: '38 MB', format: 'ZIP' },
      ],
    },
    {
      category: 'Photos Équipe',
      items: [
        { name: 'Marie Dubois - CEO', size: '4.2 MB', format: 'JPG' },
        { name: 'Thomas Martin - CTO', size: '3.8 MB', format: 'JPG' },
        { name: 'Photos équipe complète', size: '28 MB', format: 'ZIP' },
      ],
    },
    {
      category: 'Infographies',
      items: [
        { name: 'Impact environnemental TERRA', size: '2.1 MB', format: 'PNG' },
        { name: 'Processus de fabrication', size: '3.4 MB', format: 'PNG' },
        { name: 'Chiffres clés 2024', size: '1.8 MB', format: 'PNG' },
      ],
    },
  ]

  const keyFigures = [
    { number: '50K+', label: 'Paires vendues', period: '2024' },
    { number: '300%', label: 'Croissance', period: 'YoY' },
    { number: '100K', label: 'Arbres plantés', period: 'Total' },
    { number: '60%', label: 'Matériaux recyclés', period: 'Minimum' },
  ]

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-terra-display font-bold text-urban-black mb-4">
            Espace Presse
          </h1>
          <p className="text-lg font-terra-body text-gray-600 max-w-2xl mx-auto">
            Découvrez l'actualité TERRA, nos ressources média et contactez notre équipe presse pour
            vos articles.
          </p>
        </div>

        {/* Contact presse */}
        <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-4">
                Contact Presse
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-terra-green mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-terra-display font-semibold text-urban-black">
                      Relations Presse
                    </p>
                    <a
                      href="mailto:press@terra-sneakers.com"
                      className="text-terra-green hover:underline font-terra-body"
                    >
                      press@terra-sneakers.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-terra-green mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-terra-display font-semibold text-urban-black">Sofia Rossi</p>
                    <p className="font-terra-body text-gray-600 text-sm">
                      Directrice Communication & Marketing
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                Nous sommes disponibles pour
              </h3>
              <ul className="space-y-2 text-sm font-terra-body text-gray-700">
                <li>• Interviews des fondateurs et équipe</li>
                <li>• Démonstrations produits et matériaux</li>
                <li>• Visuels haute définition et contenus exclusifs</li>
                <li>• Données et insights sur l'éco-responsabilité</li>
                <li>• Invitations événements et lancements</li>
                <li>• Partenariats média et collaborations</li>
              </ul>

              <Button className="mt-4 bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold px-6 py-3">
                Nous contacter
              </Button>
            </div>
          </div>
        </div>

        {/* Chiffres clés */}
        <div className="mb-16">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 text-center">
            TERRA en chiffres
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {keyFigures.map((figure, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 text-center"
              >
                <div className="text-3xl font-terra-display font-bold text-terra-green mb-2">
                  {figure.number}
                </div>
                <div className="font-terra-display font-semibold text-urban-black mb-1">
                  {figure.label}
                </div>
                <div className="font-terra-body text-gray-600 text-sm">{figure.period}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Communiqués de presse */}
        <div className="mb-16">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8">
            Communiqués de presse
          </h2>

          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div
                key={index}
                className={`bg-white border rounded-lg p-6 hover:border-terra-green transition-colors ${
                  release.featured ? 'border-terra-green bg-terra-green/5' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-sm font-terra-body text-gray-600">{release.date}</span>
                      {release.featured && (
                        <span className="bg-terra-green text-white text-xs px-2 py-1 rounded-full font-terra-body font-semibold">
                          À la une
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-terra-display font-bold text-urban-black mb-3">
                      {release.title}
                    </h3>

                    <p className="font-terra-body text-gray-700 mb-4">{release.summary}</p>
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <Button
                      variant="outline"
                      className="border-terra-green text-terra-green hover:bg-terra-green hover:text-white font-terra-display font-semibold px-4 py-2 group transition-colors"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ressources média */}
        <div className="mb-16">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8">
            Ressources média
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {mediaAssets.map((category, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-6">
                  <Camera className="h-6 w-6 text-terra-green mr-3" />
                  <h3 className="text-xl font-terra-display font-bold text-urban-black">
                    {category.category}
                  </h3>
                </div>

                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-terra-display font-semibold text-urban-black text-sm">
                          {item.name}
                        </p>
                        <p className="font-terra-body text-gray-600 text-xs">
                          {item.size} • {item.format}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-terra-green hover:bg-terra-green hover:text-white"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="font-terra-body text-gray-600 mb-4">
              Besoin d'autres visuels ou contenus spécifiques ?
            </p>
            <Button
              variant="outline"
              className="border-terra-green text-terra-green hover:bg-terra-green hover:text-white font-terra-display font-semibold px-6 py-3"
            >
              Demander des ressources personnalisées
            </Button>
          </div>
        </div>

        {/* À propos de TERRA */}
        <div className="mb-16">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8">
            À propos de TERRA
          </h2>

          <div className="bg-gray-50 rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  Notre histoire
                </h3>
                <p className="font-terra-body text-gray-700 mb-4 text-sm">
                  Fondée en 2023 par Marie Dubois (ex-Nike Europe) et Thomas Martin (ex-Adidas
                  Innovation), TERRA révolutionne l'industrie des sneakers en prouvant qu'on peut
                  allier style, performance et conscience environnementale.
                </p>
                <p className="font-terra-body text-gray-700 text-sm">
                  Basée à Paris avec une fabrication 100% européenne, TERRA propose trois
                  collections de sneakers fabriquées avec 60% de matériaux recyclés minimum et
                  plante 3 arbres par paire vendue.
                </p>
              </div>

              <div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-4">
                  Nos engagements
                </h3>
                <ul className="space-y-2 text-sm font-terra-body text-gray-700">
                  <li className="flex items-center">
                    <Award className="h-4 w-4 text-terra-green mr-2 flex-shrink-0" />
                    Certification B Corp (score 95/100)
                  </li>
                  <li className="flex items-center">
                    <Globe className="h-4 w-4 text-terra-green mr-2 flex-shrink-0" />
                    Fabrication 100% européenne
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-terra-green mr-2 flex-shrink-0" />
                    60% de matériaux recyclés minimum
                  </li>
                  <li className="flex items-center">
                    <Users className="h-4 w-4 text-terra-green mr-2 flex-shrink-0" />3 arbres
                    plantés par paire vendue
                  </li>
                </ul>

                <div className="mt-6">
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                    Récompenses 2024
                  </h4>
                  <ul className="space-y-1 text-sm font-terra-body text-gray-700">
                    <li>• Prix de l'Innovation Durable - VivaTech 2024</li>
                    <li>• Startup de l'Année - FashionTech Awards</li>
                    <li>• Label "Entreprise à Mission"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Équipe dirigeante */}
        <div className="mb-16">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8">
            Équipe dirigeante
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-20 h-20 bg-terra-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-terra-display font-bold text-white">MD</span>
              </div>
              <h3 className="font-terra-display font-bold text-urban-black mb-2">Marie Dubois</h3>
              <p className="font-terra-body text-terra-green font-semibold mb-3">
                CEO & Co-fondatrice
              </p>
              <p className="font-terra-body text-gray-700 text-sm">
                Ex-Directrice Marketing Nike Europe. 12 ans d'expérience dans l'industrie sneaker.
                Diplômée HEC Paris.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-20 h-20 bg-terra-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-terra-display font-bold text-white">TM</span>
              </div>
              <h3 className="font-terra-display font-bold text-urban-black mb-2">Thomas Martin</h3>
              <p className="font-terra-body text-terra-green font-semibold mb-3">
                CTO & Co-fondateur
              </p>
              <p className="font-terra-body text-gray-700 text-sm">
                Ex-Lead Innovation Adidas. Expert en matériaux durables et processus de fabrication.
                Ingénieur Centrale Paris.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-20 h-20 bg-terra-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-terra-display font-bold text-white">SR</span>
              </div>
              <h3 className="font-terra-display font-bold text-urban-black mb-2">Sofia Rossi</h3>
              <p className="font-terra-body text-terra-green font-semibold mb-3">Head of Design</p>
              <p className="font-terra-body text-gray-700 text-sm">
                Ex-VEJA, spécialiste éco-conception. 8 ans dans le design durable. Diplômée École
                Boulle.
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter presse */}
        <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-4">
            Restez informé de l'actualité TERRA
          </h2>
          <p className="font-terra-body text-gray-700 mb-6">
            Recevez nos communiqués de presse, invitations événements et actualités en
            avant-première.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
            <input
              type="email"
              placeholder="Votre email professionnel"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-terra-green/50 focus:border-terra-green font-terra-body"
              required
            />
            <Button
              type="submit"
              className="bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold px-6 py-3"
            >
              S'abonner
            </Button>
          </form>

          <p className="font-terra-body text-gray-600 text-sm">
            Newsletter mensuelle • Désinscription facile • Pas de spam
          </p>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Espace Presse | TERRA - Sneakers Écoresponsables',
    description:
      "Découvrez l'actualité TERRA, nos communiqués de presse, ressources média et contactez notre équipe presse pour vos articles.",
    openGraph: {
      title: 'Espace Presse | TERRA',
      description:
        "Découvrez l'actualité TERRA, nos ressources média et contactez notre équipe presse pour vos articles.",
    },
  }
}
