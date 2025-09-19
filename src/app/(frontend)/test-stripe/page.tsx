'use client'

import React, { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function TestStripePage() {
  const [stripeLoaded, setStripeLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    stripePromise.then((stripe) => {
      setStripeLoaded(!!stripe)
    })
  }, [])

  const testCheckout = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              id: 'test-item-1',
              product: {
                id: 'test-product-1',
                name: 'Test Product',
                price: 29.99,
                images: [],
              },
              quantity: 1,
              size: '42',
              color: 'Test Color',
            },
          ],
          customerInfo: {
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
          },
          shippingAddress: {
            line1: '123 Test Street',
            city: 'Test City',
            postalCode: '12345',
            country: 'FR',
          },
        }),
      })

      const { sessionId, url, error } = await response.json()

      if (error) {
        alert('Erreur: ' + error)
        return
      }

      // Rediriger vers Stripe Checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Erreur Stripe:', error)
          alert('Erreur lors de la redirection vers le paiement')
        }
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors du test')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 text-center space-y-6">
        <h1 className="text-2xl font-bold">Test Stripe Integration</h1>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Configuration Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Stripe Client:</span>
                <span className={stripeLoaded ? 'text-green-600' : 'text-red-600'}>
                  {stripeLoaded ? '✅ Loaded' : '❌ Failed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Public Key:</span>
                <span className="text-xs font-mono">
                  {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                    ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.slice(0, 20) + '...'
                    : '❌ Missing'}
                </span>
              </div>
            </div>
          </div>

          <Button onClick={testCheckout} disabled={!stripeLoaded || loading} className="w-full">
            {loading ? 'Test en cours...' : 'Test Stripe Checkout'}
          </Button>

          <p className="text-xs text-gray-500">
            Ce bouton va créer une session de test et te rediriger vers Stripe
          </p>
        </div>
      </div>
    </div>
  )
}
