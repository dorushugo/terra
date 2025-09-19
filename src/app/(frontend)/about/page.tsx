import type { Metadata } from 'next'
import React from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Leaf, Heart, Target, Users, Award, Recycle } from 'lucide-react'

export default function AboutPage() {
  const team = [
    {
      name: 'Marie Dubois',
      role: 'CEO & Co-fondatrice',
      bio: "Ex-Nike Europe, 15 ans d'expérience en développement durable. Diplômée HEC et passionnée de mode éthique.",
      image: '/images/team/marie-dubois.jpg',
      linkedin: 'https://linkedin.com/in/marie-dubois',
    },
    {
      name: 'Thomas Martin',
      role: 'CTO & Co-fondateur',
      bio: 'Ex-Adidas Innovation Lab, expert en matériaux durables et processus de fabrication. Ingénieur Centrale Paris.',
      image: '/images/team/thomas-martin.jpg',
      linkedin: 'https://linkedin.com/in/thomas-martin',
    },
    {
      name: 'Sofia Rossi',
      role: 'Head of Design',
      bio: 'Ex-VEJA, spécialiste en éco-conception. Diplômée Parsons School of Design, vision avant-gardiste du design durable.',
      image: '/images/team/sofia-rossi.jpg',
      linkedin: 'https://linkedin.com/in/sofia-rossi',
    },
  ]

  const values = [
    {
      icon: Heart,
      title: 'Conscious',
      subtitle: 'Conscience environnementale',
      description:
        'Chaque décision est prise en considérant son impact sur la planète et les générations futures.',
    },
    {
      icon: Award,
      title: 'Crafted',
      subtitle: 'Savoir-faire artisanal',
      description:
        'Nous privilégions la qualité et le savoir-faire traditionnel européen pour créer des produits durables.',
    },
    {
      icon: Users,
      title: 'Community',
      subtitle: 'Impact social positif',
      description:
        'Notre communauté et nos partenaires sont au cœur de notre démarche pour un commerce plus équitable.',
    },
    {
      icon: Recycle,
      title: 'Circular',
      subtitle: 'Économie circulaire',
      description:
        'Nous repensons le cycle de vie du produit pour minimiser les déchets et maximiser la réutilisation.',
    },
  ]

  const partners = [
    {
      name: 'Atelier Porto',
      description: 'Fabrication 3ème génération',
      detail:
        'Partenaire historique au Portugal, spécialisé dans la maroquinerie de luxe depuis 1952.',
      image: '/images/partners/atelier-porto.jpg',
    },
    {
      name: 'Seaqual Initiative',
      description: 'Plastique océan',
      detail:
        'Organisation internationale qui transforme les déchets marins en matières premières durables.',
      image: '/images/partners/seaqual.jpg',
    },
    {
      name: "Reforest'Action",
      description: 'Plantation arbres',
      detail:
        'Plateforme de reforestation qui nous permet de planter 3 arbres pour chaque paire vendue.',
      image: '/images/partners/reforest-action.jpg',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-6 bg-terra-green text-white">
                Notre Histoire
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-terra-display font-bold text-urban-black mb-6">
                À propos de
                <span className="block text-terra-green">TERRA</span>
              </h1>
              <p className="text-lg font-terra-body text-gray-600 leading-relaxed mb-8">
                TERRA est née d'un constat simple : pourquoi choisir entre style et conscience ? En
                2024, nous avons décidé de créer la première marque de sneakers qui refuse ce
                compromis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold px-8 py-6 group"
                >
                  Découvrir nos valeurs
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-terra-green text-terra-green hover:bg-terra-green hover:text-white font-terra-display font-semibold px-8 py-6"
                >
                  Notre impact
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square relative rounded-2xl overflow-hidden">
                <Image
                  src="/images/about-hero.jpg"
                  alt="L'équipe TERRA"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-terra-green text-white p-6 rounded-2xl shadow-xl">
                <div className="text-2xl font-terra-display font-bold">2024</div>
                <div className="text-sm font-terra-body">Année de création</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-urban-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-terra-display font-bold mb-8">Notre vision</h2>
            <blockquote className="text-xl sm:text-2xl font-terra-body text-white/90 leading-relaxed italic mb-8">
              "Nous croyons qu'il est possible de créer des produits beaux, durables et accessibles.
              Notre mission est de prouver que l'industrie de la mode peut être une force positive
              pour la planète et la société."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-terra-green rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-terra-display font-semibold">Marie Dubois</div>
                <div className="text-sm text-white/70 font-terra-body">CEO & Co-fondatrice</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="inline-flex items-center gap-2 bg-terra-green/10 text-terra-green rounded-full px-4 py-2 text-sm font-terra-body mb-6">
                <Target className="h-4 w-4" />
                <span>Mission</span>
              </div>
              <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-6">
                Révolutionner l'industrie sneaker
              </h2>
              <p className="text-lg font-terra-body text-gray-600 leading-relaxed">
                En prouvant qu'on peut être stylé, responsable et accessible. Nous voulons
                démocratiser la mode durable et inspirer une nouvelle génération de consommateurs
                conscients.
              </p>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 bg-clay-orange/10 text-clay-orange rounded-full px-4 py-2 text-sm font-terra-body mb-6">
                <Leaf className="h-4 w-4" />
                <span>Vision</span>
              </div>
              <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-6">
                Devenir LA référence durable
              </h2>
              <p className="text-lg font-terra-body text-gray-600 leading-relaxed">
                Pour une génération qui veut du style sans compromis sur ses valeurs. TERRA sera
                synonyme d'innovation, de transparence et d'impact positif dans l'industrie de la
                mode.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-terra-display font-bold text-urban-black mb-6">
              Nos 4 valeurs fondamentales
            </h2>
            <p className="text-lg font-terra-body text-gray-600 leading-relaxed">
              Ces principes guident chacune de nos décisions et actions au quotidien
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-terra-green/10 rounded-full flex-shrink-0 group-hover:bg-terra-green group-hover:text-white transition-colors">
                      <value.icon className="h-6 w-6 text-terra-green group-hover:text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-terra-display font-bold text-urban-black mb-2">
                        {value.title}
                      </h3>
                      <p className="text-terra-green font-terra-body font-medium text-sm mb-3">
                        {value.subtitle}
                      </p>
                      <p className="font-terra-body text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-terra-display font-bold text-urban-black mb-6">
              L'équipe fondatrice
            </h2>
            <p className="text-lg font-terra-body text-gray-600 leading-relaxed">
              Trois experts passionnés qui ont uni leurs forces pour créer l'avenir de la sneaker
              durable
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group text-center"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-terra-display font-bold text-urban-black mb-2">
                      {member.name}
                    </h3>
                    <p className="text-terra-green font-terra-body font-semibold text-sm mb-4">
                      {member.role}
                    </p>
                    <p className="font-terra-body text-gray-600 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-terra-display font-bold text-urban-black mb-6">
              Nos partenaires engagés
            </h2>
            <p className="text-lg font-terra-body text-gray-600 leading-relaxed">
              Nous collaborons avec des organisations qui partagent nos valeurs et notre vision d'un
              avenir durable
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-terra-display font-bold text-urban-black mb-2">
                    {partner.name}
                  </h3>
                  <p className="text-terra-green font-terra-body font-semibold text-sm mb-3">
                    {partner.description}
                  </p>
                  <p className="font-terra-body text-gray-600 text-sm leading-relaxed">
                    {partner.detail}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-terra-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-terra-display font-bold mb-6">
            Rejoignez l'aventure TERRA
          </h2>
          <p className="text-lg font-terra-body text-white/90 mb-8 max-w-2xl mx-auto">
            Découvrez nos collections et participez à la révolution de la sneaker durable
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-terra-green hover:bg-white/90 font-terra-display font-semibold px-8 py-6 group"
            >
              Découvrir nos sneakers
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-terra-green font-terra-display font-semibold px-8 py-6"
            >
              Suivre notre actualité
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'À propos - TERRA',
    description:
      "Découvrez l'histoire de TERRA, marque de sneakers écoresponsables. Notre mission : allier style urbain et conscience environnementale. Rencontrez l'équipe et nos partenaires.",
    openGraph: {
      title: 'À propos - TERRA',
      description: "L'histoire de la sneaker durable",
      images: ['/images/about-hero.jpg'],
    },
  }
}
