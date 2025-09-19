'use client'

import React, { useState } from 'react'
import { PaymentElement, AddressElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CreditCard, Shield } from 'lucide-react'

interface CustomerInfo {
  email: string
  firstName: string
  lastName: string
  phone: string
}

interface Address {
  line1: string
  line2?: string
  city: string
  postalCode: string
  country: string
}

interface StripePaymentFormProps {
  onSuccess: () => void
  onError: (error: string) => void
  totalAmount: number
  customerInfo: CustomerInfo
  shippingAddress: Address
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  onSuccess,
  onError,
  totalAmount,
  customerInfo,
  shippingAddress,
}) => {
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
    setMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        payment_method_data: {
          billing_details: {
            name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            email: customerInfo.email,
            phone: customerInfo.phone || undefined,
            address: {
              line1: shippingAddress.line1,
              line2: shippingAddress.line2 || undefined,
              city: shippingAddress.city,
              postal_code: shippingAddress.postalCode,
              state: '', // Requis par Stripe même si vide
              country: shippingAddress.country,
            },
          },
        },
      },
    })

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'Une erreur est survenue')
        onError(error.message || 'Une erreur est survenue')
      } else {
        setMessage('Une erreur inattendue est survenue')
        onError('Une erreur inattendue est survenue')
      }
    } else {
      onSuccess()
    }

    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Informations de paiement
        </CardTitle>
        <CardDescription>Vos données de paiement sont sécurisées et chiffrées</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Élément de paiement Stripe */}
          <div className="space-y-4">
            <PaymentElement
              options={{
                layout: 'tabs',
                paymentMethodOrder: ['card', 'paypal'],
                fields: {
                  billingDetails: 'never',
                },
                terms: {
                  card: 'never',
                },
              }}
            />
          </div>

          {/* Message d'erreur */}
          {message && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {message}
            </div>
          )}

          {/* Bouton de paiement */}
          <Button
            type="submit"
            disabled={!stripe || isLoading}
            className="w-full h-12 text-lg bg-terra-green hover:bg-terra-green/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 mr-2" />
                Payer {totalAmount.toFixed(2)}€
              </>
            )}
          </Button>

          {/* Informations de sécurité */}
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">Paiement sécurisé par Stripe • SSL 256 bits</p>
            <div className="flex justify-center items-center gap-4 text-xs text-gray-400">
              <span>🔒 Chiffré</span>
              <span>🛡️ PCI DSS</span>
              <span>✓ 3D Secure</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
