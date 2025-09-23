import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

let payload: Payload
let testProducts: any[] = []
let testCollection: any

describe('Products API Integration', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // Créer une collection de test
    testCollection = await payload.create({
      collection: 'terra-collections',
      data: {
        name: 'Test Collection',
        slug: 'test-collection',
        tagline: 'Collection de test',
        shortDescription: 'Une collection pour les tests',
        priceRange: {
          from: 100,
          to: 200,
        },
        _status: 'published',
      },
    })
  })

  beforeEach(async () => {
    // Nettoyer les produits de test avant chaque test
    try {
      const existingProducts = await payload.find({
        collection: 'products',
        where: {
          title: {
            contains: 'Test Product',
          },
        },
      })

      for (const product of existingProducts.docs) {
        await payload.delete({
          collection: 'products',
          id: product.id,
        })
      }
    } catch (error) {
      // Ignore si pas de produits à nettoyer
    }
    testProducts = []
  })

  afterAll(async () => {
    // Nettoyer après tous les tests
    for (const product of testProducts) {
      try {
        await payload.delete({
          collection: 'products',
          id: product.id,
        })
      } catch (error) {
        // Ignore si déjà supprimé
      }
    }

    if (testCollection) {
      try {
        await payload.delete({
          collection: 'terra-collections',
          id: testCollection.id,
        })
      } catch (error) {
        // Ignore si déjà supprimé
      }
    }
  })

  it('should create a new product', async () => {
    const productData = {
      title: 'Test Product 1',
      slug: 'test-product-1',
      collection: 'origin',
      price: 139,
      shortDescription: 'Un produit de test',
      colors: [
        {
          name: 'Stone White',
          value: '#F5F5F5',
          images: [],
        },
      ],
      sizes: [
        {
          size: '42',
          availableStock: 10,
        },
        {
          size: '43',
          availableStock: 5,
        },
      ],
      ecoScore: 85,
      isFeatured: false,
      isNew: true,
      _status: 'published' as const,
    }

    const product = await payload.create({
      collection: 'products',
      data: productData,
    })

    testProducts.push(product)

    expect(product).toBeDefined()
    expect(product.title).toBe(productData.title)
    expect(product.slug).toBe(productData.slug)
    expect(product.collection).toBe(productData.collection)
    expect(product.price).toBe(productData.price)
    expect(product.ecoScore).toBe(productData.ecoScore)
    expect(product.colors).toHaveLength(1)
    expect(product.sizes).toHaveLength(2)
  })

  it('should auto-generate slug from title', async () => {
    const productData = {
      title: 'Test Product With Spaces & Special Chars!',
      collection: 'origin',
      price: 159,
      shortDescription: 'Un produit de test',
      colors: [],
      sizes: [],
      ecoScore: 80,
      _status: 'published' as const,
    }

    const product = await payload.create({
      collection: 'products',
      data: productData,
    })

    testProducts.push(product)

    expect(product.slug).toBe('test-product-with-spaces-special-chars')
  })

  it('should find products by collection', async () => {
    // Créer plusieurs produits
    const product1 = await payload.create({
      collection: 'products',
      data: {
        title: 'Test Product Origin 1',
        collection: 'origin',
        price: 139,
        shortDescription: 'Produit Origin',
        colors: [],
        sizes: [],
        ecoScore: 85,
        _status: 'published' as const,
      },
    })

    const product2 = await payload.create({
      collection: 'products',
      data: {
        title: 'Test Product Move 1',
        collection: 'move',
        price: 159,
        shortDescription: 'Produit Move',
        colors: [],
        sizes: [],
        ecoScore: 80,
        _status: 'published' as const,
      },
    })

    testProducts.push(product1, product2)

    // Rechercher les produits Origin
    const originProducts = await payload.find({
      collection: 'products',
      where: {
        collection: {
          equals: 'origin',
        },
        title: {
          contains: 'Test Product',
        },
      },
    })

    expect(originProducts.docs).toHaveLength(1)
    expect(originProducts.docs[0].collection).toBe('origin')
  })

  it('should find featured products', async () => {
    // Créer des produits avec et sans featured
    const featuredProduct = await payload.create({
      collection: 'products',
      data: {
        title: 'Test Product Featured',
        collection: 'origin',
        price: 139,
        shortDescription: 'Produit en vedette',
        colors: [],
        sizes: [],
        ecoScore: 90,
        isFeatured: true,
        _status: 'published' as const,
      },
    })

    const normalProduct = await payload.create({
      collection: 'products',
      data: {
        title: 'Test Product Normal',
        collection: 'origin',
        price: 139,
        shortDescription: 'Produit normal',
        colors: [],
        sizes: [],
        ecoScore: 85,
        isFeatured: false,
        _status: 'published' as const,
      },
    })

    testProducts.push(featuredProduct, normalProduct)

    // Rechercher les produits en vedette
    const featuredProducts = await payload.find({
      collection: 'products',
      where: {
        isFeatured: {
          equals: true,
        },
        title: {
          contains: 'Test Product',
        },
      },
    })

    expect(featuredProducts.docs).toHaveLength(1)
    expect(featuredProducts.docs[0].isFeatured).toBe(true)
  })

  it('should filter products by price range', async () => {
    // Créer des produits avec différents prix
    const cheapProduct = await payload.create({
      collection: 'products',
      data: {
        title: 'Test Product Cheap',
        collection: 'origin',
        price: 99,
        shortDescription: 'Produit pas cher',
        colors: [],
        sizes: [],
        ecoScore: 75,
        _status: 'published' as const,
      },
    })

    const expensiveProduct = await payload.create({
      collection: 'products',
      data: {
        title: 'Test Product Expensive',
        collection: 'limited',
        price: 199,
        shortDescription: 'Produit cher',
        colors: [],
        sizes: [],
        ecoScore: 95,
        _status: 'published' as const,
      },
    })

    testProducts.push(cheapProduct, expensiveProduct)

    // Rechercher les produits dans une fourchette de prix
    const midRangeProducts = await payload.find({
      collection: 'products',
      where: {
        and: [
          {
            price: {
              greater_than_equal: 100,
            },
          },
          {
            price: {
              less_than_equal: 180,
            },
          },
          {
            title: {
              contains: 'Test Product',
            },
          },
        ],
      },
    })

    expect(midRangeProducts.docs).toHaveLength(0) // Aucun produit dans cette fourchette

    // Rechercher les produits chers
    const expensiveProducts = await payload.find({
      collection: 'products',
      where: {
        and: [
          {
            price: {
              greater_than: 150,
            },
          },
          {
            title: {
              contains: 'Test Product',
            },
          },
        ],
      },
    })

    expect(expensiveProducts.docs).toHaveLength(1)
    expect(expensiveProducts.docs[0].price).toBe(199)
  })

  it('should filter products by eco score', async () => {
    // Créer des produits avec différents eco scores
    const lowEcoProduct = await payload.create({
      collection: 'products',
      data: {
        title: 'Test Product Low Eco',
        collection: 'origin',
        price: 139,
        shortDescription: 'Produit eco faible',
        colors: [],
        sizes: [],
        ecoScore: 60,
        _status: 'published' as const,
      },
    })

    const highEcoProduct = await payload.create({
      collection: 'products',
      data: {
        title: 'Test Product High Eco',
        collection: 'origin',
        price: 139,
        shortDescription: 'Produit eco élevé',
        colors: [],
        sizes: [],
        ecoScore: 95,
        _status: 'published' as const,
      },
    })

    testProducts.push(lowEcoProduct, highEcoProduct)

    // Rechercher les produits avec un bon eco score
    const highEcoProducts = await payload.find({
      collection: 'products',
      where: {
        and: [
          {
            ecoScore: {
              greater_than_equal: 80,
            },
          },
          {
            title: {
              contains: 'Test Product',
            },
          },
        ],
      },
    })

    expect(highEcoProducts.docs).toHaveLength(1)
    expect(highEcoProducts.docs[0].ecoScore).toBe(95)
  })

  it('should update product stock', async () => {
    const product = await payload.create({
      collection: 'products',
      data: {
        title: 'Test Product Stock',
        collection: 'origin',
        price: 139,
        shortDescription: 'Produit pour test stock',
        colors: [],
        sizes: [
          {
            size: '42',
            availableStock: 10,
          },
        ],
        ecoScore: 85,
        _status: 'published' as const,
      },
    })

    testProducts.push(product)

    // Mettre à jour le stock
    const updatedProduct = await payload.update({
      collection: 'products',
      id: product.id,
      data: {
        sizes: [
          {
            size: '42',
            availableStock: 5,
          },
        ],
      },
    })

    expect(updatedProduct.sizes[0].availableStock).toBe(5)
  })

  it('should handle product search', async () => {
    // Créer des produits avec des termes de recherche spécifiques
    const product1 = await payload.create({
      collection: 'products',
      data: {
        title: 'Test Product Running Shoes',
        collection: 'move',
        price: 159,
        shortDescription: 'Chaussures de course',
        colors: [],
        sizes: [],
        ecoScore: 85,
        _status: 'published' as const,
      },
    })

    const product2 = await payload.create({
      collection: 'products',
      data: {
        title: 'Test Product Casual Sneakers',
        collection: 'origin',
        price: 139,
        shortDescription: 'Baskets décontractées',
        colors: [],
        sizes: [],
        ecoScore: 80,
        _status: 'published' as const,
      },
    })

    testProducts.push(product1, product2)

    // Recherche par titre
    const runningShoes = await payload.find({
      collection: 'products',
      where: {
        title: {
          contains: 'Running',
        },
      },
    })

    expect(runningShoes.docs).toHaveLength(1)
    expect(runningShoes.docs[0].title).toContain('Running')

    // Recherche par description
    const casualShoes = await payload.find({
      collection: 'products',
      where: {
        shortDescription: {
          contains: 'décontractées',
        },
      },
    })

    expect(casualShoes.docs).toHaveLength(1)
    expect(casualShoes.docs[0].shortDescription).toContain('décontractées')
  })

  it('should validate required fields', async () => {
    try {
      await payload.create({
        collection: 'products',
        data: {
          // Manque title, collection, price, shortDescription
          colors: [],
          sizes: [],
          ecoScore: 85,
          _status: 'published' as const,
        },
      })
      expect.fail('Should have thrown validation error')
    } catch (error: any) {
      expect(error.message).toContain('required')
    }
  })

  it('should prevent duplicate slugs', async () => {
    const productData = {
      title: 'Test Product Unique',
      slug: 'test-unique-slug',
      collection: 'origin',
      price: 139,
      shortDescription: 'Produit unique',
      colors: [],
      sizes: [],
      ecoScore: 85,
      _status: 'published' as const,
    }

    const product1 = await payload.create({
      collection: 'products',
      data: productData,
    })

    testProducts.push(product1)

    try {
      await payload.create({
        collection: 'products',
        data: productData,
      })
      expect.fail('Should have thrown duplicate slug error')
    } catch (error: any) {
      expect(error.message).toContain('duplicate')
    }
  })
})

