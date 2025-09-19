import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Récupérer le token depuis les cookies
    const token = request.cookies.get('payload-token')?.value
    console.log('🔍 /api/account/orders - Token présent:', !!token)

    if (!token) {
      console.log('❌ /api/account/orders - Aucun token trouvé')
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier l'utilisateur avec le token
    const { user } = await payload.auth({ headers: request.headers })
    console.log('🔍 /api/account/orders - Utilisateur depuis auth:', !!user, user?.email)

    if (!user) {
      console.log('❌ /api/account/orders - Token invalide ou expiré')
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 })
    }

    console.log('🔍 Récupération commandes pour utilisateur:', user.email)

    // Récupérer les commandes de l'utilisateur
    const orders = await payload.find({
      collection: 'orders',
      where: {
        'customer.email': {
          equals: user.email,
        },
      },
      sort: '-createdAt', // Plus récentes en premier
      limit: 50, // Limiter à 50 commandes
      depth: 2, // Inclure les relations (produits, etc.)
    })

    console.log(`✅ ${orders.docs.length} commandes trouvées`)

    // Formater les données pour le frontend
    const formattedOrders = orders.docs.map((order: any) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      items:
        order.items?.map((item: any) => ({
          id: item.id,
          product: {
            id: item.product?.id || item.product,
            title: item.title || item.product?.title,
            price: item.product?.price || 0,
            images: item.product?.images || [],
          },
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.unitPrice || item.product?.price || 0,
        })) || [],
      customer: {
        email: order.customer?.email || '',
        firstName: order.customer?.firstName || '',
        lastName: order.customer?.lastName || '',
      },
      amount: {
        subtotal: order.amount?.subtotal || 0,
        total: order.amount?.total || 0,
        shippingCost: order.amount?.shippingCost || 0,
      },
      shippingAddress: order.shippingAddress || {},
      paymentInfo: order.paymentInfo || {},
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      total: orders.totalDocs,
    })
  } catch (error) {
    console.error('Erreur récupération commandes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 },
    )
  }
}
