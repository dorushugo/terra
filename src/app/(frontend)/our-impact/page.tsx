import type { Metadata } from 'next'
import React from 'react'
import {
  Leaf,
  Globe,
  Users,
  Award,
  TreePine,
  Droplets,
  Recycle,
  Factory,
  Target,
  TrendingUp,
  Heart,
  Shield,
  CheckCircle,
  ArrowRight,
  BarChart3,
  MapPin,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OurImpactPage() {
  const impactStats = [
    {
      category: 'Environnemental',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      stats: [
        { value: '100K+', label: 'Arbres plantés', icon: TreePine },
        { value: '2.4T', label: 'CO₂ évitées', icon: Globe },
        { value: '300K', label: 'Bouteilles recyclées', icon: Recycle },
        { value: '60%', label: 'Réduction eau', icon: Droplets },
      ],
    },
    {
      category: 'Social',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      stats: [
        { value: '150+', label: 'Artisans partenaires', icon: Users },
        { value: '100%', label: 'Salaires équitables', icon: Award },
        { value: '12', label: 'Formations annuelles', icon: Factory },
        { value: '0', label: 'Accident de travail', icon: Shield },
      ],
    },
  ]

  const milestones = [
    {
      year: '2023',
      title: 'Création de TERRA',
      description: 'Lancement de la première collection Origin avec 60% de matériaux recyclés',
      achievements: [
        '500 premières paires vendues',
        'Certification B Corp obtenue',
        '1500 arbres plantés',
      ],
    },
    {
      year: '2024',
      title: 'Expansion européenne',
      description: 'Développement des collections Move et Limited, partenariats durables renforcés',
      achievements: [
        '50K paires vendues',
        'Certification GOTS',
        '100K arbres plantés',
        'Zéro déchet atelier',
      ],
    },
    {
      year: '2025',
      title: 'Objectifs 2025',
      description: 'Ambitions pour une croissance responsable et un impact décuplé',
      achievements: [
        '200K paires objectif',
        '1M arbres plantés',
        '100% énergie verte',
        'Économie circulaire',
      ],
    },
  ]

  const initiatives = [
    {
      title: 'Programme de Plantation',
      description: "Partenariat avec Reforest'Action",
      icon: TreePine,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      details: [
        '3 arbres plantés par paire vendue',
        'Projets de reforestation en Europe et Afrique',
        'Suivi GPS de chaque arbre planté',
        'Certificats de plantation pour nos clients',
      ],
      impact: '100 000 arbres plantés à ce jour',
    },
    {
      title: 'Matériaux Océaniques',
      description: 'Transformation des déchets marins',
      icon: Droplets,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      details: [
        'Plastique récupéré dans les océans',
        'Partenariat avec Seaqual Initiative',
        '5 bouteilles recyclées par paire',
        'Nettoyage des côtes méditerranéennes',
      ],
      impact: '300 000 bouteilles sauvées des océans',
    },
    {
      title: 'Production Éthique',
      description: 'Ateliers certifiés européens',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      details: [
        'Salaires 20% au-dessus du marché',
        'Conditions de travail exemplaires',
        'Formation continue des artisans',
        'Audits sociaux trimestriels',
      ],
      impact: '150 artisans dans 5 ateliers partenaires',
    },
    {
      title: 'Économie Circulaire',
      description: 'Cycle de vie prolongé',
      icon: Recycle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      details: [
        'Service de réparation gratuit',
        'Programme de reprise des anciennes paires',
        'Reconditionnement et don aux associations',
        'Matériaux 100% recyclables en fin de vie',
      ],
      impact: '2 000 paires réparées, 500 reconditionnées',
    },
  ]

  const certifications = [
    {
      name: 'B Corp Certified',
      score: '95/100',
      description: 'Entreprise à mission avec impact social et environnemental vérifié',
      details: [
        'Score parmi les 5% meilleurs au monde',
        'Gouvernance transparente',
        'Impact environnemental mesuré',
        'Responsabilité sociale prouvée',
      ],
    },
    {
      name: 'GOTS Certified',
      score: 'Niveau 1',
      description: 'Global Organic Textile Standard pour nos matières textiles biologiques',
      details: [
        'Fibres biologiques certifiées',
        'Critères environnementaux stricts',
        'Critères sociaux respectés',
        'Traçabilité complète de la chaîne',
      ],
    },
    {
      name: 'Fair Trade',
      score: 'Premium',
      description: 'Commerce équitable pour tous nos partenaires de production',
      details: [
        'Prix équitable garanti',
        'Prime de développement communautaire',
        'Standards de travail respectés',
        'Développement durable local',
      ],
    },
    {
      name: 'Carbon Neutral',
      score: '2024',
      description: "Neutralité carbone certifiée sur l'ensemble de nos opérations",
      details: [
        'Émissions mesurées et compensées',
        'Projets de compensation vérifiés',
        'Réduction continue de notre empreinte',
        "Objectif zéro émission nette d'ici 2030",
      ],
    },
  ]

  const partnerships = [
    {
      name: "Reforest'Action",
      type: 'Reforestation',
      description: 'Plantation et protection des forêts',
      location: 'France, Espagne, Sénégal',
      since: '2023',
    },
    {
      name: 'Seaqual Initiative',
      type: 'Océans',
      description: 'Récupération plastique marin',
      location: 'Méditerranée',
      since: '2023',
    },
    {
      name: 'Atelier Verde',
      type: 'Production',
      description: 'Fabrication éthique Portugal',
      location: 'Porto, Portugal',
      since: '2023',
    },
    {
      name: 'Cuir Végétal+',
      type: 'Matériaux',
      description: 'Alternatives cuir innovantes',
      location: 'Toscane, Italie',
      since: '2024',
    },
  ]

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-terra-display font-bold text-urban-black mb-4">
            Notre Impact
          </h1>
          <p className="text-lg font-terra-body text-gray-600 max-w-3xl mx-auto">
            Transparence totale sur notre démarche environnementale et sociale. Chaque chiffre
            compte, chaque action a du sens. Découvrez comment TERRA révolutionne l'industrie
            sneaker.
          </p>
        </div>

        {/* Badge Impact */}
        <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-8 mb-16 text-center">
          <div className="flex items-center justify-center mb-4">
            <Award className="h-8 w-8 text-terra-green mr-3" />
            <span className="text-2xl font-terra-display font-bold text-urban-black">
              Certification B Corp - Score 95/100
            </span>
          </div>
          <p className="font-terra-body text-gray-700">
            Parmi les 5% d'entreprises les plus engagées au monde pour l'impact social et
            environnemental
          </p>
        </div>

        {/* Statistiques d'impact */}
        <div className="mb-20">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 text-center">
            Notre impact en chiffres
          </h2>

          <div className="space-y-12">
            {impactStats.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className={`text-xl font-terra-display font-semibold mb-6 ${category.color}`}>
                  Impact {category.category}
                </h3>
                <div className="grid md:grid-cols-4 gap-6">
                  {category.stats.map((stat, statIndex) => (
                    <div
                      key={statIndex}
                      className={`${category.bgColor} rounded-lg p-6 text-center hover:shadow-lg transition-shadow`}
                    >
                      <div
                        className={`w-12 h-12 ${category.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <stat.icon className={`h-6 w-6 ${category.color}`} />
                      </div>
                      <div
                        className={`text-3xl font-terra-display font-bold ${category.color} mb-2`}
                      >
                        {stat.value}
                      </div>
                      <div className="font-terra-body text-gray-700 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline des étapes */}
        <div className="mb-20">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 text-center">
            Notre parcours d'impact
          </h2>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex flex-col lg:flex-row items-start gap-8">
                <div className="lg:w-1/4 flex-shrink-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-terra-green rounded-full flex items-center justify-center">
                      <span className="text-white font-terra-display font-bold text-lg">
                        {milestone.year}
                      </span>
                    </div>
                    <div className="hidden lg:block w-full h-px bg-gray-200"></div>
                  </div>
                </div>

                <div className="lg:w-3/4 bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-terra-display font-bold text-urban-black mb-3">
                    {milestone.title}
                  </h3>
                  <p className="font-terra-body text-gray-700 mb-4">{milestone.description}</p>

                  <div className="grid md:grid-cols-2 gap-3">
                    {milestone.achievements.map((achievement, achievementIndex) => (
                      <div key={achievementIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-terra-green flex-shrink-0" />
                        <span className="font-terra-body text-gray-700 text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Initiatives détaillées */}
        <div className="mb-20">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 text-center">
            Nos initiatives phares
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {initiatives.map((initiative, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div
                    className={`w-12 h-12 ${initiative.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <initiative.icon className={`h-6 w-6 ${initiative.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-terra-display font-bold text-urban-black mb-2">
                      {initiative.title}
                    </h3>
                    <p className="font-terra-body text-gray-600 text-sm">
                      {initiative.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {initiative.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-terra-green mt-0.5 flex-shrink-0" />
                      <span className="font-terra-body text-gray-700 text-sm">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className={`${initiative.bgColor} rounded-lg p-4`}>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className={`h-4 w-4 ${initiative.color}`} />
                    <span
                      className={`font-terra-display font-semibold ${initiative.color} text-sm`}
                    >
                      {initiative.impact}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications détaillées */}
        <div className="mb-20">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 text-center">
            Nos certifications et labels
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-terra-display font-bold text-urban-black">
                    {cert.name}
                  </h3>
                  <div className="bg-terra-green text-white text-sm font-terra-display font-semibold px-3 py-1 rounded-full">
                    {cert.score}
                  </div>
                </div>

                <p className="font-terra-body text-gray-700 mb-4 text-sm">{cert.description}</p>

                <div className="space-y-2">
                  {cert.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-terra-green mt-0.5 flex-shrink-0" />
                      <span className="font-terra-body text-gray-600 text-sm">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partenaires */}
        <div className="mb-20">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 text-center">
            Nos partenaires d'impact
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {partnerships.map((partner, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-terra-display font-bold text-urban-black">
                      {partner.name}
                    </h3>
                    <span className="text-sm font-terra-body text-terra-green font-semibold">
                      {partner.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm font-terra-body text-gray-500 mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Depuis {partner.since}
                    </div>
                  </div>
                </div>

                <p className="font-terra-body text-gray-700 text-sm mb-3">{partner.description}</p>

                <div className="flex items-center text-sm font-terra-body text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {partner.location}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculateur d'impact */}
        <div className="bg-terra-green rounded-lg p-8 mb-20 text-white text-center">
          <h2 className="text-3xl font-terra-display font-bold mb-4">
            Calculez votre impact TERRA
          </h2>
          <p className="font-terra-body text-white/90 mb-8 max-w-2xl mx-auto">
            Chaque paire TERRA que vous achetez contribue directement à un avenir plus durable.
            Découvrez l'impact positif de vos choix.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-terra-display font-bold mb-2">2.4 kg</div>
              <div className="text-sm font-terra-body text-white/80">
                CO₂ évités vs industrie classique
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-terra-display font-bold mb-2">5 bouteilles</div>
              <div className="text-sm font-terra-body text-white/80">
                Plastique océanique recyclé
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-terra-display font-bold mb-2">3 arbres</div>
              <div className="text-sm font-terra-body text-white/80">Plantés automatiquement</div>
            </div>
          </div>

          <Button className="bg-white text-terra-green hover:bg-white/90 font-terra-display font-semibold px-8 py-3">
            Découvrir nos collections
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Rapport annuel */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-4">
            Rapport d'impact complet
          </h2>
          <p className="font-terra-body text-gray-700 mb-6">
            Téléchargez notre rapport annuel 2024 pour découvrir tous les détails de nos actions
            environnementales et sociales, nos objectifs et nos résultats mesurés.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="outline"
              className="border-terra-green text-terra-green hover:bg-terra-green hover:text-white font-terra-display font-semibold px-6 py-3"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Télécharger le rapport PDF
            </Button>
            <a href="/contact" className="font-terra-body text-terra-green hover:underline">
              Questions sur notre impact ? Contactez-nous
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Notre Impact | TERRA - Sneakers Écoresponsables',
    description:
      "Découvrez l'impact environnemental et social de TERRA. 100K arbres plantés, 300K bouteilles recyclées, certification B Corp 95/100. Transparence totale sur nos actions durables.",
    openGraph: {
      title: 'Notre Impact | TERRA',
      description:
        'Transparence totale sur notre démarche environnementale et sociale. Chaque chiffre compte, chaque action a du sens.',
    },
  }
}
