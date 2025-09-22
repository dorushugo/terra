// Données de test réutilisables pour tous les tests

export const TEST_PRODUCTS = {
  origin: {
    id: 'terra-origin-stone-white',
    title: 'TERRA Origin Stone White',
    slug: 'terra-origin-stone-white',
    collection: 'origin',
    price: 139,
    shortDescription: 'Sneaker éco-responsable au design minimaliste',
    description: "La TERRA Origin incarne notre vision d'un style urbain conscient...",
    colors: [
      {
        name: 'Stone White',
        value: '#F5F5F5',
        stock: {
          '40': 2,
          '41': 5,
          '42': 8,
          '43': 3,
          '44': 1,
        },
      },
      {
        name: 'Terra Green',
        value: '#2D5A27',
        stock: {
          '40': 0,
          '41': 2,
          '42': 4,
          '43': 6,
          '44': 2,
        },
      },
    ],
    sizes: ['40', '41', '42', '43', '44'],
    ecoScore: 85,
    sustainability: {
      materials: [
        { name: 'Coton biologique certifié', percentage: 45 },
        { name: 'Caoutchouc recyclé', percentage: 30 },
        { name: 'Lin européen', percentage: 25 },
      ],
      carbonFootprint: 12.5,
      waterUsage: 45,
    },
    features: [
      { feature: 'Semelle en caoutchouc recyclé', icon: 'recycle' },
      { feature: 'Tige en coton bio', icon: 'leaf' },
      { feature: 'Lacets en chanvre', icon: 'eco' },
    ],
    gallery: [
      { id: '1', url: '/images/products/terra-origin-stone-1.jpg', alt: 'Vue principale' },
      { id: '2', url: '/images/products/terra-origin-stone-2.jpg', alt: 'Vue latérale' },
      { id: '3', url: '/images/products/terra-origin-stone-3.jpg', alt: 'Vue arrière' },
    ],
  },
  move: {
    id: 'terra-move-sage-green',
    title: 'TERRA Move Sage Green',
    slug: 'terra-move-sage-green',
    collection: 'move',
    price: 159,
    shortDescription: 'Performance urbaine et confort technique',
    colors: [
      {
        name: 'Sage Green',
        value: '#9CAF88',
        stock: {
          '41': 3,
          '42': 7,
          '43': 5,
          '44': 2,
        },
      },
    ],
    ecoScore: 78,
  },
}

export const TEST_COLLECTIONS = {
  origin: {
    id: 'origin',
    name: 'TERRA Origin',
    slug: 'origin',
    tagline: "L'essentiel réinventé",
    shortDescription: 'Design minimaliste, matériaux durables',
    priceRange: { from: 139, to: 149 },
    heroImage: { url: '/images/collections/origin-hero.jpg', alt: 'Collection Origin' },
  },
  move: {
    id: 'move',
    name: 'TERRA Move',
    slug: 'move',
    tagline: 'Performance urbaine',
    shortDescription: 'Confort technique pour le mouvement',
    priceRange: { from: 159, to: 179 },
    heroImage: { url: '/images/collections/move-hero.jpg', alt: 'Collection Move' },
  },
  limited: {
    id: 'limited',
    name: 'TERRA Limited',
    slug: 'limited',
    tagline: 'Éditions exclusives',
    shortDescription: 'Matériaux innovants, séries limitées',
    priceRange: { from: 179, to: 199 },
    heroImage: { url: '/images/collections/limited-hero.jpg', alt: 'Collection Limited' },
  },
}

export const TEST_USERS = {
  customer: {
    id: 'customer-1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer',
    dateOfBirth: '1990-05-15',
    phone: '+33123456789',
  },
  admin: {
    id: 'admin-1',
    email: 'admin@terra.com',
    firstName: 'Admin',
    lastName: 'Terra',
    role: 'admin',
  },
}

export const TEST_ADDRESSES = {
  home: {
    id: 'address-1',
    type: 'home',
    firstName: 'John',
    lastName: 'Doe',
    company: null,
    address1: '123 Rue de la Paix',
    address2: 'Appartement 4B',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
    phone: '+33123456789',
    isDefault: true,
  },
  work: {
    id: 'address-2',
    type: 'work',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Tech Corp',
    address1: '456 Avenue des Champs',
    address2: null,
    city: 'Lyon',
    postalCode: '69000',
    country: 'France',
    phone: '+33987654321',
    isDefault: false,
  },
}

export const TEST_ORDERS = {
  pending: {
    id: 'order-1',
    orderNumber: 'TER-2024-001',
    status: 'pending',
    customer: TEST_USERS.customer,
    items: [
      {
        product: TEST_PRODUCTS.origin,
        quantity: 1,
        size: '42',
        color: 'Stone White',
        unitPrice: 139,
        totalPrice: 139,
      },
    ],
    shippingAddress: TEST_ADDRESSES.home,
    billingAddress: TEST_ADDRESSES.home,
    subtotal: 139,
    shippingCost: 5.9,
    tax: 0,
    total: 144.9,
    paymentMethod: 'stripe',
    paymentStatus: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
  },
  completed: {
    id: 'order-2',
    orderNumber: 'TER-2024-002',
    status: 'shipped',
    customer: TEST_USERS.customer,
    items: [
      {
        product: TEST_PRODUCTS.move,
        quantity: 2,
        size: '43',
        color: 'Sage Green',
        unitPrice: 159,
        totalPrice: 318,
      },
    ],
    total: 323.9,
    paymentStatus: 'paid',
    trackingNumber: 'FR123456789',
    createdAt: '2024-01-10T14:20:00Z',
    shippedAt: '2024-01-12T09:15:00Z',
  },
}

export const TEST_CART_ITEMS = [
  {
    id: 'cart-item-1',
    product: TEST_PRODUCTS.origin,
    quantity: 1,
    size: '42',
    color: 'Stone White',
    addedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'cart-item-2',
    product: TEST_PRODUCTS.move,
    quantity: 1,
    size: '43',
    color: 'Sage Green',
    addedAt: '2024-01-15T10:05:00Z',
  },
]

export const TEST_FAVORITES = [
  {
    id: 'fav-1',
    product: TEST_PRODUCTS.origin,
    addedAt: '2024-01-10T15:30:00Z',
  },
  {
    id: 'fav-2',
    product: TEST_PRODUCTS.move,
    addedAt: '2024-01-12T11:20:00Z',
  },
]

export const TEST_STOCK_MOVEMENTS = [
  {
    id: 'stock-1',
    product: TEST_PRODUCTS.origin,
    type: 'sale',
    quantity: -1,
    size: '42',
    color: 'Stone White',
    reason: 'Vente commande TER-2024-001',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'stock-2',
    product: TEST_PRODUCTS.origin,
    type: 'restock',
    quantity: 10,
    size: '42',
    color: 'Stone White',
    reason: 'Réapprovisionnement fournisseur',
    createdAt: '2024-01-10T08:00:00Z',
  },
]

export const TEST_SEARCH_RESULTS = {
  products: [TEST_PRODUCTS.origin, TEST_PRODUCTS.move],
  total: 2,
  hasNextPage: false,
  hasPrevPage: false,
  page: 1,
  totalPages: 1,
}

// Utilitaires pour créer des variations de données de test
export const createTestProduct = (overrides = {}) => ({
  ...TEST_PRODUCTS.origin,
  ...overrides,
})

export const createTestOrder = (overrides = {}) => ({
  ...TEST_ORDERS.pending,
  ...overrides,
})

export const createTestUser = (overrides = {}) => ({
  ...TEST_USERS.customer,
  ...overrides,
})
