'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Loader2, ArrowLeft, CreditCard, Truck, Shield } from 'lucide-react'
import { useCart } from '@/providers/CartProvider'
import { useAccount } from '@/providers/AccountProvider'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { StripePaymentForm } from '@/components/checkout/StripePaymentForm'

// Initialiser Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CustomerInfo {
  email: string
  firstName: string
  lastName: string
  phone: string
}

interface Address {
  line1: string
  line2: string
  city: string
  postalCode: string
  country: string
}

const CheckoutClient = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { cartItems, totalItems, totalPrice, isLoading: cartIsLoading } = useCart()
  const { state } = useAccount()
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  })
  const [shippingAddress, setShippingAddress] = useState<Address>({
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    country: 'FR',
  })
  const [billingAddress, setBillingAddress] = useState<Address>({
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    country: 'FR',
  })
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    // Rediriger si le panier est vide, mais seulement après le chargement
    if (!cartIsLoading && totalItems === 0) {
      router.push('/cart')
    }
  }, [cartIsLoading, totalItems, router])

  useEffect(() => {
    // Pré-remplir avec les données utilisateur si connecté
    if (state.user) {
      setCustomerInfo((prev) => ({
        ...prev,
        email: state.user?.email || '',
        firstName: state.user?.firstName || '',
        lastName: state.user?.lastName || '',
        phone: state.user?.phone || '',
      }))
    }
  }, [state.user])

  const shippingThreshold = 75
  const shippingCost = totalPrice >= shippingThreshold ? 0 : 7.9
  const finalTotal = totalPrice + shippingCost

  const handleCreatePaymentIntent = async () => {
    setLoading(true)

    try {
      // Validation basique
      if (!customerInfo.email || !customerInfo.firstName || !customerInfo.lastName) {
        alert('Veuillez remplir tous les champs obligatoires')
        setLoading(false)
        return
      }

      if (!shippingAddress.line1 || !shippingAddress.city || !shippingAddress.postalCode) {
        alert("Veuillez remplir l'adresse de livraison")
        setLoading(false)
        return
      }

      // Préparer les données pour créer le PaymentIntent
      const paymentData = {
        items: cartItems,
        customerInfo,
        shippingAddress,
      }

      // Créer le PaymentIntent
      const response = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      const { clientSecret, error } = await response.json()

      if (error) {
        alert(error)
        setLoading(false)
        return
      }

      // Définir le clientSecret pour afficher le formulaire Stripe
      setClientSecret(clientSecret)
    } catch (error) {
      console.error('Erreur checkout:', error)
      alert('Erreur lors du checkout')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    // Rediriger vers la page de succès
    router.push('/checkout/success')
  }

  const handlePaymentError = (error: string) => {
    console.error('Erreur de paiement:', error)
    // Optionnel : revenir au formulaire
    // setPaymentStep('form')
  }

  // Mode debug : ajouter un produit test si le panier est vide
  const addTestProduct = () => {
    // Simuler l'ajout d'un produit test (tu peux utiliser le CartProvider)
    console.log('Mode debug : ajout produit test')
  }

  // Afficher le loader pendant le chargement du panier
  if (cartIsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Afficher le message de panier vide seulement après le chargement
  if (totalItems === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Panier vide</CardTitle>
            <CardDescription>Ajoutez des produits pour tester le checkout</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Pour tester le checkout, vous devez d'abord avoir des produits dans votre panier.
            </p>
            <div className="space-y-2">
              <Button onClick={() => router.push('/products')} className="w-full">
                Aller aux produits
              </Button>
              <Button
                onClick={() => router.push('/debug-checkout')}
                variant="outline"
                className="w-full"
              >
                Page de debug Stripe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/cart')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au panier
          </Button>
          <div>
            <h1 className="text-3xl font-bold font-terra-display">Checkout</h1>
            <p className="text-gray-600">Finalisez votre commande TERRA</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="space-y-6">
            {/* Informations client */}
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Vos coordonnées pour la livraison et la facturation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Adresse de livraison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Adresse de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="shippingLine1">Adresse *</Label>
                  <Input
                    id="shippingLine1"
                    value={shippingAddress.line1}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        line1: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="shippingLine2">Complément d'adresse</Label>
                  <Input
                    id="shippingLine2"
                    value={shippingAddress.line2}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        line2: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shippingPostalCode">Code postal *</Label>
                    <Input
                      id="shippingPostalCode"
                      value={shippingAddress.postalCode}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({
                          ...prev,
                          postalCode: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shippingCity">Ville *</Label>
                    <Input
                      id="shippingCity"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formulaire de paiement Stripe intégré */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-black" />
                  Paiement sécurisé
                </CardTitle>
                <CardDescription className="text-black">
                  Complétez votre commande en renseignant vos informations de paiement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!clientSecret ? (
                  <Button
                    onClick={handleCreatePaymentIntent}
                    className="w-full h-12 text-lg bg-terra-green hover:bg-terra-green/90 "
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Préparation du paiement...
                      </>
                    ) : (
                      <>
                        <Shield className="h-5 w-5 mr-2 text-white" />
                        Préparer le paiement
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          variables: {
                            colorPrimary: '#16a34a',
                            colorBackground: '#ffffff',
                            colorText: '#1a1a1a', // urban-black exact
                            colorTextSecondary: '#4a4a4a',
                            colorTextPlaceholder: '#888888',
                            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                            spacingUnit: '4px',
                            borderRadius: '8px',
                            colorDanger: '#dc2626',
                            fontSizeBase: '16px',
                            fontWeightNormal: '400',
                            fontWeightMedium: '500',
                            fontWeightBold: '600',
                            colorIcon: '#6b7280',
                            colorIconTabSelected: '#16a34a',
                            // Forcer d'autres couleurs importantes
                            colorBackgroundText: '#ffffff',
                          },
                          rules: {
                            '.Input': {
                              backgroundColor: '#ffffff',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              padding: '12px 16px',
                              fontSize: '16px',
                              color: '#000000',
                              fontWeight: '400',
                              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                            },
                            '.Input:focus': {
                              borderColor: '#16a34a',
                              boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)',
                              outline: 'none',
                            },
                            '.Input--invalid': {
                              borderColor: '#dc2626',
                            },
                            '.Label': {
                              color: '#374151',
                              fontSize: '14px',
                              fontWeight: '500',
                              marginBottom: '8px',
                            },
                            '.Tab': {
                              backgroundColor: '#f9fafb',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px 8px 0 0',
                              color: '#6b7280',
                              padding: '12px 16px',
                              fontWeight: '500',
                            },
                            '.Tab:hover': {
                              backgroundColor: '#f3f4f6',
                              color: '#374151',
                            },
                            '.Tab--selected': {
                              backgroundColor: '#ffffff',
                              borderColor: '#16a34a',
                              borderBottomColor: '#ffffff',
                              color: '#16a34a',
                              fontWeight: '600',
                            },
                            '.Error': {
                              color: '#dc2626',
                              fontSize: '14px',
                              marginTop: '8px',
                            },
                          },
                        },
                        loader: 'auto',
                      }}
                    >
                      <StripePaymentForm
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        totalAmount={finalTotal}
                        customerInfo={customerInfo}
                        shippingAddress={shippingAddress}
                      />
                    </Elements>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Résumé de commande */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Résumé de votre commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Articles */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      {item.product.images?.[0]?.image &&
                        typeof item.product.images[0].image === 'object' && (
                          <div className="w-16 h-16 bg-white rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={getMediaUrl(
                                item.product.images[0].image.url,
                                item.product.images[0].image.updatedAt,
                              )}
                              alt={item.product.images[0].alt || item.product.title || ''}
                              width={64}
                              height={64}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                        )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.product.title}</h4>
                        <p className="text-xs text-gray-500">
                          Taille {item.size} • {item.color}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs">Qté: {item.quantity}</span>
                          <span className="font-medium text-sm">
                            {((item.product.price || 0) * item.quantity).toFixed(2)}€
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totaux */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{totalPrice.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Livraison</span>
                    <span>
                      {shippingCost === 0 ? (
                        <Badge variant="secondary" className="text-xs">
                          Gratuite
                        </Badge>
                      ) : (
                        `${shippingCost.toFixed(2)}€`
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{finalTotal.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Avantages */}
                <div className="bg-terra-green/5 p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Vos avantages TERRA</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>✓ Livraison gratuite dès 75€</li>
                    <li>✓ Retours gratuits sous 30 jours</li>
                    <li>✓ Garantie satisfaction</li>
                    <li>
                      ✓ {totalItems} arbre{totalItems > 1 ? 's' : ''} planté
                      {totalItems > 1 ? 's' : ''} par commande
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutClient
