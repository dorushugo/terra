import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, mockRouter } from '../../../setup/test-utils'
import { TerraHeader } from '@/components/terra/TerraHeader'

// Mock des providers
const mockCartContext = {
  totalItems: 2,
  items: [],
  addItem: vi.fn(),
  removeItem: vi.fn(),
  updateQuantity: vi.fn(),
  clearCart: vi.fn(),
  total: 298,
}

const mockFavoritesContext = {
  favoritesCount: 3,
  favorites: [],
  addToFavorites: vi.fn(),
  removeFromFavorites: vi.fn(),
  isFavorite: vi.fn(),
  clearFavorites: vi.fn(),
}

const mockAccountContext = {
  state: {
    user: null,
    isLoading: false,
    error: null,
  },
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
}

vi.mock('@/providers/CartProvider', () => ({
  useCart: () => mockCartContext,
}))

vi.mock('@/providers/FavoritesProvider', () => ({
  useFavorites: () => mockFavoritesContext,
}))

vi.mock('@/providers/AccountProvider', () => ({
  useAccount: () => mockAccountContext,
}))

// Mock des composants dropdown
vi.mock('@/components/terra/cart/CartDropdown', () => ({
  CartDropdown: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="cart-dropdown">Cart Dropdown</div> : null,
}))

vi.mock('@/components/terra/favorites/FavoritesDropdown', () => ({
  FavoritesDropdown: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="favorites-dropdown">Favorites Dropdown</div> : null,
}))

vi.mock('@/components/terra/search/SearchDropdown', () => ({
  SearchDropdown: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="search-dropdown">Search Dropdown</div> : null,
}))

describe('TerraHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    })
  })

  it('renders correctly', () => {
    render(<TerraHeader />)

    expect(screen.getByText('TERRA')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /rechercher/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /panier/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /favoris/i })).toBeInTheDocument()
  })

  it('displays cart item count', () => {
    render(<TerraHeader />)

    const cartButton = screen.getByRole('button', { name: /panier/i })
    expect(cartButton).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // Badge avec le nombre d'items
  })

  it('displays favorites count', () => {
    render(<TerraHeader />)

    const favoritesButton = screen.getByRole('button', { name: /favoris/i })
    expect(favoritesButton).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument() // Badge avec le nombre de favoris
  })

  it('shows login button when user is not authenticated', () => {
    render(<TerraHeader />)

    expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument()
  })

  it('shows user menu when user is authenticated', () => {
    mockAccountContext.state.user = {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    }

    render(<TerraHeader />)

    expect(screen.getByText('John')).toBeInTheDocument()
  })

  it('toggles mobile menu', () => {
    render(<TerraHeader />)

    const menuButton = screen.getByRole('button', { name: /menu/i })
    fireEvent.click(menuButton)

    expect(screen.getByRole('navigation')).toHaveClass('mobile-menu-open')
  })

  it('opens cart dropdown on cart button click', () => {
    render(<TerraHeader />)

    const cartButton = screen.getByRole('button', { name: /panier/i })
    fireEvent.click(cartButton)

    expect(screen.getByTestId('cart-dropdown')).toBeInTheDocument()
  })

  it('opens favorites dropdown on favorites button click', () => {
    render(<TerraHeader />)

    const favoritesButton = screen.getByRole('button', { name: /favoris/i })
    fireEvent.click(favoritesButton)

    expect(screen.getByTestId('favorites-dropdown')).toBeInTheDocument()
  })

  it('opens search dropdown on search button click', () => {
    render(<TerraHeader />)

    const searchButton = screen.getByRole('button', { name: /rechercher/i })
    fireEvent.click(searchButton)

    expect(screen.getByTestId('search-dropdown')).toBeInTheDocument()
  })

  it('adds scrolled class when scrolling down', async () => {
    render(<TerraHeader />)

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', {
      value: 50,
      writable: true,
    })

    fireEvent.scroll(window)

    await waitFor(() => {
      const header = screen.getByRole('banner')
      expect(header).toHaveClass('scrolled')
    })
  })

  it('navigates to collections page', () => {
    render(<TerraHeader />)

    const collectionsLink = screen.getByRole('link', { name: /collections/i })
    fireEvent.click(collectionsLink)

    expect(mockRouter.push).toHaveBeenCalledWith('/collections')
  })

  it('shows collections dropdown on hover', async () => {
    render(<TerraHeader />)

    const collectionsLink = screen.getByRole('link', { name: /collections/i })
    fireEvent.mouseEnter(collectionsLink)

    await waitFor(() => {
      expect(screen.getByTestId('collections-dropdown')).toBeInTheDocument()
    })
  })

  it('hides collections dropdown on mouse leave with delay', async () => {
    render(<TerraHeader />)

    const collectionsLink = screen.getByRole('link', { name: /collections/i })
    fireEvent.mouseEnter(collectionsLink)

    await waitFor(() => {
      expect(screen.getByTestId('collections-dropdown')).toBeInTheDocument()
    })

    fireEvent.mouseLeave(collectionsLink)

    // Le dropdown devrait disparaître après le délai
    await waitFor(
      () => {
        expect(screen.queryByTestId('collections-dropdown')).not.toBeInTheDocument()
      },
      { timeout: 400 },
    )
  })

  it('closes dropdowns when clicking outside', () => {
    render(<TerraHeader />)

    // Ouvrir le dropdown du panier
    const cartButton = screen.getByRole('button', { name: /panier/i })
    fireEvent.click(cartButton)
    expect(screen.getByTestId('cart-dropdown')).toBeInTheDocument()

    // Cliquer à l'extérieur
    fireEvent.mouseDown(document.body)

    expect(screen.queryByTestId('cart-dropdown')).not.toBeInTheDocument()
  })

  it('handles keyboard navigation', () => {
    render(<TerraHeader />)

    const searchButton = screen.getByRole('button', { name: /rechercher/i })
    fireEvent.keyDown(searchButton, { key: 'Enter' })

    expect(screen.getByTestId('search-dropdown')).toBeInTheDocument()
  })

  it('updates badge counts when cart/favorites change', () => {
    const { rerender } = render(<TerraHeader />)

    // Changer le contexte du panier
    mockCartContext.totalItems = 5
    mockFavoritesContext.favoritesCount = 1

    rerender(<TerraHeader />)

    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('hides badges when counts are zero', () => {
    mockCartContext.totalItems = 0
    mockFavoritesContext.favoritesCount = 0

    render(<TerraHeader />)

    const badges = screen.queryAllByRole('status')
    expect(badges).toHaveLength(0)
  })
})
