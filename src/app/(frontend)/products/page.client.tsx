'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { TerraProductCard } from '@/components/terra/TerraProductCard'
import { TerraFilters } from '@/components/terra/TerraFilters'
import { PageTransition, ProductGrid } from '@/components/ui/PageTransition'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Product } from '@/payload-types'
import { Grid, List } from 'lucide-react'

interface ProductsClientProps {
  initialProducts: Product[]
}

const COLLECTIONS_LABELS = {
  origin: 'TERRA Origin',
  move: 'TERRA Move',
  limited: 'TERRA Limited',
} as const

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    collections: [] as string[],
    priceRange: [50, 300] as [number, number],
    colors: [] as string[],
    sizes: [] as string[],
    ecoScore: [1, 10] as [number, number],
    inStock: false,
    newArrivals: false,
    featured: false,
  })

  // Appliquer les filtres depuis l'URL au chargement
  useEffect(() => {
    const collectionParam = searchParams.get('collection')
    if (collectionParam) {
      setFilters((prev) => ({
        ...prev,
        collections: [collectionParam],
      }))
    }
  }, [searchParams])

  // Titre dynamique basé sur les filtres
  const getPageTitle = () => {
    if (filters.collections.length === 1) {
      const collection = filters.collections[0] as keyof typeof COLLECTIONS_LABELS
      return COLLECTIONS_LABELS[collection] || 'Tous nos produits'
    }
    return 'Tous nos produits'
  }

  const getPageDescription = () => {
    if (filters.collections.length === 1) {
      const collection = filters.collections[0]
      const descriptions = {
        origin: "L'essentiel réinventé - Design minimaliste et matériaux nobles",
        move: 'Performance urbaine - Innovation technique et style urbain',
        limited: 'Édition exclusive - Créations uniques en édition limitée',
      } as const
      return (
        descriptions[collection as keyof typeof descriptions] ||
        'Découvrez notre collection complète de sneakers écoresponsables'
      )
    }
    return 'Découvrez notre collection complète de sneakers écoresponsables'
  }

  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filtrer et trier les produits
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...initialProducts]

    // Appliquer les filtres
    if (filters.collections.length > 0) {
      filtered = filtered.filter((product) => filters.collections.includes(product.collection))
    }

    if (filters.colors.length > 0) {
      filtered = filtered.filter((product) =>
        product.colors?.some((color) => filters.colors.includes(color.value)),
      )
    }

    if (filters.sizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.sizes?.some((size) => filters.sizes.includes(size.size)),
      )
    }

    filtered = filtered.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    filtered = filtered.filter((product) => {
      const ecoScore = product.ecoScore || 0
      return ecoScore >= filters.ecoScore[0] && ecoScore <= filters.ecoScore[1]
    })

    if (filters.inStock) {
      filtered = filtered.filter((product) =>
        product.sizes?.some((size) => (size.availableStock || 0) > 0),
      )
    }

    if (filters.newArrivals) {
      filtered = filtered.filter((product) => product.isNewArrival)
    }

    if (filters.featured) {
      filtered = filtered.filter((product) => product.isFeatured)
    }

    // Appliquer le tri
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'eco-score':
        filtered.sort((a, b) => (b.ecoScore || 0) - (a.ecoScore || 0))
        break
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return filtered
  }, [initialProducts, filters, sortBy])

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  return (
    <PageTransition animation="page" className="min-h-screen bg-white pt-16">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <PageTransition animation="text" delay={100}>
              <div>
                <h1 className="text-3xl sm:text-4xl font-terra-display font-bold text-urban-black mb-2">
                  {getPageTitle()}
                </h1>
                <p className="text-gray-600 font-terra-body">{getPageDescription()}</p>
              </div>
            </PageTransition>

            <PageTransition animation="content" delay={200}>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 font-terra-body">
                  {filteredAndSortedProducts.length} produit
                  {filteredAndSortedProducts.length > 1 ? 's' : ''}
                </span>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Nouveautés</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    <SelectItem value="eco-score">Éco-score</SelectItem>
                    <SelectItem value="name">Nom A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'terra' : 'ghost'}
                    size="sm"
                    className={`border-r ${viewMode === 'grid' ? 'bg-terra-green hover:bg-terra-green/90 text-white' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'terra' : 'ghost'}
                    size="sm"
                    className={
                      viewMode === 'list' ? 'bg-terra-green hover:bg-terra-green/90 text-white' : ''
                    }
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </PageTransition>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtres */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <TerraFilters filters={filters} onFiltersChange={handleFiltersChange} />
            </div>
          </aside>

          {/* Grille de produits */}
          <main className="flex-1">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Grid className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-terra-display font-semibold text-gray-900 mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-600 font-terra-body">
                  Essayez d'ajuster vos filtres pour voir plus de résultats
                </p>
                <Button
                  variant="terra"
                  onClick={() =>
                    setFilters({
                      collections: [],
                      priceRange: [50, 300],
                      colors: [],
                      sizes: [],
                      ecoScore: [1, 10],
                      inStock: false,
                      newArrivals: false,
                      featured: false,
                    })
                  }
                  className="mt-4 bg-terra-green hover:bg-terra-green/90 text-white"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              <ProductGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <TerraProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </ProductGrid>
            ) : (
              <PageTransition animation="content" delay={300}>
                <div className="space-y-4">
                  {filteredAndSortedProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={`grid-enter grid-stagger-${Math.min(index + 1, 6)}`}
                    >
                      <TerraProductCard product={product} viewMode={viewMode} />
                    </div>
                  ))}
                </div>
              </PageTransition>
            )}
          </main>
        </div>
      </div>
    </PageTransition>
  )
}
