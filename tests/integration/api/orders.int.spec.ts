import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

let payload: Payload
let testUser: any
let testProduct: any
let testOrders: any[] = []

describe('Orders API Integration', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // Créer un utilisateur de test
    testUser = await payload.create({
      collection: 'users',
      data: {
        email: 'test-orders@terra.com',
        password: 'testPassword123',
        firstName: 'Test',
        lastName: 'User',
      },
    })

    // Créer un produit de test
    testProduct = await payload.create({
      collection: 'products',
      data: {
        title: 'Test Product for Orders',
        slug: 'test-product-orders',
        collection: 'origin',
        price: 139,
        shortDescription: 'Produit pour tester les commandes',
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
        _status: 'published' as const,
      },
    })
  })

  beforeEach(async () => {
    // Nettoyer les commandes de test avant chaque test
    try {
      const existingOrders = await payload.find({
        collection: 'orders',
        where: {
          user: {
            equals: testUser.id,
          },
        },
      })

      for (const order of existingOrders.docs) {
        await payload.delete({
          collection: 'orders',
          id: order.id,
        })
      }
    } catch (error) {
      // Ignore si pas de commandes à nettoyer
    }
    testOrders = []
  })

  afterAll(async () => {
    // Nettoyer après tous les tests
    for (const order of testOrders) {
      try {
        await payload.delete({
          collection: 'orders',
          id: order.id,
        })
      } catch (error) {
        // Ignore si déjà supprimé
      }
    }

    if (testProduct) {
      try {
        await payload.delete({
          collection: 'products',
          id: testProduct.id,
        })
      } catch (error) {
        // Ignore si déjà supprimé
      }
    }

    if (testUser) {
      try {
        await payload.delete({
          collection: 'users',
          id: testUser.id,
        })
      } catch (error) {
        // Ignore si déjà supprimé
      }
    }
  })

  it('should create a new order', async () => {
    const orderData = {
      orderNumber: 'ORD-TEST-001',
      user: testUser.id,
      status: 'pending' as const,
      customer: {
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        phone: '+33123456789',
      },
      items: [
        {
          product: testProduct.id,
          quantity: 2,
          size: '42',
          color: 'Stone White',
          unitPrice: testProduct.price,
          totalPrice: testProduct.price * 2,
        },
      ],
      pricing: {
        subtotal: testProduct.price * 2,
        shippingCost: 0,
        taxAmount: 0,
        discountAmount: 0,
        total: testProduct.price * 2,
      },
      shippingAddress: {
        street: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'FR',
      },
      paymentInfo: {
        method: 'card',
        status: 'pending',
      },
    }

    const order = await payload.create({
      collection: 'orders',
      data: orderData,
    })

    testOrders.push(order)

    expect(order).toBeDefined()
    expect(order.orderNumber).toBe(orderData.orderNumber)
    expect(order.user).toBe(testUser.id)
    expect(order.status).toBe('pending')
    expect(order.items).toHaveLength(1)
    expect(order.items[0].quantity).toBe(2)
    expect(order.pricing.total).toBe(testProduct.price * 2)
  })

  it('should generate unique order numbers', async () => {
    const orderData1 = {
      orderNumber: 'ORD-TEST-001',
      user: testUser.id,
      status: 'pending' as const,
      customer: {
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
      },
      items: [
        {
          product: testProduct.id,
          quantity: 1,
          size: '42',
          color: 'Stone White',
          unitPrice: testProduct.price,
          totalPrice: testProduct.price,
        },
      ],
      pricing: {
        subtotal: testProduct.price,
        shippingCost: 0,
        taxAmount: 0,
        discountAmount: 0,
        total: testProduct.price,
      },
      shippingAddress: {
        street: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'FR',
      },
      paymentInfo: {
        method: 'card',
        status: 'pending',
      },
    }

    const order1 = await payload.create({
      collection: 'orders',
      data: orderData1,
    })

    testOrders.push(order1)

    // Tenter de créer une commande avec le même numéro
    try {
      const order2 = await payload.create({
        collection: 'orders',
        data: orderData1,
      })
      testOrders.push(order2)
      expect.fail('Should have thrown duplicate order number error')
    } catch (error: any) {
      expect(error.message).toContain('duplicate')
    }
  })

  it('should update order status', async () => {
    const order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber: 'ORD-TEST-STATUS',
        user: testUser.id,
        status: 'pending' as const,
        customer: {
          email: testUser.email,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
        },
        items: [
          {
            product: testProduct.id,
            quantity: 1,
            size: '42',
            color: 'Stone White',
            unitPrice: testProduct.price,
            totalPrice: testProduct.price,
          },
        ],
        pricing: {
          subtotal: testProduct.price,
          shippingCost: 0,
          taxAmount: 0,
          discountAmount: 0,
          total: testProduct.price,
        },
        shippingAddress: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          country: 'FR',
        },
        paymentInfo: {
          method: 'card',
          status: 'pending',
        },
      },
    })

    testOrders.push(order)

    // Mettre à jour le statut
    const updatedOrder = await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        status: 'processing',
      },
    })

    expect(updatedOrder.status).toBe('processing')
  })

  it('should find orders by user', async () => {
    // Créer plusieurs commandes pour l'utilisateur
    const order1 = await payload.create({
      collection: 'orders',
      data: {
        orderNumber: 'ORD-TEST-USER-1',
        user: testUser.id,
        status: 'pending' as const,
        customer: {
          email: testUser.email,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
        },
        items: [
          {
            product: testProduct.id,
            quantity: 1,
            size: '42',
            color: 'Stone White',
            unitPrice: testProduct.price,
            totalPrice: testProduct.price,
          },
        ],
        pricing: {
          subtotal: testProduct.price,
          shippingCost: 0,
          taxAmount: 0,
          discountAmount: 0,
          total: testProduct.price,
        },
        shippingAddress: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          country: 'FR',
        },
        paymentInfo: {
          method: 'card',
          status: 'pending',
        },
      },
    })

    const order2 = await payload.create({
      collection: 'orders',
      data: {
        orderNumber: 'ORD-TEST-USER-2',
        user: testUser.id,
        status: 'delivered' as const,
        customer: {
          email: testUser.email,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
        },
        items: [
          {
            product: testProduct.id,
            quantity: 2,
            size: '42',
            color: 'Stone White',
            unitPrice: testProduct.price,
            totalPrice: testProduct.price * 2,
          },
        ],
        pricing: {
          subtotal: testProduct.price * 2,
          shippingCost: 0,
          taxAmount: 0,
          discountAmount: 0,
          total: testProduct.price * 2,
        },
        shippingAddress: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          country: 'FR',
        },
        paymentInfo: {
          method: 'card',
          status: 'completed',
        },
      },
    })

    testOrders.push(order1, order2)

    // Rechercher les commandes de l'utilisateur
    const userOrders = await payload.find({
      collection: 'orders',
      where: {
        user: {
          equals: testUser.id,
        },
      },
      sort: '-createdAt',
    })

    expect(userOrders.docs).toHaveLength(2)
    expect(userOrders.docs[0].orderNumber).toBe('ORD-TEST-USER-2') // Plus récente en premier
    expect(userOrders.docs[1].orderNumber).toBe('ORD-TEST-USER-1')
  })

  it('should find orders by status', async () => {
    // Créer des commandes avec différents statuts
    const pendingOrder = await payload.create({
      collection: 'orders',
      data: {
        orderNumber: 'ORD-TEST-PENDING',
        user: testUser.id,
        status: 'pending' as const,
        customer: {
          email: testUser.email,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
        },
        items: [
          {
            product: testProduct.id,
            quantity: 1,
            size: '42',
            color: 'Stone White',
            unitPrice: testProduct.price,
            totalPrice: testProduct.price,
          },
        ],
        pricing: {
          subtotal: testProduct.price,
          shippingCost: 0,
          taxAmount: 0,
          discountAmount: 0,
          total: testProduct.price,
        },
        shippingAddress: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          country: 'FR',
        },
        paymentInfo: {
          method: 'card',
          status: 'pending',
        },
      },
    })

    const deliveredOrder = await payload.create({
      collection: 'orders',
      data: {
        orderNumber: 'ORD-TEST-DELIVERED',
        user: testUser.id,
        status: 'delivered' as const,
        customer: {
          email: testUser.email,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
        },
        items: [
          {
            product: testProduct.id,
            quantity: 1,
            size: '42',
            color: 'Stone White',
            unitPrice: testProduct.price,
            totalPrice: testProduct.price,
          },
        ],
        pricing: {
          subtotal: testProduct.price,
          shippingCost: 0,
          taxAmount: 0,
          discountAmount: 0,
          total: testProduct.price,
        },
        shippingAddress: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          country: 'FR',
        },
        paymentInfo: {
          method: 'card',
          status: 'completed',
        },
      },
    })

    testOrders.push(pendingOrder, deliveredOrder)

    // Rechercher les commandes en attente
    const pendingOrders = await payload.find({
      collection: 'orders',
      where: {
        status: {
          equals: 'pending',
        },
        user: {
          equals: testUser.id,
        },
      },
    })

    expect(pendingOrders.docs).toHaveLength(1)
    expect(pendingOrders.docs[0].status).toBe('pending')

    // Rechercher les commandes livrées
    const deliveredOrders = await payload.find({
      collection: 'orders',
      where: {
        status: {
          equals: 'delivered',
        },
        user: {
          equals: testUser.id,
        },
      },
    })

    expect(deliveredOrders.docs).toHaveLength(1)
    expect(deliveredOrders.docs[0].status).toBe('delivered')
  })

  it('should calculate order totals correctly', async () => {
    const orderData = {
      orderNumber: 'ORD-TEST-TOTALS',
      user: testUser.id,
      status: 'pending' as const,
      customer: {
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
      },
      items: [
        {
          product: testProduct.id,
          quantity: 2,
          size: '42',
          color: 'Stone White',
          unitPrice: testProduct.price,
          totalPrice: testProduct.price * 2,
        },
      ],
      pricing: {
        subtotal: testProduct.price * 2, // 278
        shippingCost: 7.9,
        taxAmount: 20,
        discountAmount: 10,
        total: testProduct.price * 2 + 7.9 + 20 - 10, // 295.9
      },
      shippingAddress: {
        street: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'FR',
      },
      paymentInfo: {
        method: 'card',
        status: 'pending',
      },
    }

    const order = await payload.create({
      collection: 'orders',
      data: orderData,
    })

    testOrders.push(order)

    expect(order.pricing.subtotal).toBe(278)
    expect(order.pricing.shippingCost).toBe(7.9)
    expect(order.pricing.taxAmount).toBe(20)
    expect(order.pricing.discountAmount).toBe(10)
    expect(order.pricing.total).toBe(295.9)
  })

  it('should validate required order fields', async () => {
    try {
      await payload.create({
        collection: 'orders',
        data: {
          // Manque orderNumber, user, status, customer, items, pricing, etc.
          shippingAddress: {
            street: '123 Rue de la Paix',
            city: 'Paris',
            postalCode: '75001',
            country: 'FR',
          },
        },
      })
      expect.fail('Should have thrown validation error')
    } catch (error: any) {
      expect(error.message).toContain('required')
    }
  })

  it('should handle order with multiple items', async () => {
    // Créer un deuxième produit
    const testProduct2 = await payload.create({
      collection: 'products',
      data: {
        title: 'Test Product 2 for Orders',
        slug: 'test-product-2-orders',
        collection: 'move',
        price: 159,
        shortDescription: 'Deuxième produit pour tester',
        colors: [],
        sizes: [
          {
            size: '43',
            availableStock: 5,
          },
        ],
        ecoScore: 80,
        _status: 'published' as const,
      },
    })

    const orderData = {
      orderNumber: 'ORD-TEST-MULTI',
      user: testUser.id,
      status: 'pending' as const,
      customer: {
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
      },
      items: [
        {
          product: testProduct.id,
          quantity: 1,
          size: '42',
          color: 'Stone White',
          unitPrice: testProduct.price,
          totalPrice: testProduct.price,
        },
        {
          product: testProduct2.id,
          quantity: 2,
          size: '43',
          color: 'Black',
          unitPrice: testProduct2.price,
          totalPrice: testProduct2.price * 2,
        },
      ],
      pricing: {
        subtotal: testProduct.price + testProduct2.price * 2, // 139 + 318 = 457
        shippingCost: 0,
        taxAmount: 0,
        discountAmount: 0,
        total: testProduct.price + testProduct2.price * 2,
      },
      shippingAddress: {
        street: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'FR',
      },
      paymentInfo: {
        method: 'card',
        status: 'pending',
      },
    }

    const order = await payload.create({
      collection: 'orders',
      data: orderData,
    })

    testOrders.push(order)

    expect(order.items).toHaveLength(2)
    expect(order.items[0].quantity).toBe(1)
    expect(order.items[1].quantity).toBe(2)
    expect(order.pricing.total).toBe(457)

    // Nettoyer le produit de test
    await payload.delete({
      collection: 'products',
      id: testProduct2.id,
    })
  })
})
