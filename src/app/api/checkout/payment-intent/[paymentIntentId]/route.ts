import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paymentIntentId: string }> },
) {
  try {
    const { paymentIntentId } = await params

    // Récupérer le PaymentIntent depuis Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (!paymentIntent) {
      return NextResponse.json({ error: 'PaymentIntent non trouvé' }, { status: 404 })
    }

    // Construire une réponse similaire à celle de la session
    const responseData = {
      id: paymentIntent.id,
      status: paymentIntent.status === 'succeeded' ? 'complete' : paymentIntent.status,
      paymentStatus: paymentIntent.status === 'succeeded' ? 'paid' : 'unpaid',
      customer: {
        email: paymentIntent.metadata?.customerEmail || '',
        name: `${paymentIntent.metadata?.customerFirstName || ''} ${paymentIntent.metadata?.customerLastName || ''}`.trim(),
        phone: paymentIntent.metadata?.customerPhone || '',
      },
      amountTotal: paymentIntent.amount,
      currency: paymentIntent.currency,
      shipping: {
        address: {
          line1: paymentIntent.metadata?.shippingLine1 || '',
          city: paymentIntent.metadata?.shippingCity || '',
          postal_code: paymentIntent.metadata?.shippingPostalCode || '',
          country: 'FR',
        },
      },
      items: [], // Pour l'instant vide, on pourrait récupérer depuis le cache
      lineItems: {
        data: [], // Pour compatibilité
      },
      created: new Date(paymentIntent.created * 1000).toISOString(),
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Erreur récupération PaymentIntent:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du PaymentIntent' },
      { status: 500 },
    )
  }
}
