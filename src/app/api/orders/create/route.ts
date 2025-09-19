import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Récupérer le token depuis les cookies
    const token = req.cookies.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier le token et récupérer l'utilisateur
    const { user } = await payload.auth({ headers: req.headers })

    if (!user) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    const orderData = await req.json()

    // Valider les données de la commande
    if (!orderData.items || !orderData.customerInfo || !orderData.shippingAddress) {
      return NextResponse.json({ error: 'Données de commande incomplètes' }, { status: 400 })
    }

    // Calculer le total
    const subtotal = orderData.items.reduce((sum: number, item: any) => {
      return sum + item.quantity * item.unitPrice
    }, 0)

    const shippingCost = orderData.shippingCost || 0
    const taxAmount = orderData.taxAmount || 0
    const discountAmount = orderData.discountAmount || 0
    const total = subtotal + shippingCost + taxAmount - discountAmount

    // Créer la commande dans Payload
    const newOrder = await payload.create({
      collection: 'orders',
      data: {
        orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        user: user.id,
        status: 'pending',
        customer: {
          email: user.email,
          firstName: orderData.customerInfo.firstName || user.firstName,
          lastName: orderData.customerInfo.lastName || user.lastName,
          phone: orderData.customerInfo.phone || user.phone,
        },
        items: orderData.items.map((item: any) => ({
          product: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
        })),
        pricing: {
          subtotal,
          shippingCost,
          taxAmount,
          discountAmount,
          total,
        },
        shippingAddress: {
          street: orderData.shippingAddress.address1,
          city: orderData.shippingAddress.city,
          postalCode: orderData.shippingAddress.postalCode,
          country: orderData.shippingAddress.country || 'FR',
        },
        paymentInfo: {
          method: orderData.paymentMethod || 'card',
          status: 'pending',
        },
      },
    })

    return NextResponse.json({
      success: true,
      order: {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        status: newOrder.status,
        total: newOrder.pricing.total,
        createdAt: newOrder.createdAt,
      },
    })
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 },
    )
  }
}
