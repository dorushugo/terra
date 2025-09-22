import type { Metadata } from 'next'
import React from 'react'
import {
  Briefcase,
  Users,
  Heart,
  Target,
  MapPin,
  Clock,
  ArrowRight,
  Leaf,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CareersPage() {
  const jobOffers = [
    {
      title: 'Développeur Full-Stack Senior',
      department: 'Tech',
      location: 'Paris / Remote',
      type: 'CDI',
      description:
        'Rejoignez notre équipe tech pour développer la plateforme e-commerce TERRA et nos outils internes.',
      skills: ['React', 'Node.js', 'TypeScript', 'Next.js', 'PostgreSQL'],
      urgent: true,
    },
    {
      title: 'Responsable Marketing Digital',
      department: 'Marketing',
      location: 'Paris',
      type: 'CDI',
      description:
        'Pilotez nos campagnes digitales et développez notre présence en ligne avec impact.',
      skills: ['SEO/SEA', 'Social Media', 'Analytics', 'Brand Management'],
      urgent: false,
    },
    {
      title: 'Designer Produit Senior',
      department: 'Design',
      location: 'Paris',
      type: 'CDI',
      description:
        'Concevez les prochaines collections TERRA en alliant style, innovation et durabilité.',
      skills: ['Design Thinking', 'Éco-conception', 'Prototypage', '3D'],
      urgent: false,
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Care',
      location: 'Paris / Remote',
      type: 'CDI',
      description:
        'Assurez une expérience client exceptionnelle et développez notre service après-vente.',
      skills: ['Relation client', 'CRM', 'Analyse', 'Communication'],
      urgent: true,
    },
    {
      title: 'Responsable Supply Chain',
      department: 'Opérations',
      location: 'Paris',
      type: 'CDI',
      description:
        "Optimisez notre chaîne d'approvisionnement éthique et nos partenariats européens.",
      skills: ['Logistique', 'Négociation', 'Durabilité', 'Gestion de projet'],
      urgent: false,
    },
    {
      title: 'Stage Marketing & Communication',
      department: 'Marketing',
      location: 'Paris',
      type: 'Stage 6 mois',
      description:
        "Participez à nos campagnes de communication et découvrez le marketing d'une marque à impact.",
      skills: ['Communication', 'Réseaux sociaux', 'Créativité', 'Analyse'],
      urgent: false,
    },
  ]

  const benefits = [
    {
      icon: Heart,
      title: 'Impact positif',
      description: "Participez à révolutionner l'industrie sneaker vers plus de durabilité",
    },
    {
      icon: Users,
      title: 'Équipe passionnée',
      description: 'Rejoignez une équipe de 25 personnes engagées et bienveillantes',
    },
    {
      icon: Target,
      title: 'Croissance rapide',
      description: 'Évoluez dans une startup en hypercroissance avec de vrais défis',
    },
    {
      icon: Leaf,
      title: 'Valeurs fortes',
      description: 'Travaillez pour une entreprise B Corp certifiée et transparente',
    },
    {
      icon: Globe,
      title: 'Télétravail flexible',
      description: '3 jours en remote par semaine, bureaux modernes à Paris',
    },
    {
      icon: Briefcase,
      title: 'Package complet',
      description: 'Salaire compétitif, BSPCE, mutuelle, tickets resto, formations',
    },
  ]

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-terra-display font-bold text-urban-black mb-4">
            Rejoignez l'équipe TERRA
          </h1>
          <p className="text-lg font-terra-body text-gray-600 max-w-2xl mx-auto">
            Construisons ensemble l'avenir des sneakers écoresponsables. Rejoignez une équipe
            passionnée qui révolutionne l'industrie.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-4">
                Notre mission
              </h2>
              <p className="font-terra-body text-gray-700 mb-6">
                Démocratiser les sneakers écoresponsables sans compromis sur le style. Nous prouvons
                qu'on peut être à la fois tendance, accessible et respectueux de la planète.
              </p>
              <div className="space-y-2 text-sm font-terra-body text-gray-600">
                <p>• 60% de matériaux recyclés minimum</p>
                <p>• Fabrication 100% européenne</p>
                <p>• 3 arbres plantés par paire vendue</p>
                <p>• Certification B Corp</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-4">
                Pourquoi nous rejoindre ?
              </h2>
              <p className="font-terra-body text-gray-700 mb-6">
                TERRA, c'est l'opportunité de travailler dans une startup à impact, en
                hypercroissance, avec une équipe passionnée et des défis stimulants.
              </p>
              <div className="space-y-2 text-sm font-terra-body text-gray-600">
                <p>• Startup en série A (5M€ levés)</p>
                <p>• +300% de croissance en 2024</p>
                <p>• Équipe de 25 talents motivés</p>
                <p>• Culture d'entreprise forte</p>
              </div>
            </div>
          </div>
        </div>

        {/* Avantages */}
        <div className="mb-16">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 text-center">
            Pourquoi vous allez adorer travailler chez TERRA
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-terra-green hover:bg-terra-green/5 transition-colors"
              >
                <div className="w-12 h-12 bg-terra-green/20 rounded-full flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-terra-green" />
                </div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-3">
                  {benefit.title}
                </h3>
                <p className="font-terra-body text-gray-700 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Package & Avantages détaillés */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-6 text-center">
            Package & Avantages
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-terra-display font-semibold text-urban-black mb-4 text-terra-green">
                💰 Rémunération
              </h3>
              <ul className="space-y-2 text-sm font-terra-body text-gray-700">
                <li>• Salaire compétitif selon profil et expérience</li>
                <li>• BSPCE (actions) pour tous les CDI</li>
                <li>• Prime de performance annuelle</li>
                <li>• Augmentations régulières selon résultats</li>
              </ul>

              <h3 className="font-terra-display font-semibold text-urban-black mb-4 mt-6 text-terra-green">
                🏥 Santé & Bien-être
              </h3>
              <ul className="space-y-2 text-sm font-terra-body text-gray-700">
                <li>• Mutuelle Alan prise en charge à 100%</li>
                <li>• Abonnement sport Classpass</li>
                <li>• Séances de méditation hebdomadaires</li>
                <li>• Conciergerie d'entreprise</li>
              </ul>
            </div>

            <div>
              <h3 className="font-terra-display font-semibold text-urban-black mb-4 text-terra-green">
                🎯 Développement
              </h3>
              <ul className="space-y-2 text-sm font-terra-body text-gray-700">
                <li>• Budget formation 2000€/an par personne</li>
                <li>• Conférences et événements tech/business</li>
                <li>• Mentoring interne et externe</li>
                <li>• Évolution rapide selon performance</li>
              </ul>

              <h3 className="font-terra-display font-semibold text-urban-black mb-4 mt-6 text-terra-green">
                🌍 Lifestyle
              </h3>
              <ul className="space-y-2 text-sm font-terra-body text-gray-700">
                <li>• Télétravail flexible (3j/semaine)</li>
                <li>• Bureaux modernes à République (Paris)</li>
                <li>• Tickets restaurant Swile (11€/jour)</li>
                <li>• Sneakers TERRA offertes chaque saison</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Offres d'emploi */}
        <div className="mb-16">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 text-center">
            Nos offres d'emploi
          </h2>

          <div className="space-y-6">
            {jobOffers.map((job, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-terra-green transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-terra-display font-bold text-urban-black">
                        {job.title}
                      </h3>
                      {job.urgent && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-terra-body font-semibold">
                          Urgent
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm font-terra-body text-gray-600">
                      <span className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {job.department}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.type}
                      </span>
                    </div>

                    <p className="font-terra-body text-gray-700 mb-4">{job.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-terra-green/10 text-terra-green text-xs px-2 py-1 rounded-full font-terra-body font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <Button className="bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold px-6 py-3 group transition-colors">
                      Postuler
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Processus de recrutement */}
        <div className="mb-16">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 text-center">
            Notre processus de recrutement
          </h2>

          <div className="bg-gray-50 rounded-lg p-8">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-terra-green text-white rounded-full flex items-center justify-center mx-auto mb-4 font-terra-display font-bold">
                  1
                </div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-2">
                  Candidature
                </h3>
                <p className="font-terra-body text-gray-600 text-sm">
                  Envoyez-nous votre CV et lettre de motivation via notre formulaire
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-terra-green text-white rounded-full flex items-center justify-center mx-auto mb-4 font-terra-display font-bold">
                  2
                </div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-2">
                  Échange téléphonique
                </h3>
                <p className="font-terra-body text-gray-600 text-sm">
                  30min avec notre équipe RH pour faire connaissance (48h max)
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-terra-green text-white rounded-full flex items-center justify-center mx-auto mb-4 font-terra-display font-bold">
                  3
                </div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-2">
                  Entretien technique
                </h3>
                <p className="font-terra-body text-gray-600 text-sm">
                  1h avec votre futur manager et un membre de l'équipe
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-terra-green text-white rounded-full flex items-center justify-center mx-auto mb-4 font-terra-display font-bold">
                  4
                </div>
                <h3 className="font-terra-display font-semibold text-urban-black mb-2">
                  Rencontre équipe
                </h3>
                <p className="font-terra-body text-gray-600 text-sm">
                  Découvrez nos bureaux et rencontrez l'équipe autour d'un café
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="font-terra-body text-gray-700 text-sm">
                <strong>Délai total :</strong> 1-2 semaines maximum •{' '}
                <strong>Réponse garantie :</strong> sous 5 jours ouvrés
              </p>
            </div>
          </div>
        </div>

        {/* Témoignages équipe */}
        <div className="mb-16">
          <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 text-center">
            Ils ont rejoint l'aventure TERRA
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-terra-display font-bold">L</span>
                </div>
                <div>
                  <h4 className="font-terra-display font-semibold text-urban-black mb-1">
                    Laura, Lead Developer
                  </h4>
                  <p className="font-terra-body text-gray-600 text-sm mb-3">
                    Chez TERRA depuis 18 mois
                  </p>
                  <p className="font-terra-body text-gray-700 text-sm italic">
                    "J'ai rejoint TERRA pour l'impact positif et la tech de qualité. L'équipe est
                    bienveillante, les défis stimulants, et on sent vraiment qu'on construit quelque
                    chose d'important pour l'avenir."
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-terra-display font-bold">T</span>
                </div>
                <div>
                  <h4 className="font-terra-display font-semibold text-urban-black mb-1">
                    Thomas, Product Designer
                  </h4>
                  <p className="font-terra-body text-gray-600 text-sm mb-3">
                    Chez TERRA depuis 1 an
                  </p>
                  <p className="font-terra-body text-gray-700 text-sm italic">
                    "Concevoir des sneakers écoresponsables, c'est le challenge parfait ! L'équipe
                    fait confiance, les projets sont variés, et voir nos créations portées par nos
                    clients, c'est magique."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Candidature spontanée */}
        <div className="bg-terra-green/5 border border-terra-green/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-4">
            Vous ne trouvez pas le poste idéal ?
          </h2>
          <p className="font-terra-body text-gray-700 mb-6">
            Nous sommes toujours à la recherche de talents passionnés. Envoyez-nous votre
            candidature spontanée !
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold px-6 py-3 group transition-colors">
              Candidature spontanée
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <a
              href="mailto:jobs@terra-sneakers.com"
              className="border border-terra-green text-terra-green hover:bg-terra-green hover:text-white font-terra-display font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              jobs@terra-sneakers.com
            </a>
          </div>

          <p className="font-terra-body text-gray-600 text-sm mt-4">
            Dites-nous pourquoi TERRA vous fait vibrer et comment vous pourriez contribuer à notre
            mission !
          </p>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Carrières | TERRA - Sneakers Écoresponsables',
    description:
      "Rejoignez l'équipe TERRA ! Découvrez nos offres d'emploi dans une startup à impact qui révolutionne l'industrie des sneakers écoresponsables.",
    openGraph: {
      title: 'Carrières | TERRA',
      description:
        "Construisons ensemble l'avenir des sneakers écoresponsables. Rejoignez une équipe passionnée qui révolutionne l'industrie.",
    },
  }
}
