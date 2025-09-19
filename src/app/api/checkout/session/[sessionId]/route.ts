import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID requis' }, { status: 400 })
    }

    // Récupérer les détails de la session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer_details', 'payment_intent'],
    })

    if (!session) {
      return NextResponse.json({ error: 'Session non trouvée' }, { status: 404 })
    }

    // Formater les données pour le frontend
    const sessionData = {
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      customer: {
        email: session.customer_details?.email,
        name: session.customer_details?.name,
        phone: session.customer_details?.phone,
      },
      amount: {
        subtotal: session.amount_subtotal ? session.amount_subtotal / 100 : 0,
        total: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency,
      },
      shipping: session.shipping_details
        ? {
            name: session.shipping_details.name,
            address: session.shipping_details.address,
          }
        : null,
      items:
        session.line_items?.data?.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          amount: item.amount_total ? item.amount_total / 100 : 0,
        })) || [],
      created: new Date(session.created * 1000),
    }

    return NextResponse.json(sessionData)
  } catch (error) {
    console.error('Erreur récupération session:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la session' },
      { status: 500 },
    )
  }
}
