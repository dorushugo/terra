'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import { Search, X, Loader2, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProductSearch } from '@/hooks/useProductSearch'
import type { Product } from '@/payload-types'

interface SearchDropdownProps {
  isOpen: boolean
  onClose: () => void
  onSearch?: (query: string) => void
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({ isOpen, onClose, onSearch }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { query, setQuery, suggestions, isLoading, search, clearSearch, setShowSuggestions } =
    useProductSearch()

  // Debug logs
  console.log('🎯 SearchDropdown render:', {
    isOpen,
    query,
    suggestionsLength: suggestions.length,
    isLoading,
  })

  // Focus sur l'input quand le dropdown s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setShowSuggestions(true)
    } else if (!isOpen) {
      setShowSuggestions(false)
    }
  }, [isOpen, setShowSuggestions])

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch?.(query)
      onClose()
      // Rediriger vers la page de résultats
      window.location.href = `/products?search=${encodeURIComponent(query)}`
    }
  }

  const handleSuggestionClick = (product: Product) => {
    onClose()
    // Rediriger vers le produit
    window.location.href = `/products/${product.slug}`
  }

  const handleClear = () => {
    clearSearch()
    inputRef.current?.focus()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 pt-20">
        <div
          ref={dropdownRef}
          className="mx-auto max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          {/* Barre de recherche */}
          <form onSubmit={handleSubmit} className="p-6 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher des sneakers..."
                className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-terra-green focus:border-transparent font-terra-body transition-all"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>

          {/* Contenu du dropdown */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-terra-green" />
                <span className="ml-2 text-gray-600 font-terra-body">Recherche en cours...</span>
              </div>
            )}

            {!isLoading && query && suggestions.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-gray-600 font-terra-body">Aucun résultat pour "{query}"</p>
                <Button
                  onClick={() => {
                    onSearch?.(query)
                    onClose()
                    window.location.href = `/products?search=${encodeURIComponent(query)}`
                  }}
                  className="mt-3 bg-terra-green hover:bg-terra-green/90 text-white font-terra-body"
                >
                  Voir tous les résultats
                </Button>
              </div>
            )}

            {!isLoading && suggestions.length > 0 && (
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <TrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 font-terra-body font-medium">
                    Suggestions
                  </span>
                </div>

                <div className="space-y-2">
                  {suggestions.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSuggestionClick(product)}
                      className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      {/* Image du produit */}
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        {product.images?.[0]?.image &&
                          typeof product.images[0].image === 'object' && (
                            <img
                              src={product.images[0].image.url || ''}
                              alt={product.images[0].alt || product.title}
                              className="w-full h-full object-contain bg-white"
                            />
                          )}
                      </div>

                      {/* Informations du produit */}
                      <div className="flex-1 ml-3 text-left">
                        <h4 className="font-terra-body font-medium text-gray-900 group-hover:text-terra-green transition-colors">
                          {product.title}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">{product.shortDescription}</p>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className="font-terra-body font-bold text-terra-green">
                            {product.price}€
                          </span>
                          {product.collection && (
                            <Badge variant="secondary" className="text-xs">
                              {product.collection === 'origin' && 'TERRA Origin'}
                              {product.collection === 'move' && 'TERRA Move'}
                              {product.collection === 'limited' && 'TERRA Limited'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Voir tous les résultats */}
                <Button
                  onClick={() => {
                    onSearch?.(query)
                    onClose()
                    window.location.href = `/products?search=${encodeURIComponent(query)}`
                  }}
                  variant="outline"
                  className="w-full mt-4 border-terra-green text-terra-green hover:bg-terra-green hover:text-white font-terra-body"
                >
                  Voir tous les résultats ({suggestions.length}+)
                </Button>
              </div>
            )}

            {!query && (
              <div className="p-6">
                <div className="text-center">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-terra-body font-medium text-gray-900 mb-2">
                    Rechercher des sneakers
                  </h3>
                  <p className="text-sm text-gray-600 font-terra-body">
                    Tapez le nom d'un produit, une couleur, ou une collection
                  </p>

                  {/* Suggestions populaires */}
                  <div className="mt-6">
                    <p className="text-xs text-gray-500 font-terra-body font-medium mb-3 uppercase tracking-wide">
                      Recherches populaires
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        'Terra Origin',
                        'Stone White',
                        'Sage Green',
                        'Urban Black',
                        'Terra Move',
                      ].map((term) => (
                        <Button
                          key={term}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setQuery(term)
                            onSearch?.(term)
                          }}
                          className="text-xs font-terra-body hover:border-terra-green hover:text-terra-green"
                        >
                          {term}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500 font-terra-body">
              <span>Appuyez sur Entrée pour rechercher</span>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                Échap pour fermer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
