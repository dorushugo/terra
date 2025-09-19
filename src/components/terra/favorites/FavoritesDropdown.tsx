'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useFavorites } from '@/providers/FavoritesProvider'
import { useCart } from '@/providers/CartProvider'
import { getMediaUrl } from '@/utilities/getMediaUrl'

interface FavoritesDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export const FavoritesDropdown: React.FC<FavoritesDropdownProps> = ({ isOpen, onClose }) => {
  const { favorites, removeFromFavorites } = useFavorites()
  const { addToCart } = useCart()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleRemoveFavorite = async (productId: string) => {
    setIsAnimating(true)
    await removeFromFavorites(productId)
    setTimeout(() => setIsAnimating(false), 200)
  }

  const handleAddToCart = async (product: any, size: string = '42', color: string = 'Noir') => {
    // Pour la démo, on utilise des valeurs par défaut
    // En production, il faudrait demander à l'utilisateur de choisir
    await addToCart(product, size, color, 1)

    // Optionnel : retirer des favoris après ajout au panier
    // await removeFromFavorites(product.id)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-xl">
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-terra-display font-semibold text-urban-black">Favoris</h3>
                <p className="text-sm text-gray-500 font-terra-body">
                  {favorites.length} {favorites.length > 1 ? 'produits' : 'produit'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRight className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="max-h-96 overflow-y-auto">
          {favorites.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-400" />
              </div>
              <h4 className="font-terra-display font-medium text-urban-black mb-2">
                Aucun favori pour le moment
              </h4>
              <p className="text-sm text-gray-500 font-terra-body mb-4">
                Ajoutez vos sneakers préférées à votre liste de souhaits
              </p>
              <Link href="/products" onClick={onClose}>
                <Button className="bg-terra-green hover:bg-terra-green/90">
                  Découvrir nos produits
                </Button>
              </Link>
            </div>
          ) : (
            <div
              className={`transition-opacity duration-200 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}
            >
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="p-4 border-b border-gray-50 hover:bg-gray-25 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      {favorite.product.images?.[0] &&
                        typeof favorite.product.images[0] === 'object' && (
                          <Image
                            src={getMediaUrl(favorite.product.images[0])}
                            alt={favorite.product.name || ''}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-terra-body font-medium text-sm text-urban-black truncate">
                        {favorite.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-terra-display font-semibold text-sm text-urban-black">
                          {favorite.product.price?.toFixed(2)}€
                        </span>
                        {favorite.product.ecoScore && (
                          <Badge
                            variant="secondary"
                            className="bg-terra-green/10 text-terra-green text-xs"
                          >
                            Éco {favorite.product.ecoScore}/10
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleAddToCart(favorite.product)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-terra-green text-white text-xs font-terra-body rounded-lg hover:bg-terra-green/90 transition-colors"
                        >
                          <ShoppingBag className="h-3 w-3" />
                          Ajouter
                        </button>
                        <Link
                          href={`/products/${favorite.product.slug}`}
                          onClick={onClose}
                          className="px-3 py-1.5 border border-gray-200 text-xs font-terra-body rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Voir
                        </Link>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemoveFavorite(favorite.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                    >
                      <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-25">
            <Link href="/favorites" onClick={onClose} className="block">
              <Button variant="outline" className="w-full justify-center">
                Voir tous mes favoris
              </Button>
            </Link>

            <p className="text-xs text-gray-500 font-terra-body text-center mt-3">
              Vos favoris sont sauvegardés localement
            </p>
          </div>
        )}
      </div>
    </>
  )
}
