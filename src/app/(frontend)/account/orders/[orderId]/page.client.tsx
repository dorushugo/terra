'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from '@/providers/AccountProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  Truck,
  Download,
  Mail,
} from 'lucide-react'
import Image from 'next/image'
import { getMediaUrl } from '@/utilities/getMediaUrl'

interface OrderDetailPageClientProps {
  orderId: string
}

interface OrderItem {
  id: string
  product: {
    id: string
    title: string
    price: number
    images?: Array<{
      image: {
        url: string
        updatedAt: string
      }
      alt?: string
    }>
  }
  size: string
  color: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  customer: {
    email: string
    firstName: string
    lastName: string
  }
  amount: {
    subtotal: number
    total: number
    shippingCost: number
  }
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    postalCode: string
    country: string
  }
  paymentInfo: {
    method: string
    status: string
    transactionId: string
    paidAt: string
  }
  createdAt: string
  updatedAt: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'processing':
      return 'bg-purple-100 text-purple-800'
    case 'shipped':
      return 'bg-orange-100 text-orange-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />
    case 'confirmed':
      return <CheckCircle className="h-4 w-4" />
    case 'processing':
      return <Package className="h-4 w-4" />
    case 'shipped':
      return <Truck className="h-4 w-4" />
    case 'delivered':
      return <CheckCircle className="h-4 w-4" />
    case 'cancelled':
      return <AlertCircle className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'En attente'
    case 'confirmed':
      return 'Confirmée'
    case 'processing':
      return 'En préparation'
    case 'shipped':
      return 'Expédiée'
    case 'delivered':
      return 'Livrée'
    case 'cancelled':
      return 'Annulée'
    default:
      return status
  }
}

const OrderDetailPageClient: React.FC<OrderDetailPageClientProps> = ({ orderId }) => {
  const router = useRouter()
  const { state } = useAccount()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Rediriger si pas connecté
    if (!state.isLoading && !state.isAuthenticated) {
      router.push('/account')
      return
    }

    if (state.isAuthenticated && orderId) {
      fetchOrderDetail()
    }
  }, [state.isAuthenticated, state.isLoading, orderId, router])

  const fetchOrderDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/account/orders/${orderId}`)

      if (!response.ok) {
        if (response.status === 404) {
          setError('Commande non trouvée')
        } else {
          setError('Erreur lors de la récupération de la commande')
        }
        return
      }

      const data = await response.json()
      setOrder(data.order)
    } catch (error) {
      console.error('Erreur:', error)
      setError('Impossible de récupérer les détails de la commande')
    } finally {
      setLoading(false)
    }
  }

  if (state.isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-terra-green" />
          <p className="text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-x-2">
            <Button onClick={() => router.push('/account/orders')} variant="outline">
              Retour aux commandes
            </Button>
            <Button onClick={fetchOrderDetail}>Réessayer</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/account/orders')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux commandes
          </Button>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-terra-display">
                  Commande #{order.orderNumber}
                </h1>
                <p className="text-gray-600">
                  Passée le{' '}
                  {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {getStatusLabel(order.status)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Articles commandés */}
            <Card>
              <CardHeader>
                <CardTitle>Articles commandés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    {item.product.images?.[0]?.image && (
                      <div className="w-20 h-20 bg-white rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={getMediaUrl(
                            item.product.images[0].image.url,
                            item.product.images[0].image.updatedAt,
                          )}
                          alt={item.product.images[0].alt || item.product.title || ''}
                          width={80}
                          height={80}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.title}</h4>
                      <p className="text-sm text-gray-500">
                        Taille {item.size} • {item.color}
                      </p>
                      <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(item.price * item.quantity).toFixed(2)}€</p>
                      <p className="text-sm text-gray-500">
                        {item.price.toFixed(2)}€ × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Informations de livraison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Adresse de livraison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                  <p>
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Résumé de la commande */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{order.amount.subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Livraison</span>
                    <span>
                      {order.amount.shippingCost === 0
                        ? 'Gratuite'
                        : `${order.amount.shippingCost.toFixed(2)}€`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{order.amount.total.toFixed(2)}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations de paiement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Méthode</span>
                  <span className="text-sm font-medium capitalize">{order.paymentInfo.method}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Statut</span>
                  <Badge variant={order.paymentInfo.status === 'paid' ? 'default' : 'secondary'}>
                    {order.paymentInfo.status === 'paid' ? 'Payé' : order.paymentInfo.status}
                  </Badge>
                </div>
                {order.paymentInfo.paidAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Date</span>
                    <span className="text-sm">
                      {new Date(order.paymentInfo.paidAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
                {order.paymentInfo.transactionId && (
                  <div className="text-xs text-gray-500">ID: {order.paymentInfo.transactionId}</div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger la facture
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Mail className="h-4 w-4 mr-2" />
                  Contacter le support
                </Button>
                {order.status === 'delivered' && (
                  <Button className="w-full bg-terra-green">
                    <Package className="h-4 w-4 mr-2" />
                    Racheter ces articles
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPageClient
