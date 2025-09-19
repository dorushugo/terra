'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Heart,
  Truck,
  Shield,
  Leaf,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/providers/CartProvider'
import { useFavorites } from '@/providers/FavoritesProvider'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export const CartPageClient: React.FC = () => {
  const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()
  const { addToFavorites } = useFavorites()

  const shippingThreshold = 75
  const shippingCost = totalPrice >= shippingThreshold ? 0 : 7.9
  const finalTotal = totalPrice + shippingCost

  const handleMoveToFavorites = async (item: any) => {
    await addToFavorites(item.product)
    await removeFromCart(item.id)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-terra-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingCart className="h-12 w-12 text-terra-green" />
            </div>

            <h1 className="text-3xl font-terra-display font-bold text-urban-black mb-4">
              Votre panier est vide
            </h1>

            <p className="text-lg text-gray-600 font-terra-body mb-8 leading-relaxed">
              Découvrez nos sneakers écoresponsables et commencez votre shopping responsable.
            </p>

            <div className="space-y-4">
              <Link href="/products">
                <Button className="w-full bg-terra-green hover:bg-terra-green/90 text-white py-3">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Découvrir nos produits
                </Button>
              </Link>

              <Link href="/favorites">
                <Button variant="outline" className="w-full py-3">
                  <Heart className="h-5 w-5 mr-2" />
                  Voir mes favoris
                </Button>
              </Link>
            </div>

            {/* Avantages */}
            <div className="mt-12 grid grid-cols-1 gap-6 text-center">
              <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                <Truck className="h-6 w-6 text-terra-green" />
                <span className="font-terra-body text-sm text-gray-700">
                  Livraison gratuite dès 75€
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                <Shield className="h-6 w-6 text-terra-green" />
                <span className="font-terra-body text-sm text-gray-700">
                  Retours gratuits 30 jours
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                <Leaf className="h-6 w-6 text-terra-green" />
                <span className="font-terra-body text-sm text-gray-700">100% écoresponsable</span>
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
            <div className="p-3 bg-terra-green/10 rounded-xl">
              <ShoppingCart className="h-8 w-8 text-terra-green" />
            </div>
            <div>
              <h1 className="text-3xl font-terra-display font-bold text-urban-black">Panier</h1>
              <p className="text-gray-600 font-terra-body">
                {totalItems} {totalItems > 1 ? 'articles' : 'article'} dans votre panier
              </p>
            </div>
          </div>

          {/* Progress bar for free shipping */}
          {totalPrice < shippingThreshold && (
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-terra-body text-gray-600">Livraison gratuite</span>
                <span className="text-sm font-terra-body font-medium text-terra-green">
                  {(shippingThreshold - totalPrice).toFixed(2)}€ restants
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-terra-green h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalPrice / shippingThreshold) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 font-terra-body">
                Plus que {(shippingThreshold - totalPrice).toFixed(2)}€ pour bénéficier de la
                livraison gratuite !
              </p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0">
                    {item.product.images?.[0]?.image &&
                      typeof item.product.images[0].image === 'object' && (
                        <Image
                          src={getMediaUrl(
                            item.product.images[0].image.url,
                            item.product.images[0].image.updatedAt,
                          )}
                          alt={item.product.images[0].alt || item.product.name || ''}
                          width={96}
                          height={96}
                          className="w-full h-full object-contain p-3"
                        />
                      )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-terra-display font-semibold text-lg text-urban-black">
                          {item.product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600 font-terra-body">
                            {item.color} • Taille {item.size}
                          </span>
                          {item.product.ecoScore && (
                            <Badge
                              variant="secondary"
                              className="bg-terra-green/10 text-terra-green text-xs"
                            >
                              Éco {item.product.ecoScore}/10
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-terra-display font-bold text-xl text-urban-black">
                          {((item.product.price || 0) * item.quantity).toFixed(2)}€
                        </div>
                        <div className="text-sm text-gray-500 font-terra-body">
                          {(item.product.price || 0).toFixed(2)}€ / unité
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 rounded-l-lg transition-colors"
                          >
                            <Minus className="h-4 w-4 text-gray-500" />
                          </button>
                          <span className="px-3 py-2 font-terra-body font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 rounded-r-lg transition-colors"
                          >
                            <Plus className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveToFavorites(item)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          Favoris
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-center pt-4">
              <Button variant="ghost" onClick={clearCart} className="text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4 mr-2" />
                Vider le panier
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-terra-display font-bold text-urban-black mb-6">
                Récapitulatif
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-terra-body text-gray-600">Sous-total</span>
                  <span className="font-terra-body font-medium">{totalPrice.toFixed(2)}€</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-terra-body text-gray-600">Livraison</span>
                  <span className="font-terra-body font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-terra-green">Gratuite</span>
                    ) : (
                      `${shippingCost.toFixed(2)}€`
                    )}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="font-terra-display font-bold text-lg">Total</span>
                    <span className="font-terra-display font-bold text-xl text-terra-green">
                      {finalTotal.toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Link href="/checkout" className="block">
                  <Button className="w-full bg-terra-green hover:bg-terra-green/90 text-white py-3">
                    Commander • {finalTotal.toFixed(2)}€
                  </Button>
                </Link>

                <Link href="/products" className="block">
                  <Button variant="outline" className="w-full py-3">
                    Continuer mes achats
                  </Button>
                </Link>
              </div>

              {/* Garanties */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-5 w-5 text-terra-green flex-shrink-0" />
                  <span className="font-terra-body text-gray-700">Livraison gratuite dès 75€</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-terra-green flex-shrink-0" />
                  <span className="font-terra-body text-gray-700">Retours gratuits 30 jours</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Leaf className="h-5 w-5 text-terra-green flex-shrink-0" />
                  <span className="font-terra-body text-gray-700">Emballage écoresponsable</span>
                </div>
              </div>

              {/* Eco Impact */}
              <div className="mt-6 p-4 bg-terra-green/5 rounded-lg">
                <h3 className="font-terra-display font-semibold text-terra-green mb-2">
                  Impact environnemental
                </h3>
                <div className="space-y-1 text-sm font-terra-body text-gray-700">
                  <div>• {(totalItems * 0.6).toFixed(1)}kg de CO₂ évités</div>
                  <div>
                    • {totalItems} arbre{totalItems > 1 ? 's' : ''} planté
                    {totalItems > 1 ? 's' : ''}
                  </div>
                  <div>• 100% matériaux durables</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
