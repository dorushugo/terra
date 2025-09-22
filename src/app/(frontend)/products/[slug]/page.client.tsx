'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TerraEcoScore } from '@/components/terra/TerraEcoScore'
import { TerraProductCard } from '@/components/terra/TerraProductCard'
import { FavoriteButton } from '@/components/terra/favorites/FavoriteButton'
import { ViewTransition } from '@/components/ui/ViewTransition'
import { useCart } from '@/providers/CartProvider'
import { useFavorites } from '@/providers/FavoritesProvider'
import type { Product } from '@/payload-types'
import {
  Heart,
  ShoppingCart,
  Truck,
  RotateCcw,
  Shield,
  Leaf,
  Check,
  AlertCircle,
} from 'lucide-react'

interface ProductPageClientProps {
  product: Product
  relatedProducts: Product[]
}

export const ProductPageClient: React.FC<ProductPageClientProps> = ({
  product,
  relatedProducts,
}) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [showSizeError, setShowSizeError] = useState(false)

  const { addToCart } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getCollectionName = (collection: string) => {
    switch (collection) {
      case 'origin':
        return 'TERRA Origin'
      case 'move':
        return 'TERRA Move'
      case 'limited':
        return 'TERRA Limited'
      default:
        return collection
    }
  }

  const selectedColor = product.colors?.[selectedColorIndex]
  const selectedSize = selectedSizeIndex !== null ? product.sizes?.[selectedSizeIndex] : null

  const handleAddToCart = () => {
    // Si une seule couleur, utiliser la première automatiquement
    const colorToUse =
      selectedColor || (product.colors && product.colors.length === 1 ? product.colors[0] : null)

    if (!colorToUse || !selectedSize || isAddingToCart) {
      if (!colorToUse || !selectedSize) {
        setShowSizeError(true)
        setTimeout(() => setShowSizeError(false), 3000)
      }
      return
    }

    console.log('🔄 handleAddToCart appelé - isAddingToCart:', isAddingToCart)
    setIsAddingToCart(true)

    try {
      addToCart(product, selectedSize.size, colorToUse.name || colorToUse.value, 1)

      setJustAdded(true)
      setTimeout(() => {
        setJustAdded(false)
        setIsAddingToCart(false)
      }, 1500) // Réduire le délai à 1.5s
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error)
      setIsAddingToCart(false)
    }
  }

  const handleToggleFavorite = () => {
    toggleFavorite(product)
  }

  const isInStock = selectedSize ? (selectedSize.availableStock || 0) > 0 : false
  const canAddToCart = selectedColor && selectedSize && isInStock

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Navigation breadcrumb */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm font-terra-body text-gray-600">
            <ViewTransition href="/" className="hover:text-terra-green transition-colors">
              Accueil
            </ViewTransition>
            <span className="mx-2">/</span>
            <ViewTransition href="/products" className="hover:text-terra-green transition-colors">
              Produits
            </ViewTransition>
            <span className="mx-2">/</span>
            <span className="text-urban-black">{product.title}</span>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Galerie d'images */}
          <div className="space-y-4">
            {/* Image principale */}
            <div className="aspect-square relative overflow-hidden rounded-lg bg-white">
              {product.images?.[selectedImageIndex] &&
                typeof product.images[selectedImageIndex].image === 'object' && (
                  <Image
                    src={getMediaUrl(
                      product.images[selectedImageIndex].image.url,
                      product.images[selectedImageIndex].image.updatedAt,
                    )}
                    alt={product.images[selectedImageIndex].alt || product.title}
                    fill
                    className="object-contain p-6 transition-terra-smooth"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ viewTransitionName: `product-image-${product.slug}` }}
                  />
                )}
            </div>

            {/* Miniatures */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(0, 4).map((imageItem, index) => (
                  <div
                    key={index}
                    className={`aspect-square relative overflow-hidden rounded-lg bg-white cursor-pointer transition-all duration-200 ${
                      selectedImageIndex === index ? 'ring-2 ring-terra-green' : 'hover:opacity-80'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    {typeof imageItem.image === 'object' && (
                      <Image
                        src={getMediaUrl(imageItem.image.url, imageItem.image.updatedAt)}
                        alt={imageItem.alt || `${product.title} ${index + 1}`}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 768px) 25vw, 12vw"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            {/* En-tête */}
            <div>
              <Badge variant="secondary" className="mb-3 bg-terra-green text-white">
                {getCollectionName(product.collection)}
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-terra-display font-bold text-urban-black mb-4">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-terra-display font-bold text-terra-green">
                  {formatPrice(product.price)}
                </span>
                <TerraEcoScore
                  score={product.ecoScore}
                  size="md"
                  showDetails={true}
                  details={product.sustainability?.materials?.map((m) => m.name) || []}
                />
              </div>
              <p className="text-gray-600 font-terra-body text-lg">{product.shortDescription}</p>
            </div>

            {/* Sélecteurs */}
            <div className="space-y-6">
              {/* Couleurs - Seulement si plus d'une couleur */}
              {product.colors && product.colors.length > 1 && (
                <div>
                  <h3 className="font-terra-display font-semibold text-urban-black mb-3">
                    Couleur: {selectedColor?.name || 'Sélectionner'}
                  </h3>
                  <div className="flex gap-3">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                          selectedColorIndex === index
                            ? 'border-terra-green ring-2 ring-terra-green ring-opacity-30'
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

              {/* Tailles */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="font-terra-display font-semibold text-urban-black mb-3">
                    Pointure {selectedSize ? `- ${selectedSize.size}` : ''}
                  </h3>
                  <div className="grid grid-cols-6 gap-2">
                    {product.sizes.map((sizeItem, index) => {
                      const isAvailable = (sizeItem.availableStock || 0) > 0
                      const isSelected = selectedSizeIndex === index

                      return (
                        <Button
                          key={index}
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          className={`transition-all duration-200 ${
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
                  {selectedSize && (
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedSize.availableStock > 0
                        ? `${selectedSize.availableStock} en stock`
                        : 'Rupture de stock'}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Message d'erreur */}
            {showSizeError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700 font-terra-body">
                  Veuillez sélectionner une couleur et une taille
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className={`flex-1 font-terra-display font-semibold py-6 transition-all duration-200 ${
                    justAdded
                      ? 'bg-green-600 hover:bg-green-700'
                      : canAddToCart
                        ? 'bg-terra-green hover:bg-terra-green/90'
                        : 'bg-gray-300 cursor-not-allowed'
                  } text-white`}
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !canAddToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Ajout en cours...
                    </>
                  ) : justAdded ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Ajouté au panier !
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Ajouter au panier
                    </>
                  )}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className={`transition-colors duration-200 ${
                    isFavorite(product.id)
                      ? 'border-red-500 text-red-500 hover:bg-red-50'
                      : 'border-terra-green text-terra-green hover:bg-terra-green hover:text-white'
                  }`}
                  onClick={handleToggleFavorite}
                >
                  <Heart className={`h-5 w-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center py-4 border-t border-gray-200">
                <div className="flex flex-col items-center text-sm font-terra-body text-gray-600">
                  <Truck className="h-5 w-5 text-terra-green mb-1" />
                  <span>Livraison gratuite dès 80€</span>
                </div>
                <div className="flex flex-col items-center text-sm font-terra-body text-gray-600">
                  <RotateCcw className="h-5 w-5 text-terra-green mb-1" />
                  <span>Retours 30 jours</span>
                </div>
                <div className="flex flex-col items-center text-sm font-terra-body text-gray-600">
                  <Shield className="h-5 w-5 text-terra-green mb-1" />
                  <span>Garantie 2 ans</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets détails */}
        <div className="border-t pt-16">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {/* Matériaux durables */}
              {product.sustainability?.materials && product.sustainability.materials.length > 0 && (
                <section>
                  <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-8 flex items-center">
                    <Leaf className="mr-3 h-6 w-6 text-terra-green" />
                    Matériaux durables
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {product.sustainability.materials.map((material, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-terra-display font-semibold text-urban-black mb-2">
                          {material.name}
                        </h3>
                        <p className="text-gray-600 font-terra-body text-sm mb-3">
                          {material.description}
                        </p>
                        <div className="text-xs text-terra-green font-terra-body font-medium">
                          {material.sustainabilityBenefit}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Caractéristiques */}
              {product.features && product.features.length > 0 && (
                <section>
                  <h2 className="text-2xl font-terra-display font-bold text-urban-black mb-8">
                    Caractéristiques
                  </h2>
                  <ul className="grid md:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center font-terra-body text-gray-700">
                        <div className="w-2 h-2 bg-terra-green rounded-full mr-3 flex-shrink-0"></div>
                        {feature.feature}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-16 border-t">
            <h2 className="text-3xl font-terra-display font-bold text-urban-black mb-8 text-center">
              Vous pourriez aussi aimer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <TerraProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
