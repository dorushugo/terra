import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FavoritesProvider, useFavorites } from '@/providers/FavoritesProvider'
import type { Product } from '@/payload-types'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockProduct: Product = {
  id: 1,
  title: 'TERRA Origin Stone White',
  slug: 'terra-origin-stone-white',
  collection: 'origin',
  price: 139,
  description: null,
  shortDescription: 'Sneaker écoresponsable',
  images: [],
  colors: [],
  sizes: [],
  ecoScore: 85,
  isFeatured: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  _status: 'published',
}

const mockProduct2: Product = {
  ...mockProduct,
  id: 2,
  title: 'TERRA Move Urban Black',
  slug: 'terra-move-urban-black',
  collection: 'move',
  price: 159,
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
)

describe('useFavorites Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('should initialize with empty favorites', async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.favorites).toEqual([])
    expect(result.current.favoritesCount).toBe(0)
  })

  it('should add product to favorites', async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.addToFavorites(mockProduct)
    })

    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].product).toEqual(mockProduct)
    expect(result.current.favoritesCount).toBe(1)
  })

  it('should not add duplicate products to favorites', async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.addToFavorites(mockProduct)
    })

    act(() => {
      result.current.addToFavorites(mockProduct)
    })

    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favoritesCount).toBe(1)
  })

  it('should remove product from favorites', async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.addToFavorites(mockProduct)
    })

    act(() => {
      result.current.removeFromFavorites(mockProduct.id)
    })

    expect(result.current.favorites).toHaveLength(0)
    expect(result.current.favoritesCount).toBe(0)
  })

  it('should toggle favorite status', async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Toggle on (add)
    let wasAdded: boolean
    act(() => {
      wasAdded = result.current.toggleFavorite(mockProduct)
    })

    expect(wasAdded!).toBe(true)
    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.isFavorite(mockProduct.id)).toBe(true)

    // Attendre un peu pour éviter la protection contre les toggles rapides
    await new Promise((resolve) => setTimeout(resolve, 1100)) // Plus long que le délai de protection

    // Toggle off (remove)
    act(() => {
      wasAdded = result.current.toggleFavorite(mockProduct)
    })

    expect(wasAdded!).toBe(false)
    expect(result.current.favorites).toHaveLength(0)
    expect(result.current.isFavorite(mockProduct.id)).toBe(false)
  })

  it('should check if product is favorite', async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isFavorite(mockProduct.id)).toBe(false)

    act(() => {
      result.current.addToFavorites(mockProduct)
    })

    expect(result.current.isFavorite(mockProduct.id)).toBe(true)
    expect(result.current.isFavorite(mockProduct2.id)).toBe(false)
  })

  it('should clear all favorites', async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.addToFavorites(mockProduct)
      result.current.addToFavorites(mockProduct2)
    })

    expect(result.current.favorites).toHaveLength(2)

    act(() => {
      result.current.clearFavorites()
    })

    expect(result.current.favorites).toHaveLength(0)
    expect(result.current.favoritesCount).toBe(0)
  })

  it('should persist favorites to localStorage', async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.addToFavorites(mockProduct)
    })

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'terra-favorites',
        expect.stringContaining(mockProduct.id.toString()),
      )
    })
  })

  it('should load favorites from localStorage', async () => {
    const savedFavorites = JSON.stringify([
      {
        product: mockProduct,
        addedAt: new Date().toISOString(),
      },
    ])

    localStorageMock.getItem.mockReturnValue(savedFavorites)

    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].product).toEqual(mockProduct)
    expect(result.current.favoritesCount).toBe(1)
  })

  it('should handle localStorage errors gracefully', async () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error')
    })

    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.favorites).toEqual([])
  })

  it('should prevent rapid duplicate toggles', async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Simulate rapid clicks
    act(() => {
      result.current.toggleFavorite(mockProduct)
      result.current.toggleFavorite(mockProduct)
      result.current.toggleFavorite(mockProduct)
    })

    // Should only process the first toggle
    expect(result.current.favorites).toHaveLength(1)
  })

  it('should sort favorites by most recent first', async () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.addToFavorites(mockProduct)
    })

    // Wait a bit to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 10))

    act(() => {
      result.current.addToFavorites(mockProduct2)
    })

    expect(result.current.favorites).toHaveLength(2)
    expect(result.current.favorites[0].product.id).toBe(mockProduct2.id)
    expect(result.current.favorites[1].product.id).toBe(mockProduct.id)
  })
})
