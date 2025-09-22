'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Leaf } from 'lucide-react'

interface Collection {
  name: string
  tagline: string
  price: string
  features: string[]
  image: string
  slug: string
  color: string
  productCount?: number
}

interface CollectionsShowcaseProps {
  title: string
  collections: Collection[]
  className?: string
}

export const CollectionsShowcase: React.FC<CollectionsShowcaseProps> = ({
  title,
  collections,
  className,
}) => {
  const getCollectionStyles = (index: number) => {
    const styles = [
      'from-terra-green/10 to-sage-green/5',
      'from-sage-green/10 to-white/50',
      'from-urban-black/10 to-gray-100/50',
    ]
    return styles[index % styles.length]
  }

  return (
    <section className={`py-20 bg-white ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-terra-display font-bold text-urban-black mb-6">
            {title}
          </h2>
          <p className="text-lg font-terra-body text-gray-600 leading-relaxed">
            Chaque collection TERRA incarne notre vision d'un style urbain conscient. Du minimalisme
            épuré aux innovations techniques, découvrez la sneaker qui vous ressemble.
          </p>
        </div>

        {/* Grille des collections */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {collections.map((collection, index) => (
            <Card
              key={collection.slug}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getCollectionStyles(index)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Badge collection */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-urban-black px-3 py-1 text-xs font-terra-display font-semibold rounded-full">
                    {collection.name}
                  </span>
                </div>

                {/* Prix */}
                <div className="absolute bottom-4 right-4">
                  <span className="bg-terra-green text-white px-3 py-2 text-sm font-terra-display font-bold rounded-lg">
                    {collection.price}
                  </span>
                </div>

                {/* Nombre de produits */}
                {collection.productCount !== undefined && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-urban-black px-3 py-1 text-xs font-terra-display font-semibold rounded-full">
                      {collection.productCount} produit{collection.productCount > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Titre et tagline */}
                  <div>
                    <h3 className="text-xl font-terra-display font-bold text-urban-black mb-2">
                      {collection.name}
                    </h3>
                    <p className="text-sage-green font-terra-body font-medium text-sm">
                      {collection.tagline}
                    </p>
                  </div>

                  {/* Caractéristiques */}
                  <div className="space-y-2">
                    {collection.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center text-sm font-terra-body text-gray-600"
                      >
                        <Leaf className="h-4 w-4 text-terra-green mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <Link href={`/products?collection=${collection.slug}`}>
                      <Button
                        variant="outline"
                        className="w-full group border-terra-green bg-transparent text-terra-green hover:bg-terra-green hover:text-white focus:ring-terra-green focus:ring-offset-0"
                      >
                        Voir les produits
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA global */}
        <div className="text-center mt-16">
          <p className="text-gray-600 font-terra-body mb-6">Ou explorez tous nos modèles</p>
          <Link href="/products">
            <Button
              variant="terra"
              size="lg"
              className="bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold px-8 py-6 group transition-terra-safe focus:ring-terra-green focus:ring-offset-0"
            >
              Voir tous les produits
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
