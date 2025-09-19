import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

interface Props {
  params: Promise<{ orderId: string }>
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { orderId } = await params
    const payload = await getPayload({ config })

    // Récupérer le token depuis les cookies
    const token = request.cookies.get('payload-token')?.value
    console.log('🔍 /api/account/orders/[orderId] - Token présent:', !!token)

    if (!token) {
      console.log('❌ /api/account/orders/[orderId] - Aucun token trouvé')
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier l'utilisateur avec le token
    const { user } = await payload.auth({ headers: request.headers })
    console.log('🔍 /api/account/orders/[orderId] - Utilisateur depuis auth:', !!user, user?.email)

    if (!user) {
      console.log('❌ /api/account/orders/[orderId] - Token invalide ou expiré')
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 })
    }

    console.log('🔍 Récupération commande:', orderId, 'pour utilisateur:', user.email)

    // Récupérer la commande spécifique
    const order = await payload.findByID({
      collection: 'orders',
      id: orderId,
      depth: 2, // Inclure les relations
    })

    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })
    }

    // Vérifier que la commande appartient à l'utilisateur
    if (order.customer?.email !== user.email) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }

    console.log('✅ Commande trouvée:', order.orderNumber)

    // Formater les données pour le frontend
    const formattedOrder = {
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
    }

    return NextResponse.json({
      success: true,
      order: formattedOrder,
    })
  } catch (error) {
    console.error('Erreur récupération commande:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la commande' },
      { status: 500 },
    )
  }
}
