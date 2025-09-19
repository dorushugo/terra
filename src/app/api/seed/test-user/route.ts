import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Vérifier si l'utilisateur de test existe déjà
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'test@terra.com',
        },
      },
    })

    if (existingUsers.docs.length > 0) {
      return NextResponse.json({
        message: 'Utilisateur de test déjà existant',
        user: existingUsers.docs[0],
      })
    }

    // Créer l'utilisateur de test
    const testUser = await payload.create({
      collection: 'users',
      data: {
        email: 'test@terra.com',
        password: 'password123',
        firstName: 'Hugo',
        lastName: 'Test',
        phone: '+33 6 12 34 56 78',
        preferences: {
          newsletter: true,
          smsNotifications: false,
          emailNotifications: true,
          language: 'fr',
          currency: 'EUR',
        },
      },
    })

    // Créer une adresse de test
    const testAddress = await payload.create({
      collection: 'addresses',
      data: {
        user: testUser.id,
        type: 'shipping',
        firstName: 'Hugo',
        lastName: 'Test',
        address1: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'FR',
        phone: '+33 6 12 34 56 78',
        isDefault: true,
        label: 'Domicile',
      },
    })

    // Créer une commande de test
    const testOrder = await payload.create({
      collection: 'orders',
      data: {
        user: testUser.id,
        status: 'delivered',
        customer: {
          email: 'test@terra.com',
          firstName: 'Hugo',
          lastName: 'Test',
          phone: '+33 6 12 34 56 78',
        },
        items: [
          {
            product: null, // À remplir avec un vrai produit si nécessaire
            quantity: 1,
            size: '42',
            color: 'Stone White',
            unitPrice: 139,
            totalPrice: 139,
          },
        ],
        pricing: {
          subtotal: 139,
          shippingCost: 0,
          taxAmount: 0,
          discountAmount: 0,
          total: 139,
        },
        shippingAddress: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          country: 'FR',
        },
        paymentInfo: {
          method: 'card',
          status: 'paid',
          paidAt: new Date(),
        },
        tracking: {
          carrier: 'colissimo',
          trackingNumber: 'TR123456789',
          shippedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
          deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Il y a 1 jour
        },
      },
    })

    return NextResponse.json({
      message: 'Utilisateur de test créé avec succès',
      user: {
        id: testUser.id,
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
      },
      address: {
        id: testAddress.id,
      },
      order: {
        id: testOrder.id,
        orderNumber: testOrder.orderNumber,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur de test:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de l'utilisateur de test" },
      { status: 500 },
    )
  }
}
