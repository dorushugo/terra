'use client'

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  dateOfBirth?: string
  avatar?: string
  createdAt: Date
  preferences: {
    newsletter: boolean
    smsNotifications: boolean
    emailNotifications: boolean
    language: 'fr' | 'en'
    currency: 'EUR' | 'USD'
  }
}

export interface Address {
  id: string
  type: 'billing' | 'shipping'
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
}

export interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: Array<{
    id: string
    productId: string
    productTitle: string
    size: string
    color: string
    quantity: number
    price: number
    image?: string
  }>
  totalAmount: number
  shippingAddress: Address
  billingAddress: Address
  createdAt: Date
  updatedAt: Date
  trackingNumber?: string
}

interface AccountState {
  user: User | null
  addresses: Address[]
  orders: Order[]
  isLoading: boolean
  isAuthenticated: boolean
}

type AccountAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_ADDRESSES'; payload: Address[] }
  | { type: 'ADD_ADDRESS'; payload: Address }
  | { type: 'UPDATE_ADDRESS'; payload: { id: string; address: Partial<Address> } }
  | { type: 'REMOVE_ADDRESS'; payload: string }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGOUT' }

interface AccountContextType {
  state: AccountState
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (userData: Partial<User> & { email: string; password: string }) => Promise<boolean>
  updateProfile: (userData: Partial<User>) => Promise<boolean>
  addAddress: (address: Omit<Address, 'id'>) => void
  updateAddress: (id: string, address: Partial<Address>) => void
  removeAddress: (id: string) => void
  setDefaultAddress: (id: string, type: 'billing' | 'shipping') => void
  refreshOrders: () => Promise<void>
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

const ACCOUNT_STORAGE_KEY = 'terra-account'

function accountReducer(state: AccountState, action: AccountAction): AccountState {
  switch (action.type) {
    case 'SET_USER':
      console.log('🔄 AccountReducer - SET_USER:', {
        hasUser: !!action.payload,
        email: action.payload?.email,
        isAuthenticated: action.payload !== null,
      })
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
        isLoading: false,
      }

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }

    case 'SET_ADDRESSES':
      return { ...state, addresses: action.payload }

    case 'ADD_ADDRESS':
      return { ...state, addresses: [...state.addresses, action.payload] }

    case 'UPDATE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.map((addr) =>
          addr.id === action.payload.id ? { ...addr, ...action.payload.address } : addr,
        ),
      }

    case 'REMOVE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.filter((addr) => addr.id !== action.payload),
      }

    case 'SET_ORDERS':
      return { ...state, orders: action.payload }

    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] }

    case 'SET_LOADING':
      console.log('🔄 AccountReducer - SET_LOADING:', action.payload)
      return { ...state, isLoading: action.payload }

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        addresses: [],
        orders: [],
        isAuthenticated: false,
        isLoading: false,
      }

    default:
      return state
  }
}

interface AccountProviderProps {
  children: ReactNode
}

export function AccountProvider({ children }: AccountProviderProps) {
  const [state, dispatch] = useReducer(accountReducer, {
    user: null,
    addresses: [],
    orders: [],
    isLoading: true,
    isAuthenticated: false,
  })

  // Charger les données utilisateur depuis l'API au montage
  useEffect(() => {
    const loadUserData = async () => {
      console.log('🔄 AccountProvider - Chargement des données utilisateur...')
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        })

        console.log('🔍 AccountProvider - Réponse /api/auth/me:', response.status, response.ok)

        if (response.ok) {
          const data = await response.json()
          console.log('✅ AccountProvider - Utilisateur connecté:', data.user.email)
          dispatch({
            type: 'SET_USER',
            payload: {
              ...data.user,
              createdAt: new Date(data.user.createdAt),
            },
          })
          dispatch({ type: 'SET_ADDRESSES', payload: data.addresses || [] })
          dispatch({
            type: 'SET_ORDERS',
            payload: (data.orders || []).map((order: any) => ({
              id: order.id,
              orderNumber: order.orderNumber,
              status: order.status,
              items: order.items.map((item: any) => ({
                id: item.id,
                productId: typeof item.product === 'object' ? item.product.id : item.product,
                productTitle: typeof item.product === 'object' ? item.product.title : 'Produit',
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                price: item.unitPrice,
                image:
                  typeof item.product === 'object' && item.product.images?.[0]
                    ? typeof item.product.images[0].image === 'object'
                      ? getMediaUrl(item.product.images[0].image.url, item.product.images[0].image.updatedAt)
                      : ''
                    : '',
              })),
              totalAmount: order.pricing?.total || 0,
              shippingAddress: {
                id: '1',
                type: 'shipping' as const,
                firstName: order.customer?.firstName || '',
                lastName: order.customer?.lastName || '',
                address1: order.shippingAddress?.street || '',
                city: order.shippingAddress?.city || '',
                postalCode: order.shippingAddress?.postalCode || '',
                country: order.shippingAddress?.country || 'FR',
                isDefault: true,
              },
              billingAddress: {
                id: '2',
                type: 'billing' as const,
                firstName: order.customer?.firstName || '',
                lastName: order.customer?.lastName || '',
                address1: order.shippingAddress?.street || '',
                city: order.shippingAddress?.city || '',
                postalCode: order.shippingAddress?.postalCode || '',
                country: order.shippingAddress?.country || 'FR',
                isDefault: true,
              },
              createdAt: new Date(order.createdAt),
              updatedAt: new Date(order.updatedAt),
              trackingNumber: order.tracking?.trackingNumber,
            })),
          })
        } else {
          // Utilisateur non connecté
          console.log('❌ AccountProvider - Utilisateur non connecté')
          dispatch({ type: 'SET_USER', payload: null })
        }
      } catch (error) {
        console.error('❌ AccountProvider - Erreur chargement:', error)
      } finally {
        console.log('🏁 AccountProvider - Fin du chargement')
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    loadUserData()
  }, [])

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    if (!state.isLoading && state.isAuthenticated) {
      try {
        localStorage.setItem(
          ACCOUNT_STORAGE_KEY,
          JSON.stringify({
            user: state.user,
            addresses: state.addresses,
            orders: state.orders,
          }),
        )
      } catch (error) {
        console.error('Error saving account data:', error)
      }
    }
  }, [state.user, state.addresses, state.orders, state.isLoading, state.isAuthenticated])

  // Actions
  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      console.log('🔄 AccountProvider - Tentative de connexion:', email)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log('🔍 AccountProvider - Réponse connexion:', { status: response.status, data })

      if (response.ok && data.success) {
        console.log('✅ AccountProvider - Connexion réussie')
        dispatch({
          type: 'SET_USER',
          payload: {
            ...data.user,
            createdAt: new Date(data.user.createdAt),
          },
        })

        // Recharger les données complètes
        const meResponse = await fetch('/api/auth/me', {
          credentials: 'include',
        })

        if (meResponse.ok) {
          const meData = await meResponse.json()
          dispatch({ type: 'SET_ADDRESSES', payload: meData.addresses || [] })
          dispatch({
            type: 'SET_ORDERS',
            payload: (meData.orders || []).map((order: any) => ({
              id: order.id,
              orderNumber: order.orderNumber,
              status: order.status,
              items: order.items.map((item: any) => ({
                id: item.id,
                productId: typeof item.product === 'object' ? item.product.id : item.product,
                productTitle: typeof item.product === 'object' ? item.product.title : 'Produit',
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                price: item.unitPrice,
              })),
              totalAmount: order.pricing?.total || 0,
              shippingAddress: {} as Address,
              billingAddress: {} as Address,
              createdAt: new Date(order.createdAt),
              updatedAt: new Date(order.updatedAt),
              trackingNumber: order.tracking?.trackingNumber,
            })),
          })
        }

        return true
      } else {
        console.log('❌ AccountProvider - Échec connexion:', data.error || 'Erreur inconnue')
        dispatch({ type: 'SET_LOADING', payload: false })
        // Lancer une erreur avec le message du serveur pour que le composant puisse l'afficher
        throw new Error(data.error || 'Email ou mot de passe incorrect')
      }
    } catch (error: any) {
      console.error('❌ AccountProvider - Erreur connexion:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
      // Re-lancer l'erreur pour que le composant puisse la gérer
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem(ACCOUNT_STORAGE_KEY)
      dispatch({ type: 'LOGOUT' })
    }
  }

  const register = async (
    userData: Partial<User> & { email: string; password: string },
  ): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      console.log("🔄 AccountProvider - Tentative d'inscription:", userData.email)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
        }),
      })

      const data = await response.json()
      console.log('🔍 AccountProvider - Réponse inscription:', { status: response.status, data })

      if (response.ok && data.success) {
        console.log('✅ AccountProvider - Inscription réussie')
        dispatch({
          type: 'SET_USER',
          payload: {
            ...data.user,
            createdAt: new Date(data.user.createdAt),
          },
        })
        return true
      } else {
        console.log('❌ AccountProvider - Échec inscription:', data.error || 'Erreur inconnue')
        dispatch({ type: 'SET_LOADING', payload: false })
        // Lancer une erreur avec le message du serveur pour que le composant puisse l'afficher
        throw new Error(data.error || 'Erreur lors de la création du compte')
      }
    } catch (error) {
      console.error('❌ AccountProvider - Erreur inscription:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
      // Re-lancer l'erreur pour que le composant puisse la gérer
      throw error
    }
  }

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      // Simulation d'une API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      dispatch({ type: 'UPDATE_USER', payload: userData })
      return true
    } catch (error) {
      console.error('Update profile error:', error)
      return false
    }
  }

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
    }
    dispatch({ type: 'ADD_ADDRESS', payload: newAddress })
  }

  const updateAddress = (id: string, address: Partial<Address>) => {
    dispatch({ type: 'UPDATE_ADDRESS', payload: { id, address } })
  }

  const removeAddress = (id: string) => {
    dispatch({ type: 'REMOVE_ADDRESS', payload: id })
  }

  const setDefaultAddress = (id: string, type: 'billing' | 'shipping') => {
    // Retirer le statut default des autres adresses du même type
    const updatedAddresses = state.addresses.map((addr) => ({
      ...addr,
      isDefault: addr.type === type ? addr.id === id : addr.isDefault,
    }))
    dispatch({ type: 'SET_ADDRESSES', payload: updatedAddresses })
  }

  const refreshOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()

        // Mettre à jour les commandes depuis Payload
        dispatch({
          type: 'SET_ORDERS',
          payload: (data.orders || []).map((order: any) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            items: order.items.map((item: any) => ({
              id: item.id,
              productId: typeof item.product === 'object' ? item.product.id : item.product,
              productTitle: typeof item.product === 'object' ? item.product.title : 'Produit',
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              price: item.unitPrice,
            })),
            totalAmount: order.pricing?.total || 0,
            shippingAddress: state.addresses[0] || ({} as Address),
            billingAddress: state.addresses[0] || ({} as Address),
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt),
            trackingNumber: order.tracking?.trackingNumber,
          })),
        })
      }
    } catch (error) {
      console.error('Error refreshing orders:', error)
    }
  }, [state.addresses])

  const contextValue: AccountContextType = useMemo(
    () => ({
      state,
      login,
      logout,
      register,
      updateProfile,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultAddress,
      refreshOrders,
    }),
    [
      state,
      login,
      logout,
      register,
      updateProfile,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultAddress,
      refreshOrders,
    ],
  )

  return <AccountContext.Provider value={contextValue}>{children}</AccountContext.Provider>
}

export function useAccount() {
  const context = useContext(AccountContext)
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider')
  }
  return context
}
