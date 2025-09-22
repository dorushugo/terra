'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Eye, Check, X } from 'lucide-react'
import { TerraEcoScore } from './TerraEcoScore'
import { FavoriteButton } from './favorites/FavoriteButton'
import { ViewTransition } from '@/components/ui/ViewTransition'
import { useCart } from '@/providers/CartProvider'
import type { Product } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

interface TerraProductCardProps {
  product: Product
  className?: string
  viewMode?: 'grid' | 'list'
}

export const TerraProductCard: React.FC<TerraProductCardProps> = ({
  product,
  className,
  viewMode = 'grid',
}) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [showQuickSelect, setShowQuickSelect] = useState(false)
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number | null>(null)
  const { addToCart } = useCart()

  const mainImage = product.images?.[0]
  const hoverImage = product.images?.[1] || product.images?.[0]
  const selectedColor = product.colors?.[selectedColorIndex]
  const selectedSize = selectedSizeIndex !== null ? product.sizes?.[selectedSizeIndex] : null

  const mainImageDoc =
    mainImage && typeof (mainImage as any).image === 'object' ? (mainImage as any).image : null
  const hoverImageDoc =
    hoverImage && typeof (hoverImage as any).image === 'object' ? (hoverImage as any).image : null
  const mainImageUrl = mainImageDoc?.url
    ? getMediaUrl(mainImageDoc.url, (mainImageDoc as any).updatedAt)
    : ''
  const hoverImageUrl = hoverImageDoc?.url
    ? getMediaUrl(hoverImageDoc.url, (hoverImageDoc as any).updatedAt)
    : ''

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Si une seule couleur, utiliser la première automatiquement
    const colorToUse =
      selectedColor || (product.colors && product.colors.length === 1 ? product.colors[0] : null)

    // Si on a déjà une sélection complète, ajouter directement
    if (colorToUse && selectedSize) {
      handleAddToCart(e)
    } else {
      // Sinon, ouvrir la modal de sélection rapide
      setShowQuickSelect(true)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Si une seule couleur, utiliser la première automatiquement
    const colorToUse =
      selectedColor || (product.colors && product.colors.length === 1 ? product.colors[0] : null)

    if (!colorToUse || !selectedSize || isAddingToCart) {
      if (!colorToUse || !selectedSize) {
        setShowQuickSelect(true)
      }
      return
    }

    setIsAddingToCart(true)

    try {
      addToCart(product, selectedSize.size, colorToUse.name || colorToUse.value, 1)

      setJustAdded(true)
      setShowQuickSelect(false)
      setTimeout(() => {
        setJustAdded(false)
        setIsAddingToCart(false)
      }, 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setIsAddingToCart(false)
    }
  }

  const closeQuickSelect = () => {
    setShowQuickSelect(false)
    setSelectedColorIndex(0)
    setSelectedSizeIndex(null)
  }

  return (
    <Card
      className={`group relative overflow-hidden bg-white hover:shadow-xl transition-terra-smooth hover-lift ${className}`}
      style={{ viewTransitionName: `product-card-${product.slug}` }}
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        {/* Image principale */}
        {mainImageUrl ? (
          <Image
            src={mainImageUrl}
            alt={mainImage?.alt || product.title}
            fill
            className="object-contain p-6 transition-terra-smooth group-hover:opacity-0 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            style={{ viewTransitionName: `product-image-${product.slug}` }}
          />
        ) : (
          <Image
            src="/website-template-OG.webp"
            alt={product.title}
            fill
            className="object-contain p-6 transition-terra-smooth group-hover:opacity-0 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            style={{ viewTransitionName: `product-image-${product.slug}` }}
          />
        )}

        {/* Image au hover */}
        {hoverImageUrl && (
          <Image
            src={hoverImageUrl}
            alt={hoverImage?.alt || product.title}
            fill
            className="object-contain p-6 opacity-0 transition-terra-smooth group-hover:opacity-100 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge principal (coin supérieur gauche) */}
        <div className="absolute top-3 left-3 z-10">
          {product.isNewArrival ? (
            <span className="bg-terra-green text-white px-3 py-1 text-xs font-medium rounded-full shadow-lg">
              Nouveau
            </span>
          ) : product.isFeatured ? (
            <span className="bg-sage-green text-white px-3 py-1 text-xs font-medium rounded-full shadow-lg">
              Coup de cœur
            </span>
          ) : null}
        </div>

        {/* Bouton favoris (coin supérieur droit) */}
        <div className="absolute top-3 right-3 z-20">
          <FavoriteButton product={product} variant="floating" size="sm" />
        </div>

        {/* Actions au hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 z-10 pointer-events-none">
          <div className="pointer-events-auto flex gap-3">
            <ViewTransition href={`/products/${product.slug}`}>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
              >
                <Eye className="h-4 w-4 mr-2" />
                Voir
              </Button>
            </ViewTransition>

            <Button
              size="sm"
              className={`shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100 ${
                justAdded
                  ? 'bg-terra-green hover:bg-terra-green/80'
                  : 'bg-terra-green hover:bg-terra-green/90'
              }`}
              onClick={handleQuickAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : justAdded ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <ShoppingBag className="h-4 w-4 mr-2" />
              )}
              {justAdded ? 'Ajouté !' : 'Ajouter'}
            </Button>
          </div>
        </div>

        {/* Indicateurs en bas - Une seule ligne pour éviter les superpositions */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
          {/* Couleurs disponibles - Seulement si plus d'une couleur */}
          {product.colors && product.colors.length > 1 && (
            <div className="flex gap-1.5">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 3 && (
                <div className="w-4 h-4 rounded-full bg-gray-200 border-2 border-white shadow-lg flex items-center justify-center">
                  <span className="text-xs text-gray-600 font-bold">
                    +{product.colors.length - 3}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Stock indicator */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex-shrink-0">
              {product.sizes.some((size: any) => (size.availableStock || 0) > 0) ? (
                <span className="bg-terra-green text-white px-2 py-1 text-xs font-medium rounded-full shadow-lg">
                  Dispo
                </span>
              ) : (
                <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-full shadow-lg">
                  Rupture
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <ViewTransition
          href={`/products/${product.slug}`}
          className="block group-hover:scale-[1.02] transition-terra-safe"
        >
          <div className="space-y-3">
            {/* Titre et prix */}
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-terra-display font-semibold text-urban-black text-sm leading-tight line-clamp-2 flex-1 group-hover:text-terra-green transition-colors">
                {product.title}
              </h3>
              <div className="text-right">
                <span className="font-terra-display font-bold text-terra-green text-lg">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="text-xs text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </div>
                )}
              </div>
            </div>

            {/* Description courte */}
            {product.shortDescription && (
              <p className="text-xs text-gray-600 font-terra-body line-clamp-2 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Éco-score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TerraEcoScore score={product.ecoScore || 5} size="sm" />
                <span className="text-xs text-gray-600 font-terra-body">Éco-score</span>
              </div>
            </div>

            {/* Matériaux durables */}
            {product.sustainability?.materials && product.sustainability.materials.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.sustainability.materials.slice(0, 2).map((material, index) => (
                  <span
                    key={index}
                    className="text-xs bg-sage-green/15 text-sage-green px-2.5 py-1 rounded-full font-terra-body font-medium border border-sage-green/20"
                  >
                    {material.name}
                  </span>
                ))}
                {product.sustainability.materials.length > 2 && (
                  <span className="text-xs text-gray-400 font-terra-body">
                    +{product.sustainability.materials.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Tailles disponibles */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex items-center gap-1 pt-1">
                <span className="text-xs text-gray-500 font-terra-body">Tailles:</span>
                <div className="flex gap-1">
                  {product.sizes.slice(0, 6).map((size: any, index) => (
                    <span
                      key={index}
                      className={`text-xs px-1.5 py-0.5 rounded border ${
                        (size.availableStock || 0) > 0
                          ? 'border-gray-200 text-gray-600'
                          : 'border-gray-100 text-gray-300 line-through'
                      }`}
                    >
                      {size.size}
                    </span>
                  ))}
                  {product.sizes.length > 6 && <span className="text-xs text-gray-400">...</span>}
                </div>
              </div>
            )}
          </div>
        </ViewTransition>
      </CardContent>

      {/* Modal de sélection rapide */}
      {showQuickSelect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            {/* Bouton fermer */}
            <button
              onClick={closeQuickSelect}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Contenu de la modal */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-terra-display font-bold text-urban-black mb-2">
                  {product.title}
                </h3>
                <p className="text-2xl font-terra-display font-bold text-terra-green">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Sélection couleur - Seulement si plus d'une couleur */}
              {product.colors && product.colors.length > 1 && (
                <div>
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                    Couleur: {selectedColor?.name || 'Sélectionner'}
                  </h4>
                  <div className="flex gap-2">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                          selectedColorIndex === index
                            ? 'border-terra-green ring-2 ring-terra-green ring-opacity-30 scale-110'
                            : 'border-gray-300 hover:border-terra-green'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                        onClick={() => setSelectedColorIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sélection taille */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h4 className="font-terra-display font-semibold text-urban-black mb-2">
                    Pointure {selectedSize ? `- ${selectedSize.size}` : ''}
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((sizeItem, index) => {
                      const isAvailable = (sizeItem.availableStock || 0) > 0
                      const isSelected = selectedSizeIndex === index

                      return (
                        <Button
                          key={index}
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          className={`text-xs transition-all duration-200 ${
                            isSelected
                              ? 'bg-terra-green hover:bg-terra-green/90 text-white border-terra-green'
                              : isAvailable
                                ? 'hover:bg-terra-green hover:text-white hover:border-terra-green'
                                : 'opacity-50 cursor-not-allowed bg-gray-100'
                          }`}
                          disabled={!isAvailable}
                          onClick={() => setSelectedSizeIndex(isSelected ? null : index)}
                        >
                          {sizeItem.size}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={closeQuickSelect} className="flex-1">
                  Annuler
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={
                    isAddingToCart ||
                    (product.colors && product.colors.length > 1 && !selectedColor) ||
                    !selectedSize
                  }
                  className={`flex-1 ${
                    justAdded
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-terra-green hover:bg-terra-green/90'
                  } text-white`}
                >
                  {isAddingToCart ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Ajout...
                    </>
                  ) : justAdded ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Ajouté !
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Ajouter
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
