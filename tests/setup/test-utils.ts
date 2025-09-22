import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'

// Providers nécessaires pour les tests
import { CartProvider } from '@/providers/CartProvider'
import { FavoritesProvider } from '@/providers/FavoritesProvider'
import { AccountProvider } from '@/providers/AccountProvider'

// Mock de Next.js router
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  route: '/',
}

// Mock de useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock de localStorage pour les tests
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock de window.matchMedia pour les tests responsive
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Wrapper avec tous les providers nécessaires
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AccountProvider>
      <CartProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </CartProvider>
    </AccountProvider>
  )
}

// Custom render function
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Utilitaires de test pour créer des données mock
export const createMockProduct = (overrides = {}) => ({
  id: 'test-product-1',
  title: 'TERRA Origin Stone White',
  slug: 'terra-origin-stone-white',
  collection: 'origin',
  price: 139,
  shortDescription: 'Sneaker éco-responsable au design minimaliste',
  colors: [
    { name: 'Stone White', value: '#F5F5F5', stock: { '42': 5, '43': 3 } }
  ],
  sizes: ['40', '41', '42', '43', '44'],
  ecoScore: 85,
  sustainability: {
    materials: [
      { name: 'Coton bio', percentage: 60 },
      { name: 'Caoutchouc recyclé', percentage: 40 }
    ]
  },
  gallery: [
    { id: 'img1', url: '/images/products/terra-origin-1.jpg', alt: 'TERRA Origin vue 1' }
  ],
  ...overrides,
})

export const createMockOrder = (overrides = {}) => ({
  id: 'test-order-1',
  orderNumber: 'TER-2024-001',
  status: 'pending',
  customer: {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+33123456789'
  },
  items: [
    {
      product: createMockProduct(),
      quantity: 1,
      size: '42',
      color: 'Stone White',
      unitPrice: 139
    }
  ],
  total: 139,
  createdAt: new Date().toISOString(),
  ...overrides,
})

export const createMockUser = (overrides = {}) => ({
  id: 'test-user-1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user',
  ...overrides,
})

// Utilitaires pour mocker les appels API
export const mockFetch = (response: any, ok = true) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(response),
    status: ok ? 200 : 400,
  })
}

export const mockFetchError = (error = 'Network error') => {
  global.fetch = vi.fn().mockRejectedValue(new Error(error))
}

// Export de tout ce qui est nécessaire
export * from '@testing-library/react'
export { customRender as render }
export { vi }
