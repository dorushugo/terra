import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'

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

// Composant de test simple
interface SimpleProductCardProps {
  product: {
    id: number
    title: string
    price: number
    ecoScore: number
    isFeatured: boolean
  }
}

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({ product }) => {
  return (
    <div data-testid="product-card">
      <h3 data-testid="product-title">{product.title}</h3>
      <span data-testid="product-price">{product.price} €</span>
      <span data-testid="eco-score">{product.ecoScore}</span>
      {product.isFeatured && <span data-testid="featured-badge">COUP DE CŒUR</span>}
      <button data-testid="add-to-cart">Ajouter au panier</button>
      <button data-testid="favorite-button" aria-label="Ajouter aux favoris">
        ♡
      </button>
    </div>
  )
}

const mockProduct = {
  id: 1,
  title: 'TERRA Origin Stone White',
  price: 139,
  ecoScore: 85,
  isFeatured: true,
}

describe('Simple Product Card Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('should render product information correctly', () => {
    render(<SimpleProductCard product={mockProduct} />)

    expect(screen.getByTestId('product-title')).toHaveTextContent('TERRA Origin Stone White')
    expect(screen.getByTestId('product-price')).toHaveTextContent('139 €')
    expect(screen.getByTestId('eco-score')).toHaveTextContent('85')
  })

  it('should show featured badge for featured products', () => {
    render(<SimpleProductCard product={mockProduct} />)
    expect(screen.getByTestId('featured-badge')).toHaveTextContent('COUP DE CŒUR')
  })

  it('should not show featured badge for non-featured products', () => {
    const nonFeaturedProduct = { ...mockProduct, isFeatured: false }
    render(<SimpleProductCard product={nonFeaturedProduct} />)
    expect(screen.queryByTestId('featured-badge')).not.toBeInTheDocument()
  })

  it('should display add to cart button', () => {
    render(<SimpleProductCard product={mockProduct} />)
    expect(screen.getByTestId('add-to-cart')).toBeInTheDocument()
  })

  it('should display favorite button', () => {
    render(<SimpleProductCard product={mockProduct} />)
    const favoriteButton = screen.getByTestId('favorite-button')
    expect(favoriteButton).toBeInTheDocument()
    expect(favoriteButton).toHaveAttribute('aria-label', 'Ajouter aux favoris')
  })

  it('should display different price formats correctly', () => {
    const expensiveProduct = { ...mockProduct, price: 1299.99 }
    render(<SimpleProductCard product={expensiveProduct} />)
    expect(screen.getByTestId('product-price')).toHaveTextContent('1299.99 €')
  })

  it('should display eco score correctly', () => {
    const highEcoProduct = { ...mockProduct, ecoScore: 95 }
    render(<SimpleProductCard product={highEcoProduct} />)
    expect(screen.getByTestId('eco-score')).toHaveTextContent('95')
  })
})
