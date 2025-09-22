'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { X, Filter, Leaf } from 'lucide-react'

interface FilterState {
  collections: string[]
  priceRange: [number, number]
  colors: string[]
  sizes: string[]
  ecoScore: [number, number]
  inStock: boolean
  newArrivals: boolean
  featured: boolean
}

interface TerraFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  isLoading?: boolean
  className?: string
}

const COLLECTIONS = [
  { value: 'origin', label: 'TERRA Origin', count: 12 },
  { value: 'move', label: 'TERRA Move', count: 8 },
  { value: 'limited', label: 'TERRA Limited', count: 5 },
]

const COLORS = [
  { value: '#F5F5F0', name: 'Stone White', label: 'Stone White' },
  { value: '#2D5A27', name: 'Terra Green', label: 'Terra Green' },
  { value: '#1A1A1A', name: 'Urban Black', label: 'Urban Black' },
  { value: '#9CAF88', name: 'Sage Green', label: 'Sage Green' },
  { value: '#8B4513', name: 'Earth Brown', label: 'Earth Brown' },
  { value: '#708090', name: 'Stone Gray', label: 'Stone Gray' },
]

const SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']

export const TerraFilters: React.FC<TerraFiltersProps> = ({
  filters,
  onFiltersChange,
  isLoading = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleCollectionChange = (collection: string, checked: boolean) => {
    const newCollections = checked
      ? [...filters.collections, collection]
      : filters.collections.filter((c) => c !== collection)

    onFiltersChange({ ...filters, collections: newCollections })
  }

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...filters.colors, color]
      : filters.colors.filter((c) => c !== color)

    onFiltersChange({ ...filters, colors: newColors })
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked ? [...filters.sizes, size] : filters.sizes.filter((s) => s !== size)

    onFiltersChange({ ...filters, sizes: newSizes })
  }

  const clearAllFilters = () => {
    onFiltersChange({
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

  const getActiveFiltersCount = () => {
    return (
      filters.collections.length +
      filters.colors.length +
      filters.sizes.length +
      (filters.inStock ? 1 : 0) +
      (filters.newArrivals ? 1 : 0) +
      (filters.featured ? 1 : 0)
    )
  }

  const activeCount = getActiveFiltersCount()

  return (
    <div className={className}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
            {activeCount > 0 && (
              <Badge variant="secondary" className="bg-terra-green text-white">
                {activeCount}
              </Badge>
            )}
          </span>
        </Button>
      </div>

      {/* Filters Content */}
      <div className={`space-y-6 ${isOpen || 'lg:block' ? 'block' : 'hidden'}`}>
        {/* Active Filters */}
        {activeCount > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-terra-display">Filtres actifs</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs text-terra-green hover:text-terra-green/80"
                >
                  Tout effacer
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {filters.collections.map((collection) => (
                  <Badge
                    key={collection}
                    variant="secondary"
                    className="bg-terra-green text-white flex items-center gap-1"
                  >
                    {COLLECTIONS.find((c) => c.value === collection)?.label}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleCollectionChange(collection, false)}
                    />
                  </Badge>
                ))}
                {filters.colors.map((color) => (
                  <Badge
                    key={color}
                    variant="secondary"
                    className="bg-gray-100 text-gray-800 flex items-center gap-1"
                  >
                    <div
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                    {COLORS.find((c) => c.value === color)?.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleColorChange(color, false)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Collections */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-terra-display">Collections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {COLLECTIONS.map((collection) => (
              <div key={collection.value} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={collection.value}
                    checked={filters.collections.includes(collection.value)}
                    onCheckedChange={(checked) =>
                      handleCollectionChange(collection.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={collection.value}
                    className="text-sm font-terra-body cursor-pointer"
                  >
                    {collection.label}
                  </Label>
                </div>
                <span className="text-xs text-gray-500">({collection.count})</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Prix */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-terra-display">Prix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, priceRange: value as [number, number] })
                }
                max={700}
                min={50}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 font-terra-body">
                <span>{filters.priceRange[0]}€</span>
                <span>{filters.priceRange[1]}€</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Couleurs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-terra-display">Couleurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {COLORS.map((color) => (
                <div
                  key={color.value}
                  className={`relative cursor-pointer rounded-full w-10 h-10 border-2 transition-all ${
                    filters.colors.includes(color.value)
                      ? 'border-terra-green scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() =>
                    handleColorChange(color.value, !filters.colors.includes(color.value))
                  }
                  title={color.name}
                >
                  {filters.colors.includes(color.value) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full border border-terra-green" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pointures */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-terra-display">Pointures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-2">
              {SIZES.map((size) => (
                <Button
                  key={size}
                  variant={filters.sizes.includes(size) ? 'terra' : 'outline'}
                  size="sm"
                  className={`text-xs ${
                    filters.sizes.includes(size)
                      ? 'bg-terra-green hover:bg-terra-green/90 text-white border-terra-green'
                      : 'hover:bg-gray-50 border-gray-300'
                  }`}
                  onClick={() => handleSizeChange(size, !filters.sizes.includes(size))}
                >
                  {size}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Éco-score */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-terra-display flex items-center gap-2">
              <Leaf className="h-4 w-4 text-terra-green" />
              Éco-score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Slider
                value={filters.ecoScore}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, ecoScore: value as [number, number] })
                }
                max={10}
                min={1}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 font-terra-body">
                <span>{filters.ecoScore[0]}/10</span>
                <span>{filters.ecoScore[1]}/10</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtres rapides */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-terra-display">Filtres rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={filters.inStock}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, inStock: checked as boolean })
                }
              />
              <Label htmlFor="inStock" className="text-sm font-terra-body cursor-pointer">
                En stock uniquement
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newArrivals"
                checked={filters.newArrivals}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, newArrivals: checked as boolean })
                }
              />
              <Label htmlFor="newArrivals" className="text-sm font-terra-body cursor-pointer">
                Nouveautés
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={filters.featured}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, featured: checked as boolean })
                }
              />
              <Label htmlFor="featured" className="text-sm font-terra-body cursor-pointer">
                Produits mis en avant
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
