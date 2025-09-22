'use client'

import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/debug-checkout?success=true`,
      },
    })

    if (error) {
      setMessage(error.message || 'Une erreur est survenue')
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {message && <div className="text-red-600 text-sm">{message}</div>}
      <Button type="submit" disabled={!stripe || isLoading} className="w-full">
        {isLoading ? 'Traitement...' : 'Payer 29.99€'}
      </Button>
    </form>
  )
}

export default function DebugCheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [debug, setDebug] = useState<any>({})

  const createPaymentIntent = async () => {
    setLoading(true)
    setDebug({ step: 'creating_payment_intent' })

    try {
      const response = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              id: 'debug-item',
              product: {
                id: 'test-product-debug',
                name: 'Test Product Debug',
                price: 29.99,
                images: [],
              },
              quantity: 1,
              size: '42',
              color: 'Debug Color',
            },
          ],
          customerInfo: {
            email: 'debug@test.com',
            firstName: 'Debug',
            lastName: 'User',
          },
          shippingAddress: {
            line1: '123 Debug Street',
            city: 'Debug City',
            postalCode: '12345',
            country: 'FR',
          },
        }),
      })

      const data = await response.json()
      setDebug({
        step: 'payment_intent_response',
        status: response.status,
        data,
      })

      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
      }
    } catch (error) {
      setDebug({ step: 'error', error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Debug Stripe Checkout</h1>

        {/* Debug Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Configuration Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <strong>Stripe Public Key:</strong>{' '}
              {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Présente' : '❌ Manquante'}
            </div>
            <div>
              <strong>Client Secret:</strong> {clientSecret ? 'Présent' : 'Pas encore créé'}
            </div>
            <div>
              <strong>Stripe Promise:</strong> {stripePromise ? 'Chargé' : '❌ Erreur'}
            </div>
            <div>
              <strong>Debug Info:</strong>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-auto">
                {JSON.stringify(debug, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Étape 1: Créer PaymentIntent */}
        {!clientSecret && (
          <Card>
            <CardHeader>
              <CardTitle>Étape 1: Créer PaymentIntent</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={createPaymentIntent} disabled={loading}>
                {loading ? 'Création...' : 'Créer PaymentIntent'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Étape 2: Formulaire Stripe */}
        {clientSecret && (
          <Card>
            <CardHeader>
              <CardTitle>Étape 2: Formulaire Stripe Elements</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#16a34a',
                    },
                  },
                }}
              >
                <PaymentForm clientSecret={clientSecret} />
              </Elements>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


