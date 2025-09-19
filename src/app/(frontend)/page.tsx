import type { Metadata } from 'next'
import React from 'react'
import { TerraHero } from '@/components/terra/TerraHero'
import { CollectionsShowcase } from '@/components/terra/CollectionsShowcase'
import { SustainabilityStrip } from '@/components/terra/SustainabilityStrip'
import { TerraProductCard } from '@/components/terra/TerraProductCard'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Product } from '@/payload-types'

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  // Récupérer les collections TERRA
  const collections = await payload.find({
    collection: 'terra-collections',
    limit: 10,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  // Récupérer les produits featured
  const featuredProducts = await payload.find({
    collection: 'products',
    limit: 3,
    where: {
      isFeatured: {
        equals: true,
      },
      _status: {
        equals: 'published',
      },
    },
  })

  // Récupérer les statistiques des collections (nombre de produits par collection)
  const collectionStats = await Promise.all(
    ['origin', 'move', 'limited'].map(async (collectionSlug) => {
      const count = await payload.count({
        collection: 'products',
        where: {
          collection: {
            equals: collectionSlug,
          },
          _status: {
            equals: 'published',
          },
        },
      })
      return { slug: collectionSlug, productCount: count.totalDocs }
    }),
  )

  // Transformer les données des collections pour l'affichage
  const collectionsData =
    collections.docs.length > 0
      ? collections.docs.map((collection) => {
          const stats = collectionStats.find((s) => s.slug === collection.slug)
          return {
            name: collection.name,
            tagline: collection.tagline,
            price: collection.priceRange?.from
              ? `À partir de ${collection.priceRange.from}€`
              : 'À partir de 139€',
            features: collection.keyFeatures?.map((f) => f.feature) || [
              'Matériaux durables',
              'Fabrication Europe',
              'Design premium',
            ],
            image:
              typeof collection.heroImage === 'object' && collection.heroImage?.url
                ? collection.heroImage.url
                : '/images/collections/default-hero.jpg',
            slug: collection.slug,
            color:
              collection.slug === 'origin'
                ? '#2D5A27'
                : collection.slug === 'move'
                  ? '#9CAF88'
                  : '#1A1A1A',
            productCount: stats?.productCount || 0,
          }
        })
      : [
          // Données par défaut si pas de collections en base
          {
            name: 'TERRA Origin',
            tagline: "L'essentiel réinventé",
            price: 'À partir de 139€',
            features: ['Cuir Apple innovant', 'Ocean Plastic recyclé', 'Fabrication européenne'],
            image: '/images/collections/origin-hero.jpg',
            slug: 'origin',
            color: '#2D5A27',
            productCount: collectionStats.find((s) => s.slug === 'origin')?.productCount || 0,
          },
          {
            name: 'TERRA Move',
            tagline: 'Performance urbaine',
            price: 'À partir de 159€',
            features: ['Technologie Motion', 'Matériaux respirants', 'Semelle recyclée'],
            image: '/images/collections/move-hero.jpg',
            slug: 'move',
            color: '#9CAF88',
            productCount: collectionStats.find((s) => s.slug === 'move')?.productCount || 0,
          },
          {
            name: 'TERRA Limited',
            tagline: 'Édition exclusive',
            price: 'À partir de 189€',
            features: ['Matériaux premium', 'Série limitée', 'Design signature'],
            image: '/images/collections/limited-hero.jpg',
            slug: 'limited',
            color: '#1A1A1A',
            productCount: collectionStats.find((s) => s.slug === 'limited')?.productCount || 0,
          },
        ]

  const sustainabilityStats = [
    '60% matériaux recyclés',
    '100% fabrication européenne',
    '-50% émissions CO₂',
    '3 arbres plantés par paire',
  ]

  return (
    <React.Fragment>
      <TerraHero
        title="Sneakers. Grounded in Purpose."
        subtitle="Style urbain, conscience environnementale"
        image="/images/hero.png"
        cta="Découvrir nos collections"
      />

      <CollectionsShowcase
        title="Trois collections pensées pour ton style de vie"
        collections={collectionsData}
      />

      <SustainabilityStrip stats={sustainabilityStats} />

      {/* Featured Products Section */}
      {featuredProducts.docs.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-terra-display font-bold text-urban-black mb-6">
                Nos coups de cœur
              </h2>
              <p className="text-lg font-terra-body text-gray-600 leading-relaxed">
                Découvrez notre sélection de sneakers écoresponsables, pensées pour allier style et
                conscience environnementale.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.docs.map((product) => (
                <TerraProductCard key={product.id} product={product as Product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-6">
              Rejoignez la communauté TERRA
            </h2>
            <p className="text-lg font-terra-body text-gray-600 mb-8">
              Soyez les premiers informés de nos nouveautés, collections exclusives et engagements
              durables
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terra-green focus:border-transparent font-terra-body"
              />
              <Button
                variant="terra"
                className="bg-terra-green hover:bg-terra-green/90 text-white font-terra-body font-semibold px-8 py-3 transition-terra-safe"
              >
                S'abonner
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <p className="text-sm text-gray-500 font-terra-body mt-4">
              Pas de spam, que du contenu de qualité. Désabonnement en un clic.
            </p>
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'TERRA - Sneakers Grounded in Purpose',
    description:
      'Découvrez TERRA, la marque de sneakers qui allie style urbain et conscience environnementale. Collections Origin, Move et Limited - Matériaux durables, fabrication européenne.',
    keywords: 'sneakers, écoresponsable, durable, TERRA, urban, style, environnement',
    openGraph: {
      title: 'TERRA - Sneakers Grounded in Purpose',
      description: 'Style urbain, conscience environnementale',
      type: 'website',
    },
  }
}
