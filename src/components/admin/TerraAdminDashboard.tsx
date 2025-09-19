'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Euro,
} from 'lucide-react'

interface DashboardStats {
  orders: {
    total: number
    pending: number
    confirmed: number
    shipped: number
    delivered: number
    totalRevenue: number
  }
  customers: {
    total: number
    new: number
    returning: number
  }
  inventory: {
    totalProducts: number
    lowStock: number
    outOfStock: number
    totalStock: number
  }
  collections: {
    origin: { sales: number; revenue: number }
    move: { sales: number; revenue: number }
    limited: { sales: number; revenue: number }
  }
}

export const TerraAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler des données pour la démo
    // En production, ces données viendraient de l'API Payload
    setTimeout(() => {
      setStats({
        orders: {
          total: 156,
          pending: 12,
          confirmed: 8,
          shipped: 15,
          delivered: 121,
          totalRevenue: 23450.5,
        },
        customers: {
          total: 89,
          new: 23,
          returning: 66,
        },
        inventory: {
          totalProducts: 12,
          lowStock: 3,
          outOfStock: 1,
          totalStock: 486,
        },
        collections: {
          origin: { sales: 78, revenue: 10842 },
          move: { sales: 45, revenue: 7155 },
          limited: { sales: 33, revenue: 5453.5 },
        },
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-terra-display font-bold text-urban-black mb-2">
          Dashboard TERRA
        </h1>
        <p className="text-gray-600 font-terra-body">
          Vue d'ensemble de votre e-commerce écoresponsable
        </p>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-terra-body font-medium text-gray-600">
              Commandes totales
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-terra-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-terra-display font-bold text-urban-black">
              {stats.orders.total}
            </div>
            <p className="text-xs text-green-600 font-terra-body">+12% ce mois</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-terra-body font-medium text-gray-600">
              Chiffre d'affaires
            </CardTitle>
            <Euro className="h-4 w-4 text-terra-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-terra-display font-bold text-urban-black">
              {stats.orders.totalRevenue.toLocaleString('fr-FR')}€
            </div>
            <p className="text-xs text-green-600 font-terra-body">+18% ce mois</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-terra-body font-medium text-gray-600">
              Clients
            </CardTitle>
            <Users className="h-4 w-4 text-terra-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-terra-display font-bold text-urban-black">
              {stats.customers.total}
            </div>
            <p className="text-xs text-clay-orange font-terra-body">
              {stats.customers.new} nouveaux
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-terra-body font-medium text-gray-600">
              Stock total
            </CardTitle>
            <Package className="h-4 w-4 text-terra-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-terra-display font-bold text-urban-black">
              {stats.inventory.totalStock}
            </div>
            <div className="flex gap-2 mt-1">
              {stats.inventory.lowStock > 0 && (
                <Badge variant="secondary" className="bg-sage-green/20 text-terra-green text-xs">
                  {stats.inventory.lowStock} alertes
                </Badge>
              )}
              {stats.inventory.outOfStock > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {stats.inventory.outOfStock} rupture
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statuts des commandes */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="font-terra-display text-urban-black">
              Statuts des commandes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-sage-green" />
                <span className="font-terra-body text-sm">En attente</span>
              </div>
              <Badge variant="secondary" className="bg-sage-green/20 text-terra-green">
                {stats.orders.pending}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span className="font-terra-body text-sm">Confirmées</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {stats.orders.confirmed}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-clay-orange" />
                <span className="font-terra-body text-sm">Expédiées</span>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                {stats.orders.shipped}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-terra-green" />
                <span className="font-terra-body text-sm">Livrées</span>
              </div>
              <Badge className="bg-terra-green text-white">{stats.orders.delivered}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Performance par collection */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="font-terra-display text-urban-black">
              Performance par collection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-terra-body text-sm font-medium">TERRA Origin</span>
                <span className="text-sm text-gray-600">
                  {stats.collections.origin.sales} ventes •{' '}
                  {stats.collections.origin.revenue.toLocaleString()}€
                </span>
              </div>
              <Progress
                value={(stats.collections.origin.sales / stats.orders.total) * 100}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-terra-body text-sm font-medium">TERRA Move</span>
                <span className="text-sm text-gray-600">
                  {stats.collections.move.sales} ventes •{' '}
                  {stats.collections.move.revenue.toLocaleString()}€
                </span>
              </div>
              <Progress
                value={(stats.collections.move.sales / stats.orders.total) * 100}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-terra-body text-sm font-medium">TERRA Limited</span>
                <span className="text-sm text-gray-600">
                  {stats.collections.limited.sales} ventes •{' '}
                  {stats.collections.limited.revenue.toLocaleString()}€
                </span>
              </div>
              <Progress
                value={(stats.collections.limited.sales / stats.orders.total) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes stock */}
      {(stats.inventory.lowStock > 0 || stats.inventory.outOfStock > 0) && (
        <Card className="border-0 shadow-lg border-l-4 border-l-sage-green">
          <CardHeader>
            <CardTitle className="font-terra-display text-urban-black flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-sage-green" />
              Alertes stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.inventory.lowStock > 0 && (
                <div className="flex items-center justify-between p-3 bg-sage-green/10 rounded-lg">
                  <span className="font-terra-body text-sm">
                    {stats.inventory.lowStock} produit(s) en stock faible
                  </span>
                  <Badge variant="secondary" className="bg-sage-green/20 text-terra-green">
                    Action requise
                  </Badge>
                </div>
              )}
              {stats.inventory.outOfStock > 0 && (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-terra-body text-sm">
                    {stats.inventory.outOfStock} produit(s) en rupture de stock
                  </span>
                  <Badge variant="destructive">Urgent</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions rapides */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="font-terra-display text-urban-black">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-center rounded-lg border-2 border-dashed border-gray-300 hover:border-terra-green hover:bg-terra-green/5 transition-colors">
              <Package className="h-6 w-6 mx-auto mb-2 text-gray-400" />
              <span className="text-sm font-terra-body">Ajouter produit</span>
            </button>
            <button className="p-4 text-center rounded-lg border-2 border-dashed border-gray-300 hover:border-terra-green hover:bg-terra-green/5 transition-colors">
              <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-gray-400" />
              <span className="text-sm font-terra-body">Voir commandes</span>
            </button>
            <button className="p-4 text-center rounded-lg border-2 border-dashed border-gray-300 hover:border-terra-green hover:bg-terra-green/5 transition-colors">
              <Users className="h-6 w-6 mx-auto mb-2 text-gray-400" />
              <span className="text-sm font-terra-body">Gérer clients</span>
            </button>
            <button className="p-4 text-center rounded-lg border-2 border-dashed border-gray-300 hover:border-terra-green hover:bg-terra-green/5 transition-colors">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-gray-400" />
              <span className="text-sm font-terra-body">Analytics</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
