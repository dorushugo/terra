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
  Eye,
  ArrowLeft,
  Loader2,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import Image from 'next/image'
import { getMediaUrl } from '@/utilities/getMediaUrl'

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

const OrdersPageClient = () => {
  const router = useRouter()
  const { state } = useAccount()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Rediriger si pas connecté
    if (!state.isLoading && !state.isAuthenticated) {
      router.push('/account')
      return
    }

    if (state.isAuthenticated) {
      fetchOrders()
    }
  }, [state.isAuthenticated, state.isLoading, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/account/orders')

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes')
      }

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Erreur:', error)
      setError('Impossible de récupérer vos commandes')
    } finally {
      setLoading(false)
    }
  }

  if (state.isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-terra-green" />
          <p className="text-gray-600">Chargement de vos commandes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchOrders} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/account')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au compte
          </Button>
          <div>
            <h1 className="text-3xl font-bold font-terra-display">Mes commandes</h1>
            <p className="text-gray-600">Consultez l'historique de vos commandes TERRA</p>
          </div>
        </div>

        {/* Liste des commandes */}
        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2">Aucune commande</h3>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas encore passé de commande sur TERRA.
              </p>
              <Button onClick={() => router.push('/products')} className="bg-terra-green">
                Découvrir nos produits
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Commande #{order.orderNumber}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          {order.amount.total.toFixed(2)}€
                        </span>
                      </CardDescription>
                    </div>
                    <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Articles */}
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        {item.product.images?.[0]?.image && (
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
                              {(item.price * item.quantity).toFixed(2)}€
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Adresse de livraison */}
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 text-gray-500" />
                    <div className="text-sm">
                      <p className="font-medium">Adresse de livraison</p>
                      <p className="text-gray-600">
                        {order.shippingAddress.line1}
                        {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
                      </p>
                      <p className="text-gray-600">
                        {order.shippingAddress.postalCode} {order.shippingAddress.city}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/account/orders/${order.id}`)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Voir les détails
                    </Button>
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        Racheter
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPageClient
