'use client'

import React, { useState } from 'react'
import { TerraProductCard } from './TerraProductCard'
import { Button } from '@/components/ui/button'
import { ProductGrid } from '@/components/ui/PageTransition'
import { Loader2 } from 'lucide-react'
import type { Product } from '@/payload-types'

interface LoadMoreProductsProps {
  initialProducts: Product[]
  totalProducts?: number
  className?: string
}

export const LoadMoreProducts: React.FC<LoadMoreProductsProps> = ({
  initialProducts,
  totalProducts,
  className = '',
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(totalProducts ? products.length < totalProducts : true)

  const loadMore = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/products/featured', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit: 6, // Load 6 more products each time
          offset: products.length,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to load more products')
      }

      const data = await response.json()

      if (data.docs && data.docs.length > 0) {
        setProducts((prevProducts) => [...prevProducts, ...data.docs])

        // Check if there are more products to load
        if (
          data.docs.length < 6 ||
          (totalProducts && products.length + data.docs.length >= totalProducts)
        ) {
          setHasMore(false)
        }
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more products:', error)
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Show fallback if no products
  if (products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-600 font-terra-body text-lg">
          Aucun produit mis en avant pour le moment.
        </p>
        <p className="text-gray-500 font-terra-body text-sm mt-2">
          Revenez bientôt pour découvrir nos nouveautés !
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <ProductGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
        {products.map((product) => (
          <TerraProductCard key={product.id} product={product} />
        ))}
      </ProductGrid>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={loadMore}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="font-terra-body font-semibold px-8 py-3 border-terra-green text-terra-green hover:bg-terra-green hover:text-white transition-terra-smooth"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : (
              'Charger plus de produits'
            )}
          </Button>
        </div>
      )}

      {!hasMore && products.length > 9 && (
        <div className="text-center">
          <p className="text-gray-600 font-terra-body">
            Vous avez vu tous nos produits mis en avant
          </p>
        </div>
      )}
    </div>
  )
}
