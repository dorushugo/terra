import type { Metadata } from 'next'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Leaf, Award, Globe, ArrowLeft } from 'lucide-react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { TerraCollection } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { notFound } from 'next/navigation'

interface CollectionPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })

  try {
    const collection = await payload.find({
      collection: 'terra-collections',
      where: {
        slug: {
          equals: params.slug,
        },
        _status: {
          equals: 'published',
        },
      },
      limit: 1,
      depth: 2,
    })

    if (collection.docs.length === 0) {
      return {
        title: 'Collection non trouvée - TERRA',
        description: "Cette collection n'existe pas.",
      }
    }

    const collectionData = collection.docs[0]

    return {
      title: `Collection ${collectionData.name} - TERRA`,
      description: collectionData.shortDescription || collectionData.tagline,
      openGraph: {
        title: `Collection ${collectionData.name} - TERRA`,
        description: collectionData.shortDescription || collectionData.tagline,
        type: 'website',
      },
    }
  } catch (error) {
    return {
      title: 'Collection - TERRA',
      description: 'Découvrez notre collection de sneakers écoresponsables.',
    }
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const payload = await getPayload({ config: configPromise })

  let collection: TerraCollection | null = null

  try {
    const result = await payload.find({
      collection: 'terra-collections',
      where: {
        slug: {
          equals: params.slug,
        },
        _status: {
          equals: 'published',
        },
      },
      limit: 1,
      depth: 2,
    })

    if (result.docs.length === 0) {
      notFound()
    }

    collection = result.docs[0]
  } catch (error) {
    console.error('Erreur lors du chargement de la collection:', error)
    notFound()
  }

  // Récupérer les produits de cette collection
  let products: any[] = []
  try {
    const productsResult = await payload.find({
      collection: 'products',
      where: {
        collection: {
          equals: params.slug,
        },
        _status: {
          equals: 'published',
        },
      },
      limit: 12,
      depth: 2,
    })
    products = productsResult.docs
  } catch (error) {
    console.warn('Erreur lors du chargement des produits:', error)
  }

  // Fonction pour obtenir l'URL de l'image
  const getCollectionImageUrl = (imageField: any, size: 'medium' | 'large' = 'large') => {
    if (typeof imageField === 'object' && imageField) {
      const rawUrl = imageField.sizes?.[size]?.url || imageField.url
      if (rawUrl) {
        return getMediaUrl(rawUrl, imageField.updatedAt)
      }
    }
    return null
  }

  const heroImageUrl =
    getCollectionImageUrl(collection.heroImage) ||
    getCollectionImageUrl(collection.lifestyleImage) ||
    `/images/collections/${collection.slug}-hero.jpg`

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm font-terra-body text-gray-600">
            <Link href="/" className="hover:text-terra-green transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-terra-green transition-colors">
              Collections
            </Link>
            <span>/</span>
            <span className="text-terra-green font-medium">{collection.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <Image
                src={heroImageUrl}
                alt={`Collection ${collection.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-terra-green/10 text-terra-green rounded-full px-4 py-2 text-sm font-terra-body font-medium mb-4">
                  <Award className="h-4 w-4" />
                  <span>Collection TERRA</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-terra-display font-bold text-urban-black mb-3">
                  {collection.name}
                </h1>
                <p className="text-xl font-terra-body text-terra-green font-medium mb-4">
                  {collection.tagline}
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-lg font-terra-body text-gray-600 leading-relaxed">
                  {collection.shortDescription}
                </p>
              </div>

              {/* Prix */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-terra-body text-gray-500">À partir de</span>
                <span className="text-3xl font-terra-display font-bold text-terra-green">
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
              {collection.keyFeatures && collection.keyFeatures.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-terra-display font-semibold text-urban-black">
                    Caractéristiques clés
                  </h3>
                  <div className="space-y-2">
                    {collection.keyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-gray-600">
                        <Leaf className="h-5 w-5 text-terra-green flex-shrink-0" />
                        <span className="font-terra-body">{feature.feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  className="bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold px-8 py-6 text-base"
                >
                  <Link href={`/products?collection=${collection.slug}`}>
                    Découvrir les produits
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-terra-green text-terra-green hover:bg-terra-green hover:text-white font-terra-display font-semibold px-8 py-6 text-base"
                >
                  <Link href="/collections">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Toutes les collections
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produits de la collection */}
      {products.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-terra-display font-bold text-urban-black mb-4">
                Produits de la collection
              </h2>
              <p className="text-lg font-terra-body text-gray-600 max-w-2xl mx-auto">
                Découvrez tous les modèles disponibles dans la collection {collection.name}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-white">
                    {product.images?.[0]?.image?.url ? (
                      <Image
                        src={getMediaUrl(
                          product.images[0].image.url,
                          product.images[0].image.updatedAt,
                        )}
                        alt={product.images[0].alt || product.title}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <Leaf className="h-12 w-12 text-terra-green" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-terra-display font-semibold text-urban-black mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-lg font-terra-display font-bold text-terra-green">
                      {product.price}€
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {products.length > 8 && (
              <div className="text-center mt-12">
                <Button
                  asChild
                  variant="outline"
                  className="border-terra-green text-terra-green hover:bg-terra-green hover:text-white font-terra-display font-semibold px-8 py-3"
                >
                  <Link href={`/products?collection=${collection.slug}`}>
                    Voir tous les produits ({products.length})
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
