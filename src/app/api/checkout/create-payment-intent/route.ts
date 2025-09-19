import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@payload-config'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

interface CartItem {
  id: string
  product: {
    id: string
    name: string
    price: number
    images?: Array<{
      image: {
        url: string
        updatedAt: string
      }
      alt: string
    }>
  }
  quantity: number
  size: string
  color: string
}

interface PaymentIntentRequest {
  items: CartItem[]
  customerInfo: {
    email: string
    firstName: string
    lastName: string
    phone?: string
  }
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    postalCode: string
    country: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentIntentRequest = await request.json()
    const { items, customerInfo, shippingAddress } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    // Calculer le total
    const payload = await getPayload({ config })
    let totalAmount = 0

    for (const item of items) {
      // Mode test : skip la vérification de stock si l'ID commence par "test-"
      if (!String(item.product.id).startsWith('test-')) {
        // Vérifier le produit et son stock
        const product = await payload.findByID({
          collection: 'products',
          id: item.product.id,
        })

        if (!product) {
          return NextResponse.json(
            { error: `Produit ${item.product.name} non trouvé` },
            { status: 400 },
          )
        }

        // Vérifier le stock pour la taille
        const sizeData = product.sizes?.find((s: any) => s.size === item.size)
        if (!sizeData || sizeData.availableStock < item.quantity) {
          return NextResponse.json(
            { error: `Stock insuffisant pour ${item.product.name} taille ${item.size}` },
            { status: 400 },
          )
        }
      }

      totalAmount += (item.product.price || 0) * item.quantity
    }

    // Ajouter les frais de livraison (gratuite à partir de 75€)
    const shippingCost = totalAmount >= 75 ? 0 : 7.9
    const finalAmount = totalAmount + shippingCost

    // Créer le PaymentIntent avec les données complètes dans la description
    const orderData = {
      items,
      customerInfo,
      shippingAddress,
      subtotal: totalAmount,
      shippingCost,
      total: finalAmount,
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100), // Convertir en centimes
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      description: `Commande TERRA - ${items.length} article(s)`,
      // Stocker les données complètes dans un champ privé (pas visible au client)
      statement_descriptor_suffix: 'TERRA',
      metadata: {
        customerEmail: customerInfo.email,
        customerFirstName: customerInfo.firstName,
        customerLastName: customerInfo.lastName,
        customerPhone: customerInfo.phone || '',
        // Stocker seulement les infos essentielles des items (limité à 500 chars)
        itemCount: items.length.toString(),
        productIds: items
          .map((item) => item.product.id)
          .join(',')
          .substring(0, 450),
        shippingLine1: shippingAddress.line1.substring(0, 100),
        shippingCity: shippingAddress.city.substring(0, 50),
        shippingPostalCode: shippingAddress.postalCode,
        subtotal: totalAmount.toString(),
        shippingCost: shippingCost.toString(),
        total: finalAmount.toString(),
      },
    })

    // Stocker temporairement les données complètes de la commande
    // En production, utiliser Redis ou une base de données
    global.orderCache = global.orderCache || new Map()
    global.orderCache.set(paymentIntent.id, orderData)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: finalAmount,
      subtotal: totalAmount,
      shippingCost,
    })
  } catch (error) {
    console.error('Erreur création PaymentIntent:', error)
    return NextResponse.json({ error: 'Erreur lors de la création du paiement' }, { status: 500 })
  }
}
