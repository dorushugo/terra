import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/payload-types'

interface SearchResult {
  products: Product[]
  total: number
  hasNextPage: boolean
  hasPrevPage: boolean
  page: number
  totalPages: number
}

interface UseProductSearchReturn {
  query: string
  setQuery: (query: string) => void
  results: SearchResult | null
  isLoading: boolean
  error: string | null
  search: (searchQuery?: string) => Promise<void>
  clearSearch: () => void
  suggestions: Product[]
  showSuggestions: boolean
  setShowSuggestions: (show: boolean) => void
}

export function useProductSearch(): UseProductSearchReturn {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()

  // Fonction de recherche principale
  const search = useCallback(
    async (searchQuery?: string) => {
      const queryToSearch = searchQuery !== undefined ? searchQuery : query

      if (!queryToSearch.trim()) {
        setResults(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `/api/search/products?q=${encodeURIComponent(queryToSearch)}&limit=20`,
        )

        if (!response.ok) {
          throw new Error('Erreur lors de la recherche')
        }

        const data = await response.json()
        setResults(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
        setResults(null)
      } finally {
        setIsLoading(false)
      }
    },
    [query],
  )

  // Fonction pour obtenir des suggestions
  const getSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([])
      return
    }

    console.log('🔍 Récupération des suggestions pour:', searchQuery)

    try {
      const response = await fetch(
        `/api/search/products?q=${encodeURIComponent(searchQuery)}&limit=5`,
      )

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Suggestions reçues:', data.products?.length || 0)
        setSuggestions(data.products || [])
      }
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des suggestions:', err)
      setSuggestions([])
    }
  }, [])

  // Debounce pour les suggestions
  useEffect(() => {
    console.log('🔄 Debounce effect:', { query, showSuggestions })
    const timeoutId = setTimeout(() => {
      if (showSuggestions && query.trim()) {
        console.log('⏰ Debounce triggered, calling getSuggestions')
        getSuggestions(query)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, showSuggestions, getSuggestions])

  // Fonction pour effacer la recherche
  const clearSearch = useCallback(() => {
    setQuery('')
    setResults(null)
    setSuggestions([])
    setError(null)
    setShowSuggestions(false)
  }, [])

  // Fonction pour naviguer vers les résultats de recherche
  const navigateToSearch = useCallback(
    (searchQuery: string) => {
      if (searchQuery.trim()) {
        router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      }
    },
    [router],
  )

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    search,
    clearSearch,
    suggestions,
    showSuggestions,
    setShowSuggestions,
  }
}
