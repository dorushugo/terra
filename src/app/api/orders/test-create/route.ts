import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Trouver l'utilisateur test
    const testUser = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'test@terra.com',
        },
      },
    })

    if (testUser.docs.length === 0) {
      return NextResponse.json({ error: 'Utilisateur test introuvable' }, { status: 404 })
    }

    const user = testUser.docs[0]

    // Trouver un produit pour la commande
    const products = await payload.find({
      collection: 'products',
      limit: 1,
    })

    if (products.docs.length === 0) {
      return NextResponse.json({ error: 'Aucun produit disponible' }, { status: 404 })
    }

    const product = products.docs[0]

    // Créer une commande de test
    const newOrder = await payload.create({
      collection: 'orders',
      data: {
        user: user.id,
        status: 'confirmed',
        customer: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone || '+33 6 12 34 56 78',
        },
        items: [
          {
            product: product.id,
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
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Commande de test créée avec succès',
      order: {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        status: newOrder.status,
        total: newOrder.pricing.total,
        createdAt: newOrder.createdAt,
      },
    })
  } catch (error) {
    console.error('Erreur lors de la création de la commande de test:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande de test', details: error },
      { status: 500 },
    )
  }
}
