'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/providers/CartProvider'
import { getMediaUrl } from '@/utilities/getMediaUrl'

interface CartDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export const CartDropdown: React.FC<CartDropdownProps> = ({ isOpen, onClose }) => {
  const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    setIsAnimating(true)
    await updateQuantity(itemId, newQuantity)
    setTimeout(() => setIsAnimating(false), 200)
  }

  const handleRemoveItem = async (itemId: string) => {
    setIsAnimating(true)
    await removeFromCart(itemId)
    setTimeout(() => setIsAnimating(false), 200)
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
              <div className="p-2 bg-terra-green/10 rounded-xl">
                <ShoppingBag className="h-5 w-5 text-terra-green" />
              </div>
              <div>
                <h3 className="font-terra-display font-semibold text-urban-black">Panier</h3>
                <p className="text-sm text-gray-500 font-terra-body">
                  {totalItems} {totalItems > 1 ? 'articles' : 'article'}
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
          {cartItems.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="font-terra-display font-medium text-urban-black mb-2">
                Votre panier est vide
              </h4>
              <p className="text-sm text-gray-500 font-terra-body mb-4">
                Découvrez nos collections écoresponsables
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
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border-b border-gray-50 hover:bg-gray-25 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0">
                      {item.product.images?.[0] &&
                        typeof item.product.images[0].image === 'object' && (
                          <Image
                            src={getMediaUrl(
                              item.product.images[0].image.url,
                              item.product.images[0].image.updatedAt,
                            )}
                            alt={item.product.title || ''}
                            width={64}
                            height={64}
                            className="w-full h-full object-contain p-2"
                          />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-terra-body font-medium text-sm text-urban-black truncate">
                        {item.product.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 font-terra-body">
                          {item.color} • Taille {item.size}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-terra-display font-semibold text-sm text-urban-black">
                          {((item.product.price || 0) * item.quantity).toFixed(2)}€
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="h-3 w-3 text-gray-500" />
                          </button>
                          <span className="w-8 text-center text-sm font-terra-body font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="h-3 w-3 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
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
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-25">
            <div className="flex items-center justify-between mb-4">
              <span className="font-terra-body font-medium text-gray-600">Total</span>
              <span className="font-terra-display font-bold text-lg text-urban-black">
                {totalPrice.toFixed(2)}€
              </span>
            </div>

            <div className="space-y-2">
              <Link href="/cart" onClick={onClose} className="block">
                <Button variant="outline" className="w-full justify-center">
                  Voir le panier
                </Button>
              </Link>
              <Link href="/checkout" onClick={onClose} className="block">
                <Button className="w-full bg-terra-green hover:bg-terra-green/90 justify-center">
                  Commander • {totalPrice.toFixed(2)}€
                </Button>
              </Link>
            </div>

            <p className="text-xs text-gray-500 font-terra-body text-center mt-3">
              Livraison gratuite dès 75€ d'achat
            </p>
          </div>
        )}
      </div>
    </>
  )
}
