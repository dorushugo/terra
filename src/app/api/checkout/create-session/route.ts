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

interface CheckoutRequest {
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
  billingAddress?: {
    line1: string
    line2?: string
    city: string
    postalCode: string
    country: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json()
    const { items, customerInfo, shippingAddress, billingAddress } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    // Vérifier la disponibilité des produits et calculer le total
    const payload = await getPayload({ config })
    let totalAmount = 0
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    for (const item of items) {
      // Mode test : skip la vérification de stock si l'ID commence par "test-"
      if (!item.product.id.startsWith('test-')) {
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

      // Préparer l'image du produit
      let productImage: string | undefined
      if (item.product.images?.[0]?.image?.url) {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        productImage = `${baseUrl}${item.product.images[0].image.url}`
      }

      // Créer l'item Stripe
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${item.product.name} - Taille ${item.size}`,
            description: `Couleur: ${item.color}`,
            images: productImage ? [productImage] : undefined,
            metadata: {
              productId: item.product.id,
              size: item.size,
              color: item.color,
            },
          },
          unit_amount: Math.round((item.product.price || 0) * 100), // Convertir en centimes
        },
        quantity: item.quantity,
      })
    }

    // Ajouter les frais de livraison (gratuite à partir de 75€)
    const shippingCost = totalAmount >= 75 ? 0 : 7.9
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Frais de livraison',
            description: 'Livraison standard (gratuite dès 75€)',
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      })
    }

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: customerInfo.email,
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'DE', 'ES', 'IT', 'NL', 'CH', 'LU'],
      },
      billing_address_collection: 'required',
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: shippingCost > 0 ? Math.round(shippingCost * 100) : 0,
              currency: 'eur',
            },
            display_name: shippingCost > 0 ? 'Livraison standard' : 'Livraison gratuite',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 2,
              },
              maximum: {
                unit: 'business_day',
                value: 5,
              },
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cart`,
      metadata: {
        customerEmail: customerInfo.email,
        customerFirstName: customerInfo.firstName,
        customerLastName: customerInfo.lastName,
        customerPhone: customerInfo.phone || '',
        cartItems: JSON.stringify(items),
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expire dans 30 minutes
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Erreur création session Stripe:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 },
    )
  }
}
