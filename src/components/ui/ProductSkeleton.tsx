import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface ProductSkeletonProps {
  count?: number
  className?: string
}

export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 1, className }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className={`overflow-hidden bg-white ${className}`}>
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            {/* Image skeleton */}
            <div className="absolute inset-0 loading-skeleton rounded-t-lg" />
            
            {/* Badge skeleton */}
            <div className="absolute top-3 left-3 z-10">
              <div className="loading-skeleton h-6 w-16 rounded-full" />
            </div>
            
            {/* Favorite button skeleton */}
            <div className="absolute top-3 right-3 z-10">
              <div className="loading-skeleton h-8 w-8 rounded-full" />
            </div>
          </div>

          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Title and price skeleton */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 space-y-2">
                  <div className="loading-skeleton h-4 w-3/4 rounded" />
                  <div className="loading-skeleton h-3 w-1/2 rounded" />
                </div>
                <div className="loading-skeleton h-6 w-16 rounded" />
              </div>

              {/* Description skeleton */}
              <div className="space-y-2">
                <div className="loading-skeleton h-3 w-full rounded" />
                <div className="loading-skeleton h-3 w-2/3 rounded" />
              </div>

              {/* Eco-score skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="loading-skeleton h-4 w-20 rounded" />
                  <div className="loading-skeleton h-3 w-16 rounded" />
                </div>
              </div>

              {/* Materials skeleton */}
              <div className="flex gap-2">
                <div className="loading-skeleton h-6 w-20 rounded-full" />
                <div className="loading-skeleton h-6 w-24 rounded-full" />
              </div>

              {/* Sizes skeleton */}
              <div className="flex items-center gap-2">
                <div className="loading-skeleton h-3 w-12 rounded" />
                <div className="flex gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="loading-skeleton h-5 w-8 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

// Skeleton pour la page de détail produit
export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Breadcrumb skeleton */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="loading-skeleton h-4 w-16 rounded" />
            <span className="text-gray-300">/</span>
            <div className="loading-skeleton h-4 w-20 rounded" />
            <span className="text-gray-300">/</span>
            <div className="loading-skeleton h-4 w-32 rounded" />
          </div>
        </div>
      </nav>

      {/* Content skeleton */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images skeleton */}
          <div className="space-y-4">
            <div className="loading-skeleton aspect-square rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="loading-skeleton aspect-square rounded-lg" />
              ))}
            </div>
          </div>

          {/* Product info skeleton */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="loading-skeleton h-8 w-3/4 rounded" />
              <div className="loading-skeleton h-6 w-24 rounded" />
              <div className="space-y-2">
                <div className="loading-skeleton h-4 w-full rounded" />
                <div className="loading-skeleton h-4 w-5/6 rounded" />
                <div className="loading-skeleton h-4 w-2/3 rounded" />
              </div>
            </div>

            {/* Colors skeleton */}
            <div className="space-y-3">
              <div className="loading-skeleton h-5 w-20 rounded" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="loading-skeleton h-8 w-8 rounded-full" />
                ))}
              </div>
            </div>

            {/* Sizes skeleton */}
            <div className="space-y-3">
              <div className="loading-skeleton h-5 w-16 rounded" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="loading-skeleton h-10 rounded" />
                ))}
              </div>
            </div>

            {/* Actions skeleton */}
            <div className="space-y-3">
              <div className="loading-skeleton h-12 w-full rounded" />
              <div className="loading-skeleton h-10 w-full rounded" />
            </div>
          </div>
        </div>

        {/* Related products skeleton */}
        <div className="space-y-8">
          <div className="loading-skeleton h-8 w-64 rounded mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductSkeleton count={4} />
          </div>
        </div>
      </div>
    </div>
  )
}
