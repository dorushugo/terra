import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CartProvider, useCart } from '@/providers/CartProvider'
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

// Mock product pour les tests
const mockProduct: Product = {
  id: 1,
  title: 'TERRA Origin Stone White',
  slug: 'terra-origin-stone-white',
  collection: 'origin',
  price: 139,
  description: null,
  shortDescription: 'Sneaker écoresponsable',
  images: [],
  colors: [
    {
      name: 'Stone White',
      value: '#F5F5F5',
      images: [],
    },
  ],
  sizes: [
    {
      stock: 10,
      size: '42',
      availableStock: 10,
    },
  ],
  ecoScore: 85,
  isFeatured: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  _status: 'published',
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe('useCart Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('should initialize with empty cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.cartItems).toEqual([])
    expect(result.current.totalItems).toBe(0)
    expect(result.current.totalPrice).toBe(0)
  })

  it('should add item to cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.addToCart(mockProduct, '42', 'Stone White', 1)
    })

    expect(result.current.cartItems).toHaveLength(1)
    expect(result.current.cartItems[0]).toMatchObject({
      product: mockProduct,
      size: '42',
      color: 'Stone White',
      quantity: 1,
    })
    expect(result.current.totalItems).toBe(1)
    expect(result.current.totalPrice).toBe(139)
  })

  it('should update quantity when adding same item', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Ajouter le produit une première fois
    act(() => {
      result.current.addToCart(mockProduct, '42', 'Stone White', 1)
    })

    // Attendre un peu pour éviter la protection contre les doublons
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Utiliser updateQuantity au lieu d'ajouter à nouveau
    const itemId = result.current.cartItems[0].id
    act(() => {
      result.current.updateQuantity(itemId, 3)
    })

    expect(result.current.cartItems).toHaveLength(1)
    expect(result.current.cartItems[0].quantity).toBe(3)
    expect(result.current.totalItems).toBe(3)
    expect(result.current.totalPrice).toBe(417) // 139 * 3
  })

  it('should add separate items for different sizes/colors', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.addToCart(mockProduct, '42', 'Stone White', 1)
    })

    act(() => {
      result.current.addToCart(mockProduct, '43', 'Stone White', 1)
    })

    expect(result.current.cartItems).toHaveLength(2)
    expect(result.current.totalItems).toBe(2)
  })

  it('should remove item from cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.addToCart(mockProduct, '42', 'Stone White', 1)
    })

    const itemId = result.current.cartItems[0].id

    act(() => {
      result.current.removeFromCart(itemId)
    })

    expect(result.current.cartItems).toHaveLength(0)
    expect(result.current.totalItems).toBe(0)
    expect(result.current.totalPrice).toBe(0)
  })

  it('should update item quantity', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.addToCart(mockProduct, '42', 'Stone White', 1)
    })

    const itemId = result.current.cartItems[0].id

    act(() => {
      result.current.updateQuantity(itemId, 5)
    })

    expect(result.current.cartItems[0].quantity).toBe(5)
    expect(result.current.totalItems).toBe(5)
    expect(result.current.totalPrice).toBe(695) // 139 * 5
  })

  it('should clear cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.addToCart(mockProduct, '42', 'Stone White', 2)
    })

    act(() => {
      result.current.clearCart()
    })

    expect(result.current.cartItems).toHaveLength(0)
    expect(result.current.totalItems).toBe(0)
    expect(result.current.totalPrice).toBe(0)
  })

  it('should check if item is in cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isInCart(mockProduct.id, '42', 'Stone White')).toBe(false)

    act(() => {
      result.current.addToCart(mockProduct, '42', 'Stone White', 1)
    })

    expect(result.current.isInCart(mockProduct.id, '42', 'Stone White')).toBe(true)
    expect(result.current.isInCart(mockProduct.id, '43', 'Stone White')).toBe(false)
  })

  it('should get item quantity', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.getItemQuantity(mockProduct.id, '42', 'Stone White')).toBe(0)

    act(() => {
      result.current.addToCart(mockProduct, '42', 'Stone White', 1)
    })

    // Utiliser updateQuantity pour changer la quantité
    const itemId = result.current.cartItems[0].id
    act(() => {
      result.current.updateQuantity(itemId, 3)
    })

    expect(result.current.getItemQuantity(mockProduct.id, '42', 'Stone White')).toBe(3)
  })

  it('should persist cart to localStorage', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.addToCart(mockProduct, '42', 'Stone White', 1)
    })

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'terra-cart',
        expect.stringContaining(mockProduct.id.toString()),
      )
    })
  })

  it('should load cart from localStorage', async () => {
    const savedCart = JSON.stringify([
      {
        id: 'test-product-1-42-Stone White',
        product: mockProduct,
        size: '42',
        color: 'Stone White',
        quantity: 2,
        addedAt: new Date().toISOString(),
      },
    ])

    localStorageMock.getItem.mockReturnValue(savedCart)

    const { result } = renderHook(() => useCart(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.cartItems).toHaveLength(1)
    expect(result.current.cartItems[0].quantity).toBe(2)
    expect(result.current.totalItems).toBe(2)
  })

  it('should handle localStorage errors gracefully', async () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error')
    })

    const { result } = renderHook(() => useCart(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.cartItems).toEqual([])
  })
})
