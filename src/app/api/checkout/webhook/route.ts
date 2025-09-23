import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@payload-config'
import { decrementStockDirect, releaseStockDirect } from '@/utilities/directStockUpdate'

// Déclaration du type global pour le cache des commandes
declare global {
  var orderCache: Map<string, any> | undefined
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  console.log('🔔 Webhook reçu de Stripe')
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!
  console.log('🔍 Signature présente:', !!sig)

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Erreur signature webhook:', err)
    return NextResponse.json({ error: 'Signature webhook invalide' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Récupérer les métadonnées du paiement
        // Récupérer les données complètes depuis le cache
        global.orderCache = global.orderCache || new Map()
        const orderData = global.orderCache.get(paymentIntent.id)

        if (!orderData) {
          console.error('❌ Données de commande introuvables dans le cache')
          return NextResponse.json({ received: true })
        }

        const { items: cartItems, customerInfo, shippingAddress: orderShippingAddress } = orderData

        // Récupérer l'utilisateur à partir de l'email (si il existe)
        let userId = null
        try {
          const users = await payload.find({
            collection: 'users',
            where: {
              email: {
                equals: customerInfo.email,
              },
            },
            limit: 1,
          })
          if (users.docs.length > 0) {
            userId = users.docs[0].id
            console.log(
              '✅ Utilisateur trouvé pour la commande:',
              customerInfo.email,
              'ID:',
              userId,
            )
          } else {
            console.log('ℹ️ Commande pour un utilisateur non inscrit:', customerInfo.email)
          }
        } catch (error) {
          console.error('❌ Erreur lors de la recherche utilisateur:', error)
        }

        // Créer la commande dans Payload
        const newOrderData = {
          status: 'confirmed',
          user: userId, // Lier à l'utilisateur si il existe
          customer: {
            email: customerInfo.email,
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            phone: customerInfo.phone || '',
          },
          items: cartItems.map((item: any) => ({
            product: item.product.id,
            title: item.product.title || item.product.name, // Support des deux formats
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            unitPrice: item.product.price,
            totalPrice: item.product.price * item.quantity,
          })),
          pricing: {
            subtotal: parseFloat(paymentIntent.metadata?.subtotal || '0'),
            total: parseFloat(paymentIntent.metadata?.total || '0'),
            shippingCost: parseFloat(paymentIntent.metadata?.shippingCost || '0'),
            taxAmount: 0,
          },
          shippingAddress: {
            street: `${orderShippingAddress.line1}${orderShippingAddress.line2 ? ' ' + orderShippingAddress.line2 : ''}`,
            city: orderShippingAddress.city,
            postalCode: orderShippingAddress.postalCode,
            country: orderShippingAddress.country || 'FR',
          },
          billingAddress: {
            street: `${orderShippingAddress.line1}${orderShippingAddress.line2 ? ' ' + orderShippingAddress.line2 : ''}`,
            city: orderShippingAddress.city,
            postalCode: orderShippingAddress.postalCode,
            country: orderShippingAddress.country || 'FR',
          },
          paymentInfo: {
            method: 'card',
            status: 'paid',
            transactionId: paymentIntent.id,
            paidAt: new Date(),
          },
        }

        // Créer la commande
        const order = await payload.create({
          collection: 'orders',
          data: newOrderData as any, // Le orderNumber est auto-généré par le hook
        })

        console.log('✅ Commande créée via PaymentIntent:', order.orderNumber)

        // Nettoyer le cache après utilisation
        global.orderCache.delete(paymentIntent.id)

        // Décrémenter le stock définitivement pour chaque item
        for (const item of cartItems) {
          try {
            if (!item.product.id.startsWith('test-')) {
              const success = await decrementStockDirect(
                item.product.id,
                item.size,
                item.quantity,
                order.orderNumber,
              )

              if (success) {
                console.log(
                  `✅ Stock décrémenté: ${item.product.name} taille ${item.size} (${item.quantity} unités)`,
                )
              } else {
                console.error(
                  `❌ Échec décrémentation stock: ${item.product.name} taille ${item.size}`,
                )
              }
            }
          } catch (error) {
            console.error(`❌ Erreur décrémentation stock pour ${item.product.name}:`, error)
          }
        }

        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Récupérer les détails de la session avec les line items
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items', 'customer_details'],
        })

        const cartItems = JSON.parse(session.metadata?.cartItems || '[]')

        // Créer la commande dans Payload
        const orderData = {
          status: 'confirmed',
          customer: {
            email: session.metadata?.customerEmail || session.customer_details?.email || '',
            firstName: session.metadata?.customerFirstName || '',
            lastName: session.metadata?.customerLastName || '',
            phone: session.metadata?.customerPhone || session.customer_details?.phone || '',
          },
          items: cartItems.map((item: any) => ({
            product: item.product,
            title: item.title,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
          })),
          pricing: {
            subtotal: session.amount_subtotal ? session.amount_subtotal / 100 : 0,
            total: session.amount_total ? session.amount_total / 100 : 0,
            shippingCost: fullSession.shipping_cost?.amount_total
              ? fullSession.shipping_cost.amount_total / 100
              : 0,
            taxAmount: session.total_details?.amount_tax
              ? session.total_details.amount_tax / 100
              : 0,
          },
          shippingAddress: {
            street: `${session.customer_details?.address?.line1 || ''}${session.customer_details?.address?.line2 ? ' ' + session.customer_details.address.line2 : ''}`,
            city: session.customer_details?.address?.city || '',
            postalCode: session.customer_details?.address?.postal_code || '',
            country: session.customer_details?.address?.country || 'FR',
          },
          billingAddress: {
            street: `${session.customer_details?.address?.line1 || ''}${session.customer_details?.address?.line2 ? ' ' + session.customer_details.address.line2 : ''}`,
            city: session.customer_details?.address?.city || '',
            postalCode: session.customer_details?.address?.postal_code || '',
            country: session.customer_details?.address?.country || 'FR',
          },
          paymentInfo: {
            method: 'card',
            status: 'paid',
            transactionId: session.payment_intent as string,
            paidAt: new Date(),
          },
        }

        // Créer la commande
        const order = await payload.create({
          collection: 'orders',
          data: orderData as any, // Le orderNumber est auto-généré par le hook
        })

        console.log('✅ Commande créée:', order.orderNumber)

        // Décrémenter le stock définitivement pour chaque item
        for (const item of cartItems) {
          try {
            const product = await payload.findByID({
              collection: 'products',
              id: item.product,
            })

            if (product && product.sizes) {
              const sizeIndex = product.sizes.findIndex((s: any) => s.size === item.size)
              if (sizeIndex !== -1) {
                const currentStock = product.sizes[sizeIndex].stock || 0
                const newStock = Math.max(0, currentStock - item.quantity)

                // Décrémenter le stock réel
                product.sizes[sizeIndex].stock = newStock

                await payload.update({
                  collection: 'products',
                  id: item.product,
                  data: {
                    sizes: product.sizes,
                  },
                })

                console.log(
                  `✅ Stock décrémenté: ${item.title} taille ${item.size} (${currentStock} → ${newStock})`,
                )

                // Créer un mouvement de stock pour traçabilité
                await payload.create({
                  collection: 'stock-movements',
                  data: {
                    product: item.product,
                    size: item.size,
                    reference: order.orderNumber,
                    type: 'sale',
                    quantity: -item.quantity,
                    stockBefore: currentStock,
                    stockAfter: newStock,
                    reason: `Vente - Commande ${order.orderNumber}`,
                    orderReference: order.orderNumber,
                    date: new Date().toISOString(),
                  },
                })
              }
            }
          } catch (error) {
            console.error(`❌ Erreur décrémentation stock pour ${item.title}:`, error)
          }
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('❌ Paiement échoué:', paymentIntent.id)

        // Récupérer les données de commande depuis le cache pour libérer le stock
        global.orderCache = global.orderCache || new Map()
        const orderData = global.orderCache.get(paymentIntent.id)

        if (orderData) {
          const { items: cartItems } = orderData

          // Libérer le stock réservé pour chaque item
          for (const item of cartItems) {
            try {
              if (!item.product.id.startsWith('test-')) {
                const success = await releaseStockDirect(item.product.id, item.size, item.quantity)

                if (success) {
                  console.log(
                    `✅ Stock réservé libéré: ${item.product.name} taille ${item.size} (${item.quantity} unités)`,
                  )
                } else {
                  console.error(
                    `❌ Échec libération stock: ${item.product.name} taille ${item.size}`,
                  )
                }
              }
            } catch (error) {
              console.error(`❌ Erreur libération stock pour ${item.product.name}:`, error)
            }
          }

          // Nettoyer le cache
          global.orderCache.delete(paymentIntent.id)
        }

        break
      }

      default:
        console.log(`Type d'événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erreur traitement webhook:', error)
    return NextResponse.json({ error: 'Erreur traitement webhook' }, { status: 500 })
  }
}
