'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAccount } from '@/providers/AccountProvider'
import { useCart } from '@/providers/CartProvider'
import { useFavorites } from '@/providers/FavoritesProvider'
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Package,
  CreditCard,
  Bell,
  Edit,
  Plus,
  Truck,
  CheckCircle,
  Clock,
  X,
} from 'lucide-react'

// Composant de connexion
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, state: accountState } = useAccount()
  const router = useRouter()

  // Rediriger si déjà connecté
  useEffect(() => {
    if (accountState?.isAuthenticated && !accountState?.isLoading) {
      router.push('/account')
    }
  }, [accountState, router]) // Changement: surveiller tout l'objet accountState

  // Afficher un état de chargement si on redirige
  if (accountState?.isAuthenticated && !accountState?.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Redirection vers votre compte...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('🔄 LoginForm - Tentative de connexion avec:', email)
      const success = await login(email, password)
      if (!success) {
        setError('Email ou mot de passe incorrect')
      }
    } catch (err: any) {
      console.error('❌ LoginForm - Erreur de connexion:', err)
      const errorMessage = err?.message || 'Une erreur est survenue lors de la connexion'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-terra-display font-bold text-urban-black">
            Connexion à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 font-terra-body">
            Ou{' '}
            <Link href="/register" className="text-terra-green hover:text-terra-green/80">
              créez un nouveau compte
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-terra-green focus:border-terra-green font-terra-body"
                placeholder="Adresse email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-terra-green focus:border-terra-green font-terra-body"
                placeholder="Mot de passe"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="text-sm text-center">
            <p className="text-gray-600 font-terra-body">
              Utilisez <strong>test@terra.com</strong> / <strong>password123</strong> pour tester
            </p>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 bg-terra-green hover:bg-terra-green/90 text-white font-terra-display font-semibold"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </div>

          {/* Lien vers inscription */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600 font-terra-body">
              Pas encore de compte ?{' '}
              <Link
                href="/register"
                className="font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

// Composant principal du compte
export const AccountPageClient: React.FC = () => {
  const { state, logout, refreshOrders } = useAccount()
  const { totalItems } = useCart()
  const { favoritesCount } = useFavorites()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (state.isAuthenticated && state.orders.length === 0) {
      refreshOrders()
    }
  }, [state.isAuthenticated, state.orders.length, refreshOrders])

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terra-green mx-auto"></div>
          <p className="mt-4 text-gray-600 font-terra-body">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!state.isAuthenticated) {
    return <LoginForm />
  }

  const tabs = [
    { id: 'overview', name: "Vue d'ensemble", icon: User },
    { id: 'orders', name: 'Mes commandes', icon: Package },
    { id: 'addresses', name: 'Adresses', icon: MapPin },
    { id: 'preferences', name: 'Préférences', icon: Settings },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-sage-green/20 text-terra-green'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'processing':
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'cancelled':
        return <X className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-terra-display font-bold text-urban-black">
                Bonjour, {state.user?.firstName || 'Utilisateur'}
              </h1>
              <p className="text-gray-600 font-terra-body">Gérez votre compte et vos préférences</p>
            </div>
            <Button onClick={logout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-terra-body transition-colors ${
                    activeTab === tab.id
                      ? 'bg-terra-green text-white hover:bg-terra-green/90 hover:text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-terra-green/10 rounded-lg">
                          <Package className="h-6 w-6 text-terra-green" />
                        </div>
                        <div>
                          <p className="text-2xl font-terra-display font-bold text-urban-black">
                            {state.orders.length}
                          </p>
                          <p className="text-gray-600 font-terra-body text-sm">Commandes</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-lg">
                          <Heart className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-terra-display font-bold text-urban-black">
                            {favoritesCount}
                          </p>
                          <p className="text-gray-600 font-terra-body text-sm">Favoris</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <ShoppingBag className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-terra-display font-bold text-urban-black">
                            {totalItems}
                          </p>
                          <p className="text-gray-600 font-terra-body text-sm">Dans le panier</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-terra-display">Actions rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link href="/favorites">
                      <Button variant="outline" className="w-full justify-start">
                        <Heart className="h-4 w-4 mr-2" />
                        Mes favoris
                      </Button>
                    </Link>
                    <Link href="/cart">
                      <Button variant="outline" className="w-full justify-start">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Mon panier
                      </Button>
                    </Link>
                    <Link href="/account/orders">
                      <Button variant="outline" className="w-full justify-start">
                        <Package className="h-4 w-4 mr-2" />
                        Mes commandes
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('addresses')}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Mes adresses
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('preferences')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Préférences
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-terra-display font-bold text-urban-black">
                    Mes commandes
                  </h2>
                  <Button onClick={refreshOrders} variant="outline" size="sm">
                    Actualiser
                  </Button>
                </div>

                {state.orders.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-terra-display font-semibold text-gray-900 mb-2">
                        Aucune commande
                      </h3>
                      <p className="text-gray-600 font-terra-body mb-4">
                        Vous n'avez pas encore passé de commande
                      </p>
                      <Link href="/products">
                        <Button className="bg-terra-green hover:bg-terra-green/90">
                          Découvrir nos produits
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {state.orders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-terra-display font-semibold text-urban-black">
                                Commande #{order.orderNumber}
                              </h3>
                              <p className="text-gray-600 font-terra-body text-sm">
                                {order.createdAt.toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge className={`${getStatusColor(order.status)} mb-2`}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(order.status)}
                                  {order.status}
                                </span>
                              </Badge>
                              <p className="font-terra-display font-semibold text-urban-black">
                                {order.totalAmount.toFixed(2)}€
                              </p>
                            </div>
                          </div>
                          <div className="border-t pt-4">
                            <p className="text-sm text-gray-600 font-terra-body">
                              {order.items.length} article{order.items.length > 1 ? 's' : ''}
                              {order.trackingNumber && (
                                <span className="ml-4">
                                  Suivi: <span className="font-mono">{order.trackingNumber}</span>
                                </span>
                              )}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-terra-display font-bold text-urban-black">
                    Mes adresses
                  </h2>
                  <Button className="bg-terra-green hover:bg-terra-green/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une adresse
                  </Button>
                </div>

                {state.addresses.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-terra-display font-semibold text-gray-900 mb-2">
                        Aucune adresse enregistrée
                      </h3>
                      <p className="text-gray-600 font-terra-body mb-4">
                        Ajoutez une adresse pour faciliter vos commandes
                      </p>
                      <Button className="bg-terra-green hover:bg-terra-green/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter ma première adresse
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {state.addresses.map((address) => (
                      <Card key={address.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-terra-display font-semibold text-urban-black">
                                {address.firstName} {address.lastName}
                              </h3>
                              <Badge variant="secondary" className="mt-1">
                                {address.type === 'billing' ? 'Facturation' : 'Livraison'}
                              </Badge>
                              {address.isDefault && (
                                <Badge className="ml-2 bg-terra-green">Par défaut</Badge>
                              )}
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-gray-600 font-terra-body text-sm space-y-1">
                            <p>{address.address1}</p>
                            {address.address2 && <p>{address.address2}</p>}
                            <p>
                              {address.postalCode} {address.city}
                            </p>
                            <p>{address.country}</p>
                            {address.phone && <p>{address.phone}</p>}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-terra-display font-bold text-urban-black">
                  Préférences
                </h2>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-terra-display">Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-terra-body mb-1">
                          Prénom
                        </label>
                        <p className="text-urban-black font-terra-body">{state.user?.firstName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-terra-body mb-1">
                          Nom
                        </label>
                        <p className="text-urban-black font-terra-body">{state.user?.lastName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-terra-body mb-1">
                          Email
                        </label>
                        <p className="text-urban-black font-terra-body">{state.user?.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 font-terra-body mb-1">
                          Téléphone
                        </label>
                        <p className="text-urban-black font-terra-body">
                          {state.user?.phone || 'Non renseigné'}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier mes informations
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-terra-display">Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-terra-body font-medium">Newsletter</p>
                        <p className="text-sm text-gray-600 font-terra-body">
                          Recevez nos dernières nouveautés et offres
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={state.user?.preferences.newsletter}
                        className="h-4 w-4 text-terra-green focus:ring-terra-green border-gray-300 rounded"
                        readOnly
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-terra-body font-medium">Notifications email</p>
                        <p className="text-sm text-gray-600 font-terra-body">
                          Notifications de commandes et de livraison
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={state.user?.preferences.emailNotifications}
                        className="h-4 w-4 text-terra-green focus:ring-terra-green border-gray-300 rounded"
                        readOnly
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-terra-body font-medium">SMS</p>
                        <p className="text-sm text-gray-600 font-terra-body">
                          Notifications SMS pour les livraisons
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={state.user?.preferences.smsNotifications}
                        className="h-4 w-4 text-terra-green focus:ring-terra-green border-gray-300 rounded"
                        readOnly
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
