import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, mockRouter } from '../../../setup/test-utils'
import { ProductCard } from '@/components/terra/ProductCard'
import { TEST_PRODUCTS } from '../../../setup/test-data'

const mockCartContext = {
  addItem: vi.fn(),
  items: [],
  totalItems: 0,
  removeItem: vi.fn(),
  updateQuantity: vi.fn(),
  clearCart: vi.fn(),
  total: 0,
}

const mockFavoritesContext = {
  addToFavorites: vi.fn(),
  removeFromFavorites: vi.fn(),
  isFavorite: vi.fn(),
  favorites: [],
  favoritesCount: 0,
  clearFavorites: vi.fn(),
}

vi.mock('@/providers/CartProvider', () => ({
  useCart: () => mockCartContext,
}))

vi.mock('@/providers/FavoritesProvider', () => ({
  useFavorites: () => mockFavoritesContext,
}))

describe('ProductCard', () => {
  const mockProduct = TEST_PRODUCTS.origin

  beforeEach(() => {
    vi.clearAllMocks()
    mockFavoritesContext.isFavorite.mockReturnValue(false)
  })

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
    expect(screen.getByText(mockProduct.shortDescription)).toBeInTheDocument()
    expect(screen.getByText('139 €')).toBeInTheDocument()
    expect(screen.getByText('85')).toBeInTheDocument() // Eco score
  })

  it('displays product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />)

    const image = screen.getByRole('img', { name: mockProduct.gallery[0].alt })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockProduct.gallery[0].url)
  })

  it('shows available colors', () => {
    render(<ProductCard product={mockProduct} />)

    mockProduct.colors.forEach((color) => {
      expect(screen.getByLabelText(`Couleur ${color.name}`)).toBeInTheDocument()
    })
  })

  it('navigates to product page on click', () => {
    render(<ProductCard product={mockProduct} />)

    const productLink = screen.getByRole('link')
    fireEvent.click(productLink)

    expect(mockRouter.push).toHaveBeenCalledWith(`/products/${mockProduct.slug}`)
  })

  it('adds product to favorites', () => {
    render(<ProductCard product={mockProduct} />)

    const favoriteButton = screen.getByRole('button', { name: /ajouter aux favoris/i })
    fireEvent.click(favoriteButton)

    expect(mockFavoritesContext.addToFavorites).toHaveBeenCalledWith(mockProduct)
  })

  it('removes product from favorites when already favorited', () => {
    mockFavoritesContext.isFavorite.mockReturnValue(true)

    render(<ProductCard product={mockProduct} />)

    const favoriteButton = screen.getByRole('button', { name: /retirer des favoris/i })
    fireEvent.click(favoriteButton)

    expect(mockFavoritesContext.removeFromFavorites).toHaveBeenCalledWith(mockProduct.id)
  })

  it('shows correct favorite button state', () => {
    // Test non-favorited state
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByRole('button', { name: /ajouter aux favoris/i })).toBeInTheDocument()

    // Test favorited state
    mockFavoritesContext.isFavorite.mockReturnValue(true)
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByRole('button', { name: /retirer des favoris/i })).toBeInTheDocument()
  })

  it('shows quick add to cart button on hover', async () => {
    render(<ProductCard product={mockProduct} />)

    const card = screen.getByTestId('product-card')
    fireEvent.mouseEnter(card)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ajout rapide/i })).toBeInTheDocument()
    })
  })

  it('opens size selector on quick add click', () => {
    render(<ProductCard product={mockProduct} />)

    const card = screen.getByTestId('product-card')
    fireEvent.mouseEnter(card)

    const quickAddButton = screen.getByRole('button', { name: /ajout rapide/i })
    fireEvent.click(quickAddButton)

    expect(screen.getByText('Choisir une taille')).toBeInTheDocument()
    mockProduct.sizes.forEach((size) => {
      expect(screen.getByText(size)).toBeInTheDocument()
    })
  })

  it('adds product to cart with selected size', () => {
    render(<ProductCard product={mockProduct} />)

    const card = screen.getByTestId('product-card')
    fireEvent.mouseEnter(card)

    const quickAddButton = screen.getByRole('button', { name: /ajout rapide/i })
    fireEvent.click(quickAddButton)

    const sizeButton = screen.getByText('42')
    fireEvent.click(sizeButton)

    expect(mockCartContext.addItem).toHaveBeenCalledWith({
      product: mockProduct,
      size: '42',
      color: mockProduct.colors[0].name,
      quantity: 1,
    })
  })

  it('shows out of stock for unavailable sizes', () => {
    const productWithLimitedStock = {
      ...mockProduct,
      colors: [
        {
          ...mockProduct.colors[0],
          stock: { '42': 0, '43': 5 },
        },
      ],
    }

    render(<ProductCard product={productWithLimitedStock} />)

    const card = screen.getByTestId('product-card')
    fireEvent.mouseEnter(card)

    const quickAddButton = screen.getByRole('button', { name: /ajout rapide/i })
    fireEvent.click(quickAddButton)

    const size42Button = screen.getByText('42')
    expect(size42Button).toBeDisabled()
    expect(size42Button).toHaveClass('out-of-stock')
  })

  it('displays eco score badge', () => {
    render(<ProductCard product={mockProduct} />)

    const ecoScoreBadge = screen.getByTestId('eco-score')
    expect(ecoScoreBadge).toBeInTheDocument()
    expect(ecoScoreBadge).toHaveTextContent('85')
    expect(ecoScoreBadge).toHaveClass('eco-score-high') // Score > 80
  })

  it('shows collection badge', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText('ORIGIN')).toBeInTheDocument()
  })

  it('handles image loading error', () => {
    render(<ProductCard product={mockProduct} />)

    const image = screen.getByRole('img')
    fireEvent.error(image)

    // Should show placeholder or fallback image
    expect(image).toHaveAttribute('src', '/images/placeholder-product.jpg')
  })

  it('shows price with correct formatting', () => {
    const productWithDecimals = {
      ...mockProduct,
      price: 159.99,
    }

    render(<ProductCard product={productWithDecimals} />)

    expect(screen.getByText('159,99 €')).toBeInTheDocument()
  })

  it('handles keyboard navigation', () => {
    render(<ProductCard product={mockProduct} />)

    const favoriteButton = screen.getByRole('button', { name: /ajouter aux favoris/i })
    favoriteButton.focus()

    fireEvent.keyDown(favoriteButton, { key: 'Enter' })
    expect(mockFavoritesContext.addToFavorites).toHaveBeenCalled()

    fireEvent.keyDown(favoriteButton, { key: ' ' })
    expect(mockFavoritesContext.addToFavorites).toHaveBeenCalledTimes(2)
  })

  it('shows loading state during cart addition', async () => {
    // Mock async addItem
    mockCartContext.addItem.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    )

    render(<ProductCard product={mockProduct} />)

    const card = screen.getByTestId('product-card')
    fireEvent.mouseEnter(card)

    const quickAddButton = screen.getByRole('button', { name: /ajout rapide/i })
    fireEvent.click(quickAddButton)

    const sizeButton = screen.getByText('42')
    fireEvent.click(sizeButton)

    expect(screen.getByText('Ajout en cours...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Ajout en cours...')).not.toBeInTheDocument()
    })
  })

  it('displays new arrival badge for recent products', () => {
    const recentProduct = {
      ...mockProduct,
      createdAt: new Date().toISOString(), // Produit récent
    }

    render(<ProductCard product={recentProduct} />)

    expect(screen.getByText('NOUVEAU')).toBeInTheDocument()
  })
})
