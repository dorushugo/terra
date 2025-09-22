import type { Metadata } from 'next'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Leaf, Award, Globe } from 'lucide-react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { TerraCollection } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export const metadata: Metadata = {
  title: 'Collections TERRA - Style urbain, conscience environnementale',
  description:
    'Découvrez nos trois collections de sneakers écoresponsables : Origin (minimaliste), Move (performance) et Limited (éditions exclusives). Style urbain et engagement durable.',
  keywords:
    'collections, sneakers, écoresponsable, TERRA Origin, TERRA Move, TERRA Limited, style urbain',
  openGraph: {
    title: 'Collections TERRA - Style urbain, conscience environnementale',
    description: 'Trois collections pensées pour votre style de vie',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
    title: 'Collections TERRA - Style urbain, conscience environnementale',
    description: 'Trois collections pensées pour votre style de vie',
  },
}

export default async function CollectionsPage() {
  const payload = await getPayload({ config: configPromise })

  // Récupérer les collections TERRA du CMS avec gestion d'erreur
  let collections: TerraCollection[] = []
  try {
    const collectionsResponse = await payload.find({
      collection: 'terra-collections',
      limit: 10,
      where: {
        _status: {
          equals: 'published',
        },
      },
      sort: 'createdAt',
      depth: 2,
    })
    collections = collectionsResponse.docs as TerraCollection[]

    // DEBUG: Log des collections récupérées
    console.log('🗂️ Collections from CMS (Collections Page):', {
      total: collections.length,
      collections: collections.map((c) => ({
        name: c.name,
        slug: c.slug,
        hasHeroImage: !!c.heroImage,
        hasLifestyleImage: !!c.lifestyleImage,
        heroImageType: typeof c.heroImage,
        lifestyleImageType: typeof c.lifestyleImage,
      })),
    })
  } catch (error) {
    console.warn('Erreur lors du chargement des collections:', error)
    collections = []
  }

  // Données par défaut si pas de collections dans le CMS
  const defaultCollections = [
    {
      name: 'TERRA Origin',
      slug: 'origin',
      tagline: "L'essentiel réinventé",
      description:
        "Design minimaliste, matériaux nobles, confort absolu. La collection Origin incarne l'essence de TERRA : des sneakers intemporelles qui allient simplicité et performance.",
      shortDescription: 'Sneakers minimalistes et intemporelles',
      priceRange: { from: 139, to: 159 },
    },
    {
      name: 'TERRA Move',
      slug: 'move',
      tagline: 'Performance urbaine',
      description:
        "Conçue pour l'action, la collection Move combine innovation technique et style urbain. Chaque détail est pensé pour accompagner votre quotidien dynamique.",
      shortDescription: 'Performance technique et style urbain',
      priceRange: { from: 159, to: 179 },
    },
    {
      name: 'TERRA Limited',
      slug: 'limited',
      tagline: 'Édition exclusive',
      description:
        "Créations uniques en édition limitée, fruits de collaborations artistiques et d'innovations matériaux. Chaque paire raconte une histoire d'exception.",
      shortDescription: 'Éditions limitées et collaborations artistiques',
      priceRange: { from: 179, to: 199 },
    },
  ]

  // Normaliser les données pour s'assurer que toutes les collections ont les bonnes propriétés
  const collectionsToShow =
    collections.length > 0
      ? collections
      : defaultCollections.map((defaultCollection) => ({
          ...defaultCollection,
          heroImage: null,
          lifestyleImage: null,
          // Ajouter les autres propriétés manquantes si nécessaire
          keyFeatures: [
            { feature: 'Matériaux durables' },
            { feature: 'Fabrication Europe' },
            { feature: 'Design premium' },
          ],
        }))

  // DEBUG: Log des collections à afficher
  console.log('📋 Collections to show:', {
    usingCMSData: collections.length > 0,
    total: collectionsToShow.length,
    collections: collectionsToShow.map((c) => ({
      name: c.name,
      slug: c.slug,
      hasHeroImage: !!c.heroImage,
      hasLifestyleImage: !!c.lifestyleImage,
    })),
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-terra-green to-sage-green py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <Leaf className="h-5 w-5" />
              <span className="font-terra-body font-medium">Trois collections écoresponsables</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-terra-display font-bold mb-6">
              Nos Collections
            </h1>
            <p className="text-xl font-terra-body text-white/90 max-w-2xl mx-auto leading-relaxed">
              Chaque collection TERRA raconte une histoire unique, pensée pour accompagner votre
              style de vie avec conscience et authenticité.
            </p>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {collectionsToShow.map((collection: any, index: number) => (
              <div
                key={collection.slug}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Image */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {(() => {
                      // DEBUG: Log des données de collection
                      console.log('🔍 DEBUG Collection Page:', {
                        name: collection.name,
                        slug: collection.slug,
                        heroImageType: typeof collection.heroImage,
                        heroImage: collection.heroImage,
                        lifestyleImageType: typeof collection.lifestyleImage,
                        lifestyleImage: collection.lifestyleImage,
                      })

                      // Gérer les images des collections de la même façon que dans la page d'accueil
                      let imageUrl = '/images/collections/default-hero.jpg'
                      let source = 'default'

                      if (typeof collection.heroImage === 'object' && collection.heroImage) {
                        const rawUrl =
                          collection.heroImage.sizes?.large?.url || collection.heroImage.url
                        if (rawUrl) {
                          imageUrl = getMediaUrl(rawUrl, collection.heroImage.updatedAt)
                          source = 'heroImage'
                        }
                      } else if (
                        typeof collection.lifestyleImage === 'object' &&
                        collection.lifestyleImage
                      ) {
                        const rawUrl =
                          collection.lifestyleImage.sizes?.large?.url ||
                          collection.lifestyleImage.url
                        if (rawUrl) {
                          imageUrl = getMediaUrl(rawUrl, collection.lifestyleImage.updatedAt)
                          source = 'lifestyleImage'
                        }
                      } else if (collection.slug === 'origin') {
                        imageUrl = '/images/collections/origin-hero.jpg'
                        source = 'static origin'
                      } else if (collection.slug === 'move') {
                        imageUrl = '/images/collections/move-hero.jpg'
                        source = 'static move'
                      } else if (collection.slug === 'limited') {
                        imageUrl = '/images/collections/limited-hero.jpg'
                        source = 'static limited'
                      }

                      console.log(`📸 Using image from ${source}:`, imageUrl)

                      return (
                        <Image
                          src={imageUrl}
                          alt={`Collection ${collection.name}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      )
                    })()}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Content */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div>
                    <div className="inline-flex items-center gap-2 bg-terra-green/10 text-terra-green rounded-full px-4 py-2 text-sm font-terra-body font-medium mb-4">
                      <Award className="h-4 w-4" />
                      <span>Collection {index + 1}/3</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-terra-display font-bold text-urban-black mb-3">
                      {collection.name}
                    </h2>
                    <p className="text-xl font-terra-body text-terra-green font-medium mb-4">
                      {collection.tagline}
                    </p>
                  </div>

                  <p className="text-lg font-terra-body text-gray-600 leading-relaxed">
                    {collection.description || collection.shortDescription}
                  </p>

                  {/* Prix */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-terra-body text-gray-500">À partir de</span>
                    <span className="text-2xl font-terra-display font-bold text-terra-green">
                      {collection.priceRange?.from || 139}€
                    </span>
                    {collection.priceRange?.to &&
                      collection.priceRange.to > collection.priceRange.from && (
                        <span className="text-lg font-terra-body text-gray-500">
                          - {collection.priceRange.to}€
                        </span>
                      )}
                  </div>

                  {/* Caractéristiques */}
                  <div className="space-y-3">
                    {collection.keyFeatures && collection.keyFeatures.length > 0 ? (
                      collection.keyFeatures
                        .slice(0, 4)
                        .map((feature: any, featureIndex: number) => (
                          <div
                            key={featureIndex}
                            className="flex items-center gap-2 text-sm font-terra-body text-gray-600"
                          >
                            <Leaf className="h-4 w-4 text-terra-green flex-shrink-0" />
                            <span>{feature.feature}</span>
                          </div>
                        ))
                    ) : (
                      // Fallback vers les caractéristiques par défaut
                      <>
                        <div className="flex items-center gap-2 text-sm font-terra-body text-gray-600">
                          <Leaf className="h-4 w-4 text-terra-green" />
                          <span>Matériaux durables</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-terra-body text-gray-600">
                          <Globe className="h-4 w-4 text-terra-green" />
                          <span>Fabrication Europe</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-terra-body text-gray-600">
                          <Award className="h-4 w-4 text-terra-green" />
                          <span>Design premium</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      asChild
                      className="bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold px-8 py-6 text-base"
                    >
                      <Link href={`/products?collection=${collection.slug}`}>
                        Découvrir la collection
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-terra-green text-terra-green hover:bg-terra-green hover:text-white font-terra-display font-semibold px-8 py-6 text-base"
                    >
                      <Link href={`/collections/${collection.slug}`}>En savoir plus</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Banner */}
      <section className="bg-gradient-to-r from-terra-green to-sage-green py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-terra-display font-bold mb-6">
              L'engagement TERRA dans chaque collection
            </h2>
            <p className="text-lg font-terra-body text-white/90 mb-8 leading-relaxed">
              Matériaux innovants, fabrication éthique, impact positif. Chaque collection reflète
              notre vision d'un futur plus durable.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-terra-display font-bold mb-2">60%</div>
                <div className="text-sm font-terra-body text-white/80">Matériaux recyclés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-terra-display font-bold mb-2">100%</div>
                <div className="text-sm font-terra-body text-white/80">Fabrication européenne</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-terra-display font-bold mb-2">-50%</div>
                <div className="text-sm font-terra-body text-white/80">Émissions CO₂</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-terra-display font-bold mb-2">3</div>
                <div className="text-sm font-terra-body text-white/80">Arbres plantés/paire</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-terra-display font-bold text-urban-black mb-6">
              Prêt à découvrir votre style TERRA ?
            </h2>
            <p className="text-lg font-terra-body text-gray-600 mb-8 leading-relaxed">
              Explorez tous nos produits et trouvez la paire parfaite qui correspond à votre style
              de vie et vos valeurs.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold px-8 py-6 text-lg"
            >
              <Link href="/products">
                Voir tous les produits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
