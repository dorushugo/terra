import type { Metadata } from 'next'
import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Leaf, Recycle, Globe, Users, Award, TreePine, Droplets, Factory } from 'lucide-react'

export default function OurImpactPage() {
  const environmentalStats = [
    { value: '2.4', unit: 'tonnes CO₂ évitées', icon: Globe },
    { value: '12,000', unit: 'bouteilles recyclées', icon: Recycle },
    { value: '450', unit: 'arbres plantés', icon: TreePine },
    { value: '60%', unit: 'réduction eau', icon: Droplets },
  ]

  const socialStats = [
    { value: '25', unit: 'artisans partenaires', icon: Users },
    { value: '100%', unit: 'salaires équitables', icon: Award },
    { value: '2', unit: 'formations/an', icon: Factory },
    { value: '0', unit: 'accident travail', icon: Award },
  ]

  const approachPillars = [
    {
      title: 'Matériaux Durables',
      description: '60% minimum recyclés/biosourcés',
      actions: ['Cuir végétal', 'Plastique océan', 'Coton bio'],
      image: '/images/impact/materials.jpg',
      progress: 75,
    },
    {
      title: 'Production Éthique',
      description: 'Ateliers européens certifiés',
      actions: ['Salaires +20%', 'Audits réguliers', 'Formation continue'],
      image: '/images/impact/production.jpg',
      progress: 90,
    },
    {
      title: 'Économie Circulaire',
      description: 'Conception durable, réparation, recyclage',
      actions: ['Garantie étendue', 'Service réparation', 'Programme reprise'],
      image: '/images/impact/circular.jpg',
      progress: 65,
    },
    {
      title: 'Transparence Totale',
      description: 'Traçabilité complète, impact mesuré',
      actions: ['Bilan carbone public', 'Traçabilité matériaux', 'Rapport annuel'],
      image: '/images/impact/transparency.jpg',
      progress: 85,
    },
  ]

  const certifications = [
    {
      name: 'B Corp',
      logo: '/images/certifications/bcorp.svg',
      description: 'Entreprise à mission certifiée',
    },
    {
      name: 'GOTS',
      logo: '/images/certifications/gots.svg',
      description: 'Textile biologique global',
    },
    {
      name: 'Cradle to Cradle',
      logo: '/images/certifications/c2c.svg',
      description: 'Économie circulaire',
    },
    {
      name: 'Fair Trade',
      logo: '/images/certifications/fairtrade.svg',
      description: 'Commerce équitable',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-terra-green text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/impact-hero.jpg"
            alt="Notre Impact"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-terra-body mb-6">
            <Leaf className="h-4 w-4" />
            <span>Impact Report 2024</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-terra-display font-bold mb-6">
            Notre Impact
          </h1>
          <p className="text-xl font-terra-body text-white/90 max-w-3xl mx-auto leading-relaxed">
            Transparence totale sur notre démarche environnementale et sociale. Chaque chiffre
            compte, chaque action a du sens.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-terra-display font-bold text-urban-black mb-6">
              Notre impact en chiffres
            </h2>
            <p className="text-lg font-terra-body text-gray-600 leading-relaxed">
              Depuis notre lancement, voici l'impact positif que nous créons ensemble
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Environmental Impact */}
            <div>
              <h3 className="text-2xl font-terra-display font-bold text-urban-black mb-8 flex items-center">
                <Globe className="mr-3 h-6 w-6 text-terra-green" />
                Impact Environnemental
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {environmentalStats.map((stat, index) => (
                  <Card
                    key={index}
                    className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-terra-green/10 rounded-full mb-4">
                        <stat.icon className="h-6 w-6 text-terra-green" />
                      </div>
                      <div className="text-3xl font-terra-display font-bold text-terra-green mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm font-terra-body text-gray-600">{stat.unit}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Social Impact */}
            <div>
              <h3 className="text-2xl font-terra-display font-bold text-urban-black mb-8 flex items-center">
                <Users className="mr-3 h-6 w-6 text-clay-orange" />
                Impact Social
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {socialStats.map((stat, index) => (
                  <Card
                    key={index}
                    className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-clay-orange/10 rounded-full mb-4">
                        <stat.icon className="h-6 w-6 text-clay-orange" />
                      </div>
                      <div className="text-3xl font-terra-display font-bold text-clay-orange mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm font-terra-body text-gray-600">{stat.unit}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Approach Pillars */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-terra-display font-bold text-urban-black mb-6">
              Nos 4 piliers d'action
            </h2>
            <p className="text-lg font-terra-body text-gray-600 leading-relaxed">
              Une approche holistique pour créer un impact positif durable
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {approachPillars.map((pillar, index) => (
              <Card
                key={index}
                className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="mb-2">
                      <div className="flex justify-between items-center text-white text-sm font-terra-body mb-1">
                        <span>Progression</span>
                        <span>{pillar.progress}%</span>
                      </div>
                      <Progress value={pillar.progress} className="h-2" />
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <CardTitle className="text-xl font-terra-display font-bold text-urban-black mb-3">
                    {pillar.title}
                  </CardTitle>
                  <p className="text-gray-600 font-terra-body mb-4">{pillar.description}</p>

                  <div className="space-y-2">
                    <h4 className="text-sm font-terra-display font-semibold text-urban-black">
                      Actions concrètes :
                    </h4>
                    <ul className="space-y-1">
                      {pillar.actions.map((action, actionIndex) => (
                        <li
                          key={actionIndex}
                          className="flex items-center text-sm font-terra-body text-gray-600"
                        >
                          <Leaf className="h-3 w-3 text-terra-green mr-2 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-terra-display font-bold text-urban-black mb-6">
              Nos certifications
            </h2>
            <p className="text-lg font-terra-body text-gray-600 leading-relaxed">
              Des labels reconnus qui garantissent nos engagements
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {certifications.map((cert, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-terra-green/10 transition-colors">
                    <Award className="h-8 w-8 text-terra-green" />
                  </div>
                  <h3 className="font-terra-display font-bold text-urban-black mb-2">
                    {cert.name}
                  </h3>
                  <p className="text-sm font-terra-body text-gray-600">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Calculator */}
      <section className="py-20 bg-terra-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-terra-display font-bold mb-6">
              Calcule ton impact TERRA
            </h2>
            <p className="text-lg font-terra-body text-white/90 mb-8 leading-relaxed">
              Compare l'impact positif de tes achats TERRA à l'industrie classique
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-terra-display font-bold mb-2">2.4kg CO₂</div>
                  <div className="text-sm font-terra-body text-white/80">
                    Économisés par paire vs industrie
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-terra-display font-bold mb-2">5 bouteilles</div>
                  <div className="text-sm font-terra-body text-white/80">
                    Plastique recyclé par paire
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-terra-display font-bold mb-2">3 arbres</div>
                  <div className="text-sm font-terra-body text-white/80">
                    Plantés pour chaque achat
                  </div>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-terra-green hover:bg-white/90 font-terra-display font-semibold px-8 py-6"
            >
              Découvrir nos collections
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-urban-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-terra-display font-bold mb-6">
            Rejoignez le mouvement
          </h2>
          <p className="text-lg font-terra-body text-white/90 mb-8 max-w-2xl mx-auto">
            Chaque paire TERRA vendue contribue à un avenir plus durable. Ensemble, créons l'impact
            de demain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold px-8 py-6"
            >
              Acheter responsable
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-urban-black font-terra-display font-semibold px-8 py-6"
            >
              Télécharger le rapport complet
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Notre Impact - TERRA',
    description:
      "Découvrez l'impact environnemental et social de TERRA. Transparence totale sur nos actions durables : matériaux recyclés, fabrication éthique, économie circulaire.",
    openGraph: {
      title: 'Notre Impact - TERRA',
      description: 'Transparence totale sur notre démarche durable',
      images: ['/images/impact-hero.jpg'],
    },
  }
}
