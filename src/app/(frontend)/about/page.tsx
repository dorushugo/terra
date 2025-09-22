import type { Metadata } from 'next'
import React from 'react'
import {
  Users,
  Heart,
  Target,
  Award,
  Leaf,
  Globe,
  Lightbulb,
  TrendingUp,
  MapPin,
  Calendar,
  Building,
  Mail,
  Linkedin,
  ArrowRight,
  CheckCircle,
  Star,
  Briefcase,
  GraduationCap,
  Clock,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  const foundingStory = [
    {
      year: '2022',
      title: 'La prise de conscience',
      description: "Marie et Thomas se rencontrent lors d'une conférence sur la mode durable",
      details: [
        'Constat : 24 milliards de paires de chaussures produites par an',
        '85% finissent dans des décharges en moins de 2 ans',
        'Industrie responsable de 1,4% des émissions mondiales de CO₂',
      ],
    },
    {
      year: '2023',
      title: 'La naissance de TERRA',
      description: 'Création officielle de TERRA avec Sofia comme Head of Design',
      details: [
        'Levée de fonds de 500K€ en pré-seed',
        'Premiers prototypes avec 60% de matériaux recyclés',
        'Certification B Corp obtenue dès le lancement',
      ],
    },
    {
      year: '2024',
      title: 'Le décollage',
      description: 'Lancement commercial et expansion européenne',
      details: [
        '50K paires vendues en 12 mois',
        'Équipe de 25 personnes passionnées',
        '100K arbres plantés grâce à nos clients',
      ],
    },
  ]

  const team = [
    {
      name: 'Marie Dubois',
      role: 'CEO & Co-fondatrice',
      bio: 'Ancienne Directrice Marketing Europe chez Nike pendant 8 ans. Diplômée HEC Paris, spécialisée en développement durable. Passionnée de trail et de mode éthique.',
      experience: "12 ans dans l'industrie sneaker",
      education: 'HEC Paris - MBA Développement Durable',
      previous: 'Ex-Nike Europe, Ex-Patagonia',
      quote: 'La mode peut être une force positive pour changer le monde',
      achievements: [
        'Lancement de 15 collections durables chez Nike',
        'Prix "Femme Entrepreneur de l\'Année 2024"',
        'Speaker TEDx sur la mode responsable',
      ],
    },
    {
      name: 'Thomas Martin',
      role: 'CTO & Co-fondateur',
      bio: 'Expert en matériaux innovants, ancien Lead R&D chez Adidas. Ingénieur Centrale Paris, spécialisé en chimie verte et éco-conception.',
      experience: '10 ans en innovation matériaux',
      education: 'Centrale Paris - Ingénieur Chimie',
      previous: 'Ex-Adidas Innovation Lab, Ex-BASF',
      quote: "L'innovation durable est l'avenir de l'industrie",
      achievements: [
        '12 brevets en matériaux écoresponsables',
        'Développement du plastique océanique recyclé',
        'Prix Innovation Durable VivaTech 2023',
      ],
    },
    {
      name: 'Sofia Rossi',
      role: 'Head of Design',
      bio: "Designer passionnée d'éco-conception, ancienne de VEJA. Diplômée Parsons School of Design, vision avant-gardiste du design durable et esthétique.",
      experience: '8 ans en design durable',
      education: 'Parsons School of Design - Fashion Design',
      previous: 'Ex-VEJA, Ex-Stella McCartney',
      quote: "Le beau et le durable ne font qu'un",
      achievements: [
        '3 collections primées internationalement',
        'Design Award "Sustainable Fashion 2024"',
        'Mentor pour jeunes designers écoresponsables',
      ],
    },
    {
      name: 'Lucas Chen',
      role: 'Head of Operations',
      bio: "Expert en supply chain éthique, ancien McKinsey. Spécialisé dans l'optimisation des chaînes d'approvisionnement durables et transparentes.",
      experience: '7 ans en supply chain',
      education: 'ESSEC - Supply Chain Management',
      previous: 'Ex-McKinsey, Ex-Unilever',
      quote: 'La transparence est la clé de la confiance',
      achievements: [
        "Réduction de 40% de l'empreinte carbone logistique",
        'Mise en place de la traçabilité 100% transparente',
        'Certification Fair Trade pour tous nos partenaires',
      ],
    },
    {
      name: 'Emma Larsson',
      role: 'Head of Sustainability',
      bio: "Experte en développement durable, ancienne consultante climat. Docteure en Sciences Environnementales, elle pilote notre stratégie d'impact.",
      experience: '9 ans en durabilité',
      education: 'Sorbonne - Doctorat Sciences Environnementales',
      previous: 'Ex-Carbone 4, Ex-WWF',
      quote: 'Mesurer pour mieux agir',
      achievements: [
        'Neutralité carbone certifiée de TERRA',
        "Méthodologie de mesure d'impact reconnue",
        'Conférencière COP28 sur la mode durable',
      ],
    },
    {
      name: 'Antoine Dubois',
      role: 'Head of Marketing',
      bio: "Stratège marketing digital, ancien Publicis. Expert en communication d'impact et storytelling de marques engagées.",
      experience: "6 ans en marketing d'impact",
      education: 'ESCP - Marketing Digital',
      previous: 'Ex-Publicis, Ex-Patagonia Europe',
      quote: "Raconter l'impact pour inspirer le changement",
      achievements: [
        '+300% de croissance organique en 18 mois',
        'Campagne "Grounded in Purpose" primée',
        'Community de 100K+ ambassadeurs engagés',
      ],
    },
  ]

  const values = [
    {
      icon: Heart,
      title: 'Conscious',
      subtitle: 'Conscience environnementale',
      description:
        'Chaque décision est prise en considérant son impact sur la planète et les générations futures. Nous mesurons, analysons et optimisons continuellement notre empreinte.',
      examples: [
        'Analyse de cycle de vie de chaque produit',
        'Choix de matériaux selon leur impact carbone',
        'Partenaires sélectionnés pour leur engagement',
        'Transparence totale sur nos pratiques',
      ],
    },
    {
      icon: Award,
      title: 'Crafted',
      subtitle: 'Savoir-faire artisanal',
      description:
        'Nous privilégions la qualité et le savoir-faire traditionnel européen pour créer des produits durables qui traversent le temps.',
      examples: [
        'Ateliers familiaux européens 3ème génération',
        'Techniques artisanales préservées',
        'Contrôle qualité à chaque étape',
        'Garantie étendue sur tous nos produits',
      ],
    },
    {
      icon: Users,
      title: 'Community',
      subtitle: 'Impact social positif',
      description:
        'Notre communauté et nos partenaires sont au cœur de notre démarche pour un commerce plus équitable et inclusif.',
      examples: [
        'Salaires équitables pour tous nos partenaires',
        'Formation continue des artisans',
        'Soutien aux communautés locales',
        'Programme de mentorat jeunes entrepreneurs',
      ],
    },
    {
      icon: Target,
      title: 'Circular',
      subtitle: 'Économie circulaire',
      description:
        'Nous repensons le cycle de vie du produit pour minimiser les déchets et maximiser la réutilisation, réparation et recyclage.',
      examples: [
        'Service de réparation gratuit à vie',
        'Programme de reprise des anciennes paires',
        'Matériaux 100% recyclables en fin de vie',
        'Emballages réutilisables et compostables',
      ],
    },
  ]

  const milestones = [
    {
      date: 'Mars 2023',
      title: 'Première collection Origin',
      description: '500 paires vendues en 2 semaines',
      icon: Star,
    },
    {
      date: 'Juin 2023',
      title: 'Certification B Corp',
      description: 'Score de 95/100, top 5% mondial',
      icon: Award,
    },
    {
      date: 'Sept 2023',
      title: '10 000 arbres plantés',
      description: 'Objectif premier atteint',
      icon: Leaf,
    },
    {
      date: 'Déc 2023',
      title: 'Collection Move lancée',
      description: 'Expansion vers le sport urbain',
      icon: Zap,
    },
    {
      date: 'Mars 2024',
      title: '25 000 paires vendues',
      description: 'Croissance de 400% en 6 mois',
      icon: TrendingUp,
    },
    {
      date: 'Juin 2024',
      title: 'Levée série A - 5M€',
      description: 'Expansion européenne financée',
      icon: Target,
    },
    {
      date: 'Sept 2024',
      title: 'Collection Limited',
      description: '1000 paires épuisées en 48h',
      icon: Star,
    },
    {
      date: 'Nov 2024',
      title: '100 000 arbres plantés',
      description: 'Impact environnemental majeur',
      icon: Globe,
    },
  ]

  const partners = [
    {
      name: 'Atelier Verde',
      location: 'Porto, Portugal',
      since: '2023',
      type: 'Production',
      description: 'Atelier familial spécialisé en maroquinerie durable depuis 1952',
      details: [
        "3ème génération d'artisans",
        'Certification Fair Trade',
        'Zéro déchet depuis 2020',
        '45 artisans employés',
      ],
      impact: 'Salaires 20% au-dessus du marché local',
    },
    {
      name: "Reforest'Action",
      location: 'France, Espagne, Sénégal',
      since: '2023',
      type: 'Reforestation',
      description: 'Plateforme européenne de reforestation et protection des forêts',
      details: [
        'Projets certifiés internationalement',
        'Suivi GPS de chaque arbre',
        'Impact social local mesuré',
        'Biodiversité préservée',
      ],
      impact: '100 000 arbres plantés via TERRA',
    },
    {
      name: 'Seaqual Initiative',
      location: 'Méditerranée',
      since: '2023',
      type: 'Matériaux océaniques',
      description: 'Organisation transformant les déchets marins en matières premières',
      details: [
        'Nettoyage des côtes méditerranéennes',
        'Transformation en fil recyclé',
        'Traçabilité complète garantie',
        'Impact océanique mesurable',
      ],
      impact: '300 000 bouteilles sauvées des océans',
    },
    {
      name: 'Bio Leather Lab',
      location: 'Toscane, Italie',
      since: '2024',
      type: 'Innovation matériaux',
      description: 'Laboratoire pionnier en alternatives cuir végétales',
      details: [
        'Cuir de champignon et ananas',
        'Recherche & développement continue',
        'Certification biodégradable',
        'Innovation collaborative',
      ],
      impact: '80% réduction empreinte vs cuir animal',
    },
  ]

  const culture = [
    {
      title: 'Remote-first',
      description: 'Flexibilité et équilibre vie pro/perso',
      icon: Globe,
      details: '3 jours en remote par semaine, bureaux modernes à Paris',
    },
    {
      title: 'Impact-driven',
      description: 'Chaque décision mesurée selon son impact',
      icon: Target,
      details: 'OKRs incluant des métriques environnementales et sociales',
    },
    {
      title: 'Learning culture',
      description: 'Formation continue et développement personnel',
      icon: GraduationCap,
      details: '2000€/an par personne pour formations et conférences',
    },
    {
      title: 'Transparence',
      description: 'Communication ouverte et feedback régulier',
      icon: Heart,
      details: "Réunions d'équipe hebdomadaires et feedback 360°",
    },
  ]

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-terra-display font-bold text-urban-black mb-4">
            À propos de TERRA
          </h1>
          <p className="text-lg font-terra-body text-gray-600 max-w-3xl mx-auto">
            L'histoire d'une équipe passionnée qui révolutionne l'industrie sneaker. Découvrez notre
            mission, nos valeurs et les visages derrière TERRA.
          </p>
        </div>

        {/* Histoire de création */}
        <div className="mb-20">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 text-center">
            Notre histoire
          </h2>

          <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-8 mb-12">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-terra-display font-bold text-urban-black mb-4">
                  Le déclic fondateur
                </h3>
                <p className="font-terra-body text-gray-700 mb-4">
                  "Pourquoi devrait-on choisir entre style et conscience ?" Cette question, posée
                  lors d'une conférence sur la mode durable en 2022, a marqué le début de l'aventure
                  TERRA.
                </p>
                <p className="font-terra-body text-gray-700">
                  Marie Dubois et Thomas Martin, forts de leur expérience chez Nike et Adidas, ont
                  décidé de prouver qu'une sneaker peut être à la fois tendance, durable et
                  accessible.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {foundingStory.map((story, index) => (
              <div key={index} className="flex flex-col lg:flex-row items-start gap-8">
                <div className="lg:w-1/4 flex-shrink-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-terra-green rounded-full flex items-center justify-center">
                      <span className="text-white font-terra-display font-bold text-lg">
                        {story.year}
                      </span>
                    </div>
                    <div className="hidden lg:block w-full h-px bg-gray-200"></div>
                  </div>
                </div>

                <div className="lg:w-3/4 bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-terra-display font-bold text-urban-black mb-3">
                    {story.title}
                  </h3>
                  <p className="font-terra-body text-gray-700 mb-4">{story.description}</p>

                  <div className="space-y-2">
                    {story.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-terra-green mt-0.5 flex-shrink-0" />
                        <span className="font-terra-body text-gray-600 text-sm">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <Target className="h-8 w-8 text-terra-green mr-3" />
              <h2 className="text-2xl font-terra-display font-bold text-urban-black">
                Notre Mission
              </h2>
            </div>
            <p className="font-terra-body text-gray-700 mb-6 text-lg">
              Révolutionner l'industrie sneaker en prouvant qu'on peut être stylé, responsable et
              accessible simultanément.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-terra-green" />
                <span className="font-terra-body text-gray-600 text-sm">
                  Démocratiser la mode durable
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-terra-green" />
                <span className="font-terra-body text-gray-600 text-sm">
                  Inspirer une consommation consciente
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-terra-green" />
                <span className="font-terra-body text-gray-600 text-sm">
                  Transformer l'industrie de l'intérieur
                </span>
              </div>
            </div>
          </div>

          <div className="bg-clay-orange/5 border border-clay-orange/20 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <Leaf className="h-8 w-8 text-clay-orange mr-3" />
              <h2 className="text-2xl font-terra-display font-bold text-urban-black">
                Notre Vision
              </h2>
            </div>
            <p className="font-terra-body text-gray-700 mb-6 text-lg">
              Devenir LA référence durable pour une génération qui veut du style sans compromis sur
              ses valeurs.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-clay-orange" />
                <span className="font-terra-body text-gray-600 text-sm">
                  Leader européen de la sneaker durable
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-clay-orange" />
                <span className="font-terra-body text-gray-600 text-sm">
                  Synonyme d'innovation et transparence
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-clay-orange" />
                <span className="font-terra-body text-gray-600 text-sm">
                  Impact positif mesurable et reconnu
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Valeurs détaillées */}
        <div className="mb-20">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 text-center">
            Nos 4 valeurs fondamentales
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-terra-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <value.icon className="h-6 w-6 text-terra-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-terra-display font-bold text-urban-black mb-2">
                      {value.title}
                    </h3>
                    <p className="text-terra-green font-terra-body font-semibold text-sm">
                      {value.subtitle}
                    </p>
                  </div>
                </div>

                <p className="font-terra-body text-gray-700 mb-6">{value.description}</p>

                <div className="space-y-2">
                  <h4 className="font-terra-display font-semibold text-urban-black text-sm mb-3">
                    Exemples concrets :
                  </h4>
                  {value.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-terra-green mt-0.5 flex-shrink-0" />
                      <span className="font-terra-body text-gray-600 text-sm">{example}</span>
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
            Les étapes clés de notre croissance
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <milestone.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-sm font-terra-body text-terra-green font-semibold mb-2">
                  {milestone.date}
                </div>
                <h3 className="font-terra-display font-bold text-urban-black mb-2 text-sm">
                  {milestone.title}
                </h3>
                <p className="font-terra-body text-gray-600 text-xs">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Équipe détaillée */}
        <div className="mb-20">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 text-center">
            L'équipe dirigeante
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="flex items-start space-x-6 mb-6">
                  <div className="w-20 h-20 bg-terra-green rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-terra-display font-bold text-lg">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-terra-display font-bold text-urban-black mb-1">
                      {member.name}
                    </h3>
                    <p className="text-terra-green font-terra-body font-semibold text-sm mb-2">
                      {member.role}
                    </p>
                    <div className="flex items-center space-x-4 text-xs font-terra-body text-gray-500">
                      <div className="flex items-center">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {member.experience}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="font-terra-body text-gray-700 text-sm mb-4">{member.bio}</p>

                <div className="bg-terra-green/5 rounded-lg p-4 mb-4">
                  <p className="font-terra-body text-terra-green text-sm italic">
                    "{member.quote}"
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-terra-display font-semibold text-urban-black text-xs mb-2">
                      Formation & Expérience :
                    </h4>
                    <div className="space-y-1 text-xs font-terra-body text-gray-600">
                      <div className="flex items-center">
                        <GraduationCap className="h-3 w-3 mr-2 text-terra-green" />
                        {member.education}
                      </div>
                      <div className="flex items-center">
                        <Building className="h-3 w-3 mr-2 text-terra-green" />
                        {member.previous}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-terra-display font-semibold text-urban-black text-xs mb-2">
                      Réalisations clés :
                    </h4>
                    <div className="space-y-1">
                      {member.achievements.map((achievement, achievementIndex) => (
                        <div key={achievementIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-3 w-3 text-terra-green mt-0.5 flex-shrink-0" />
                          <span className="font-terra-body text-gray-600 text-xs">
                            {achievement}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partenaires détaillés */}
        <div className="mb-20">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 text-center">
            Nos partenaires d'impact
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-terra-display font-bold text-urban-black mb-1">
                      {partner.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm font-terra-body text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {partner.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Depuis {partner.since}
                      </div>
                    </div>
                  </div>
                  <span className="bg-terra-green/20 text-terra-green text-xs px-2 py-1 rounded-full font-terra-body font-semibold">
                    {partner.type}
                  </span>
                </div>

                <p className="font-terra-body text-gray-700 text-sm mb-4">{partner.description}</p>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-terra-display font-semibold text-urban-black text-sm mb-2">
                      Caractéristiques :
                    </h4>
                    <div className="space-y-1">
                      {partner.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-terra-green mt-0.5 flex-shrink-0" />
                          <span className="font-terra-body text-gray-600 text-sm">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-terra-green/5 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-terra-green" />
                      <span className="font-terra-display font-semibold text-terra-green text-sm">
                        {partner.impact}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Culture d'entreprise */}
        <div className="mb-20">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 text-center">
            Notre culture d'entreprise
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {culture.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-terra-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-terra-green" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-terra-display font-bold text-urban-black mb-2">
                      {item.title}
                    </h3>
                    <p className="font-terra-body text-gray-700 text-sm mb-3">{item.description}</p>
                    <p className="font-terra-body text-gray-600 text-xs">{item.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-terra-green rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-terra-display font-bold mb-4">Rejoignez l'aventure TERRA</h2>
          <p className="font-terra-body text-white/90 mb-8 max-w-2xl mx-auto">
            Vous partagez nos valeurs ? Découvrez nos opportunités de carrière ou suivez notre
            actualité pour rester connecté à notre mission.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-white text-terra-green hover:bg-white/90 font-terra-display font-semibold px-6 py-3">
              <Users className="mr-2 h-4 w-4" />
              Voir nos offres d'emploi
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-terra-green font-terra-display font-semibold px-6 py-3"
            >
              Découvrir nos collections
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="font-terra-body text-white/70 text-sm">
              Questions sur TERRA ? Contactez-nous à{' '}
              <a href="mailto:hello@terra-sneakers.com" className="underline hover:no-underline">
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
    title: 'À propos de TERRA | Sneakers Écoresponsables',
    description:
      "Découvrez l'histoire de TERRA, notre équipe passionnée et nos valeurs. Comment nous révolutionnons l'industrie sneaker avec style et conscience environnementale.",
    openGraph: {
      title: 'À propos de TERRA | Sneakers Écoresponsables',
      description:
        "L'histoire d'une équipe passionnée qui révolutionne l'industrie sneaker. Découvrez notre mission, nos valeurs et les visages derrière TERRA.",
    },
  }
}
