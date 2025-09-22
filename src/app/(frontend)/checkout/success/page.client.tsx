'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/providers/CartProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  CheckCircle,
  Package,
  Mail,
  Home,
  Truck,
  Calendar,
  Loader2,
  TreePine,
  Recycle,
  Heart,
} from 'lucide-react'

interface SessionData {
  id: string
  status: string
  paymentStatus: string
  customer: {
    email?: string
    name?: string
    phone?: string
  }
  amount: {
    subtotal: number
    total: number
    currency: string
  }
  shipping?: {
    name?: string
    address?: any
  }
  items: Array<{
    description: string
    quantity: number
    amount: number
  }>
  created: string
}

const CheckoutSuccessClient = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const paymentIntentId = searchParams.get('payment_intent')
  const { clearCart } = useCart()

  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId && !paymentIntentId) {
        setError('Session ID ou Payment Intent manquant')
        setLoading(false)
        return
      }

      try {
        // Utiliser l'endpoint approprié selon le type d'ID
        const endpoint = sessionId
          ? `/api/checkout/session/${sessionId}`
          : `/api/checkout/payment-intent/${paymentIntentId}`

        console.log('🔍 Récupération des données de commande:', endpoint)
        const response = await fetch(endpoint)
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Données de commande récupérées:', data)
          setSessionData(data)
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error('❌ Erreur API:', response.status, errorData)
          setError(errorData.error || 'Erreur lors de la récupération des données')
        }
      } catch (err) {
        console.error('❌ Erreur fetchSessionData:', err)
        setError('Erreur de connexion')
      } finally {
        setLoading(false)
      }
    }

    fetchSessionData()
  }, [sessionId, paymentIntentId]) // Retiré clearCart des dépendances

  // Effet séparé pour vider le panier une seule fois
  useEffect(() => {
    if (sessionData && !loading && !error) {
      clearCart()
    }
  }, [sessionData, loading, error, clearCart])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-terra-green" />
          <p>Chargement des détails de votre commande...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-6">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/')}>Retour à l'accueil</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header de succès */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold font-terra-display mb-2">Commande confirmée !</h1>
          <p className="text-gray-600 text-lg">
            Merci pour votre commande. Nous avons bien reçu votre paiement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Détails de la commande */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Détails de votre commande
                </CardTitle>
                <CardDescription>
                  {sessionId ? `Session ID: ${sessionId}` : `Payment Intent: ${paymentIntentId}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sessionData?.items?.length > 0 ? (
                  sessionData.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.description}</p>
                        <p className="text-xs text-gray-500">Quantité: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{item.amount.toFixed(2)}€</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Détails des articles en cours de récupération...
                  </p>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total payé</span>
                  <span>
                    {sessionData?.amountTotal ? (sessionData.amountTotal / 100).toFixed(2) : '0.00'}
                    €
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Informations de livraison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Livraison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">
                      {sessionData?.shipping?.name || sessionData?.customer.name}
                    </p>
                    {sessionData?.shipping?.address && (
                      <div className="text-sm text-gray-600">
                        <p>{sessionData.shipping.address.line1}</p>
                        {sessionData.shipping.address.line2 && (
                          <p>{sessionData.shipping.address.line2}</p>
                        )}
                        <p>
                          {sessionData.shipping.address.postal_code}{' '}
                          {sessionData.shipping.address.city}
                        </p>
                        <p>{sessionData.shipping.address.country}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">Livraison estimée</span>
                    </div>
                    <p className="text-sm text-gray-600">Entre 2 et 5 jours ouvrés</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prochaines étapes et avantages */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Prochaines étapes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full p-1 mt-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Confirmation par email</p>
                      <p className="text-xs text-gray-500">
                        Envoyée à {sessionData?.customer.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-1 mt-1">
                      <Package className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Préparation</p>
                      <p className="text-xs text-gray-500">
                        Votre commande va être préparée dans les 24h
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 rounded-full p-1 mt-1">
                      <Truck className="h-3 w-3 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Expédition</p>
                      <p className="text-xs text-gray-500">
                        Suivi par email avec numéro de tracking
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Impact environnemental */}
            <Card className="bg-terra-green/5 border-terra-green/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-terra-green">
                  <TreePine className="h-5 w-5" />
                  Votre impact positif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TreePine className="h-4 w-4 text-green-600" />
                    <span className="text-sm">3 arbres plantés pour cette commande</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Recycle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Emballage 100% recyclé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Production éthique certifiée</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/')}
                className="w-full bg-terra-green hover:bg-terra-green/90 "
              >
                <Home className="h-4 w-4 mr-2" />
                Continuer mes achats
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push('/account/orders')}
                className="w-full"
              >
                Voir mes commandes
              </Button>
            </div>
          </div>
        </div>

        {/* Support */}
        <Card className="mt-8">
          <CardContent className="text-center p-6">
            <h3 className="font-medium mb-2">Besoin d'aide ?</h3>
            <p className="text-sm text-gray-600 mb-4">Notre équipe est là pour vous accompagner</p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </Button>
              <Button variant="outline" size="sm">
                FAQ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CheckoutSuccessClient
