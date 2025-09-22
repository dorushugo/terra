'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  AlertTriangle,
  Package,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Eye,
  Plus,
  Download,
} from 'lucide-react'

interface StockStats {
  totalProducts: number
  lowStockProducts: number
  outOfStockProducts: number
  totalStock: number
  stockValue: number
  recentMovements: number
  pendingAlerts: number
}

interface StockAlert {
  id: string
  alertType: string
  priority: string
  product: {
    title: string
    id: string
  }
  size: string
  currentStock: number
  threshold: number
  message: string
  createdAt: string
}

interface RecentMovement {
  id: string
  type: string
  product: {
    title: string
  }
  size: string
  quantity: number
  reason: string
  date: string
}

const StockManagementDashboard: React.FC = () => {
  const [stats, setStats] = useState<StockStats | null>(null)
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  const [recentMovements, setRecentMovements] = useState<RecentMovement[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)

      // Récupérer les statistiques
      const statsResponse = await fetch('/api/admin/stock-stats')
      const statsData = await statsResponse.json()
      setStats(statsData)

      // Récupérer les alertes actives
      const alertsResponse = await fetch(
        '/api/stock-alerts?where[isResolved][equals]=false&limit=10',
      )
      const alertsData = await alertsResponse.json()
      setAlerts(alertsData.docs || [])

      // Récupérer les mouvements récents
      const movementsResponse = await fetch('/api/stock-movements?sort=-createdAt&limit=10')
      const movementsData = await movementsResponse.json()
      setRecentMovements(movementsData.docs || [])
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-terra-green'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'out_of_stock':
        return '❌'
      case 'low_stock':
        return '⚠️'
      case 'overstock':
        return '📈'
      case 'restock_suggestion':
        return '🔄'
      default:
        return '📦'
    }
  }

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'restock':
        return '📦'
      case 'sale':
        return '🛒'
      case 'return':
        return '↩️'
      case 'adjustment':
        return '🔄'
      case 'loss':
        return '❌'
      default:
        return '📋'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-terra-green" />
        <span className="ml-2 text-lg">Chargement des données de stock...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-terra-display">Gestion des Stocks TERRA</h1>
          <p className="text-gray-600 mt-2">
            Tableau de bord complet pour la gestion des inventaires
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits Total</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">références actives</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Faible</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">produits en alerte</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ruptures</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.outOfStockProducts}</div>
              <p className="text-xs text-muted-foreground">produits épuisés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valeur Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.stockValue.toLocaleString('fr-FR')}€
              </div>
              <p className="text-xs text-muted-foreground">valeur totale estimée</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertes actives */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Alertes Actives
            </CardTitle>
            <CardDescription>Alertes de stock nécessitant une attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-center text-gray-500 py-4">🎉 Aucune alerte active</p>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getAlertIcon(alert.alertType)}</span>
                      <div>
                        <div className="font-medium text-sm">
                          {alert.product.title} - Taille {alert.size}
                        </div>
                        <div className="text-xs text-gray-500">
                          Stock: {alert.currentStock} / Seuil: {alert.threshold}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`${getPriorityColor(alert.priority)} text-white`}
                      >
                        {alert.priority}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {alerts.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  Voir toutes les alertes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mouvements récents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-500" />
              Mouvements Récents
            </CardTitle>
            <CardDescription>Dernières opérations de stock</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMovements.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Aucun mouvement récent</p>
              ) : (
                recentMovements.map((movement) => (
                  <div
                    key={movement.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getMovementIcon(movement.type)}</span>
                      <div>
                        <div className="font-medium text-sm">
                          {movement.product.title} - Taille {movement.size}
                        </div>
                        <div className="text-xs text-gray-500">{movement.reason}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-bold text-sm ${
                          movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {movement.quantity > 0 ? '+' : ''}
                        {movement.quantity}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(movement.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {recentMovements.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  Voir tous les mouvements
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>Outils de gestion des stocks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col gap-2">
              <Plus className="h-6 w-6" />
              <span>Nouveau Mouvement</span>
            </Button>

            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Package className="h-6 w-6" />
              <span>Inventaire</span>
            </Button>

            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Download className="h-6 w-6" />
              <span>Rapport Stock</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StockManagementDashboard
