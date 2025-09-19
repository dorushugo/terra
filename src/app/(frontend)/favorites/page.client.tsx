'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag, Trash2, Filter, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TerraProductCard } from '@/components/terra/TerraProductCard'
import { useFavorites } from '@/providers/FavoritesProvider'
import { useCart } from '@/providers/CartProvider'

export const FavoritesPageClient: React.FC = () => {
  const { favorites, clearFavorites, removeFromFavorites } = useFavorites()
  const { addToCart } = useCart()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'recent' | 'price' | 'name'>('recent')

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      case 'price':
        return (a.product.price || 0) - (b.product.price || 0)
      case 'name':
        return (a.product.name || '').localeCompare(b.product.name || '')
      default:
        return 0
    }
  })

  const handleAddAllToCart = async () => {
    for (const favorite of favorites) {
      const firstSize = favorite.product.sizes?.[0]?.size || '42'
      const firstColor = favorite.product.colors?.[0]?.name || 'Noir'
      await addToCart(favorite.product, firstSize, firstColor, 1)
    }
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="h-12 w-12 text-red-400" />
            </div>

            <h1 className="text-3xl font-terra-display font-bold text-urban-black mb-4">
              Votre liste de favoris est vide
            </h1>

            <p className="text-lg text-gray-600 font-terra-body mb-8 leading-relaxed">
              Découvrez nos collections écoresponsables et ajoutez vos sneakers préférées à votre
              liste de souhaits.
            </p>

            <div className="space-y-4">
              <Link href="/products">
                <Button className="w-full bg-terra-green hover:bg-terra-green/90 text-white py-3">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Découvrir nos produits
                </Button>
              </Link>

              <Link href="/collections">
                <Button variant="outline" className="w-full py-3">
                  Voir nos collections
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-terra-display font-bold text-terra-green">60%</div>
                <div className="text-sm text-gray-600 font-terra-body">Matériaux recyclés</div>
              </div>
              <div>
                <div className="text-2xl font-terra-display font-bold text-terra-green">100%</div>
                <div className="text-sm text-gray-600 font-terra-body">Made in Europe</div>
              </div>
              <div>
                <div className="text-2xl font-terra-display font-bold text-terra-green">-50%</div>
                <div className="text-sm text-gray-600 font-terra-body">Émissions CO₂</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-terra-display font-bold text-urban-black">
                Mes Favoris
              </h1>
              <p className="text-gray-600 font-terra-body">
                {favorites.length} {favorites.length > 1 ? 'produits' : 'produit'} dans votre liste
                de souhaits
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex gap-2">
              <Button
                onClick={handleAddAllToCart}
                className="bg-terra-green hover:bg-terra-green/90"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Tout ajouter au panier
              </Button>

              <Button
                variant="outline"
                onClick={clearFavorites}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vider la liste
              </Button>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg font-terra-body text-sm focus:outline-none focus:ring-2 focus:ring-terra-green"
              >
                <option value="recent">Plus récents</option>
                <option value="price">Prix croissant</option>
                <option value="name">Nom A-Z</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-terra-green text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-terra-green text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedFavorites.map((favorite) => (
              <TerraProductCard key={favorite.id} product={favorite.product} />
            ))}
          </div>
        ) : (
          /* Products List */
          <div className="space-y-4">
            {sortedFavorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {favorite.product.images?.[0] &&
                      typeof favorite.product.images[0] === 'object' && (
                        <img
                          src={favorite.product.images[0].url || ''}
                          alt={favorite.product.name || ''}
                          className="w-full h-full object-cover"
                        />
                      )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-terra-display font-semibold text-lg text-urban-black">
                        {favorite.product.name}
                      </h3>
                      <div className="text-right">
                        <div className="font-terra-display font-bold text-xl text-terra-green">
                          {favorite.product.price?.toFixed(2)}€
                        </div>
                        {favorite.product.ecoScore && (
                          <Badge
                            variant="secondary"
                            className="bg-terra-green/10 text-terra-green text-xs mt-1"
                          >
                            Éco {favorite.product.ecoScore}/10
                          </Badge>
                        )}
                      </div>
                    </div>

                    {favorite.product.shortDescription && (
                      <p className="text-gray-600 font-terra-body mb-4 line-clamp-2">
                        {favorite.product.shortDescription}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 font-terra-body">
                        Ajouté le {new Date(favorite.addedAt).toLocaleDateString('fr-FR')}
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/products/${favorite.product.slug}`}>
                          <Button variant="outline" size="sm">
                            Voir le produit
                          </Button>
                        </Link>

                        <Button
                          size="sm"
                          className="bg-terra-green hover:bg-terra-green/90"
                          onClick={() => {
                            const firstSize = favorite.product.sizes?.[0]?.size || '42'
                            const firstColor = favorite.product.colors?.[0]?.name || 'Noir'
                            addToCart(favorite.product, firstSize, firstColor, 1)
                          }}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Ajouter au panier
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromFavorites(favorite.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-terra-green/5 to-sage-green/5 rounded-2xl p-8">
          <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-4">
            Découvrez d'autres produits écoresponsables
          </h2>
          <p className="text-gray-600 font-terra-body mb-6 max-w-2xl mx-auto">
            Explorez notre collection complète de sneakers durables, conçues avec des matériaux
            recyclés et une fabrication européenne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="bg-terra-green hover:bg-terra-green/90">
                Voir tous les produits
              </Button>
            </Link>
            <Link href="/collections">
              <Button variant="outline">Découvrir nos collections</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
