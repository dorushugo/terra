import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useProductSearch } from '@/hooks/useProductSearch'
import { TEST_PRODUCTS, TEST_SEARCH_RESULTS } from '../../setup/test-data'

// Mock useRouter
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock fetch
global.fetch = vi.fn()

describe('useProductSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with default values', () => {
    const { result } = renderHook(() => useProductSearch())

    expect(result.current.query).toBe('')
    expect(result.current.results).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.suggestions).toEqual([])
    expect(result.current.showSuggestions).toBe(false)
  })

  it('performs search with query', async () => {
    const mockResponse = TEST_SEARCH_RESULTS
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const { result } = renderHook(() => useProductSearch())

    act(() => {
      result.current.setQuery('terra origin')
    })

    await act(async () => {
      await result.current.search()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.results).toEqual(mockResponse)
    expect(result.current.error).toBeNull()
    expect(global.fetch).toHaveBeenCalledWith('/api/search/products?q=terra%20origin&limit=20')
  })

  it('handles search with custom query parameter', async () => {
    const mockResponse = TEST_SEARCH_RESULTS
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const { result } = renderHook(() => useProductSearch())

    await act(async () => {
      await result.current.search('custom query')
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/search/products?q=custom%20query&limit=20')
  })

  it('does not search with empty query', async () => {
    const { result } = renderHook(() => useProductSearch())

    await act(async () => {
      await result.current.search('')
    })

    expect(result.current.results).toBeNull()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('handles search error', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    const { result } = renderHook(() => useProductSearch())

    act(() => {
      result.current.setQuery('error query')
    })

    await act(async () => {
      await result.current.search()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Erreur lors de la recherche')
    expect(result.current.results).toBeNull()
  })

  it('handles network error', async () => {
    ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useProductSearch())

    act(() => {
      result.current.setQuery('network error')
    })

    await act(async () => {
      await result.current.search()
    })

    expect(result.current.error).toBe('Network error')
    expect(result.current.results).toBeNull()
  })

  it('sets loading state during search', async () => {
    let resolvePromise: (value: any) => void
    const searchPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    ;(global.fetch as any).mockReturnValueOnce(searchPromise)

    const { result } = renderHook(() => useProductSearch())

    act(() => {
      result.current.setQuery('loading test')
    })

    // Start search
    act(() => {
      result.current.search()
    })

    // Should be loading
    expect(result.current.isLoading).toBe(true)

    // Resolve the promise
    act(() => {
      resolvePromise!({
        ok: true,
        json: () => Promise.resolve(TEST_SEARCH_RESULTS),
      })
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('gets suggestions for short queries', async () => {
    const mockSuggestions = [TEST_PRODUCTS.origin]
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ products: mockSuggestions }),
    })

    const { result } = renderHook(() => useProductSearch())

    await act(async () => {
      await result.current.getSuggestions('te')
    })

    expect(result.current.suggestions).toEqual(mockSuggestions)
    expect(global.fetch).toHaveBeenCalledWith('/api/search/products?q=te&limit=5')
  })

  it('does not get suggestions for very short queries', async () => {
    const { result } = renderHook(() => useProductSearch())

    await act(async () => {
      await result.current.getSuggestions('t')
    })

    expect(result.current.suggestions).toEqual([])
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('clears suggestions for empty query', async () => {
    const { result } = renderHook(() => useProductSearch())

    // First set some suggestions
    await act(async () => {
      result.current.setSuggestions([TEST_PRODUCTS.origin])
    })

    expect(result.current.suggestions).toHaveLength(1)

    // Then clear with empty query
    await act(async () => {
      await result.current.getSuggestions('')
    })

    expect(result.current.suggestions).toEqual([])
  })

  it('handles suggestions error gracefully', async () => {
    console.error = vi.fn()
    ;(global.fetch as any).mockRejectedValueOnce(new Error('Suggestions error'))

    const { result } = renderHook(() => useProductSearch())

    await act(async () => {
      await result.current.getSuggestions('error')
    })

    expect(result.current.suggestions).toEqual([])
    expect(console.error).toHaveBeenCalled()
  })

  it('debounces suggestions requests', async () => {
    const { result } = renderHook(() => useProductSearch())

    // Set query multiple times quickly
    act(() => {
      result.current.setQuery('t')
    })
    act(() => {
      result.current.setQuery('te')
    })
    act(() => {
      result.current.setQuery('ter')
    })

    // Fast forward timers
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Only the last query should trigger a request
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith('/api/search/products?q=ter&limit=5')
    })
  })

  it('navigates to search results page', () => {
    const { result } = renderHook(() => useProductSearch())

    act(() => {
      result.current.navigateToResults('sneakers')
    })

    expect(mockPush).toHaveBeenCalledWith('/search?q=sneakers')
  })

  it('navigates to product page', () => {
    const { result } = renderHook(() => useProductSearch())

    act(() => {
      result.current.navigateToProduct('terra-origin-stone-white')
    })

    expect(mockPush).toHaveBeenCalledWith('/products/terra-origin-stone-white')
  })

  it('controls suggestions visibility', () => {
    const { result } = renderHook(() => useProductSearch())

    expect(result.current.showSuggestions).toBe(false)

    act(() => {
      result.current.setShowSuggestions(true)
    })

    expect(result.current.showSuggestions).toBe(true)

    act(() => {
      result.current.setShowSuggestions(false)
    })

    expect(result.current.showSuggestions).toBe(false)
  })

  it('clears error when starting new search', async () => {
    const { result } = renderHook(() => useProductSearch())

    // First, cause an error
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    act(() => {
      result.current.setQuery('error query')
    })

    await act(async () => {
      await result.current.search()
    })

    expect(result.current.error).toBeTruthy()

    // Then start a new successful search
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(TEST_SEARCH_RESULTS),
    })

    act(() => {
      result.current.setQuery('success query')
    })

    await act(async () => {
      await result.current.search()
    })

    expect(result.current.error).toBeNull()
  })

  it('handles concurrent search requests correctly', async () => {
    let resolveFirst: (value: any) => void
    let resolveSecond: (value: any) => void

    const firstPromise = new Promise((resolve) => {
      resolveFirst = resolve
    })
    const secondPromise = new Promise((resolve) => {
      resolveSecond = resolve
    })

    const { result } = renderHook(() => useProductSearch())

    // Start first search
    ;(global.fetch as any).mockReturnValueOnce(firstPromise)
    act(() => {
      result.current.setQuery('first')
    })
    act(() => {
      result.current.search()
    })

    // Start second search
    ;(global.fetch as any).mockReturnValueOnce(secondPromise)
    act(() => {
      result.current.setQuery('second')
    })
    act(() => {
      result.current.search()
    })

    // Resolve second first (more recent)
    act(() => {
      resolveSecond!({
        ok: true,
        json: () => Promise.resolve({ products: [TEST_PRODUCTS.move], total: 1 }),
      })
    })

    // Then resolve first (older)
    act(() => {
      resolveFirst!({
        ok: true,
        json: () => Promise.resolve({ products: [TEST_PRODUCTS.origin], total: 1 }),
      })
    })

    await waitFor(() => {
      // Should show results from the second (more recent) search
      expect(result.current.results?.products).toEqual([TEST_PRODUCTS.move])
    })
  })
})
