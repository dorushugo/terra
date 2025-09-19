'use client'

import React, { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from 'react'
import { toast } from 'sonner'
import type { Product } from '@/payload-types'

export interface CartItem {
  id: string
  product: Product
  size: string
  color: string
  quantity: number
  addedAt: Date
}

interface CartState {
  items: CartItem[]
  isLoading: boolean
}

type CartAction =
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | {
      type: 'ADD_ITEM'
      payload: { product: Product; size: string; color: string; quantity: number }
    }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }

interface CartContextType {
  state: CartState
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isInCart: (productId: string | number, size?: string, color?: string) => boolean
  getItemQuantity: (productId: string | number, size?: string, color?: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'terra-cart'

// Protection contre les doubles ajouts - stockage au niveau module
let lastReducerAction: { key: string; timestamp: number; resultState: CartState | null } | null =
  null

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'LOAD_CART':
      return { ...state, items: action.payload, isLoading: false }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'ADD_ITEM': {
      const { product, size, color, quantity } = action.payload
      const itemKey = `${product.id}-${size}-${color}`
      const now = Date.now()

      // Protection contre les doubles ajouts dans le reducer (React 18 double-render)
      if (
        lastReducerAction?.key === itemKey &&
        now - lastReducerAction.timestamp < 50 &&
        lastReducerAction.resultState
      ) {
        console.log('🛡️ Double ajout bloqué dans le reducer pour:', itemKey)
        return lastReducerAction.resultState // Retourner l'état avec l'item déjà ajouté
      }

      const existingItemIndex = state.items.findIndex(
        (item) => `${item.product.id}-${item.size}-${item.color}` === itemKey,
      )

      console.log('🔍 Recherche item existant pour:', itemKey)
      console.log(
        '🔍 Items dans le panier:',
        state.items.map((item) => `${item.product.id}-${item.size}-${item.color}`),
      )
      console.log('🔍 Index trouvé:', existingItemIndex)

      let resultState: CartState

      if (existingItemIndex >= 0) {
        // Mettre à jour la quantité de l'item existant
        console.log(
          '🔄 Item existant trouvé, ancienne quantité:',
          state.items[existingItemIndex].quantity,
          'ajout de:',
          quantity,
        )
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += quantity
        console.log('🔄 Nouvelle quantité:', updatedItems[existingItemIndex].quantity)
        resultState = { ...state, items: updatedItems }
      } else {
        // Ajouter un nouvel item
        console.log('🆕 Nouvel item ajouté avec quantité:', quantity)
        const newItem: CartItem = {
          id: itemKey,
          product,
          size,
          color,
          quantity,
          addedAt: new Date(),
        }
        resultState = { ...state, items: [newItem, ...state.items] }
      }

      // Sauvegarder l'état résultant pour la protection
      lastReducerAction = { key: itemKey, timestamp: now, resultState }
      return resultState
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        }
      }
      return {
        ...state,
        items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
      }
    }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    default:
      return state
  }
}

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: true,
  })

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsed = JSON.parse(savedCart)
        const items = parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }))
        dispatch({ type: 'LOAD_CART', payload: items })
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items))
      } catch (error) {
        console.error('Error saving cart:', error)
      }
    }
  }, [state.items, state.isLoading])

  // Actions
  const addToCart = (product: Product, size: string, color: string, quantity: number = 1) => {
    const itemKey = `${product.id}-${size}-${color}`
    console.log('➕ Ajout au panier:', itemKey, 'quantité:', quantity)
    dispatch({ type: 'ADD_ITEM', payload: { product, size, color, quantity } })

    // Toast de confirmation
    toast.success(`${product.title} ajouté au panier`, {
      description: `Taille ${size} • ${color}`,
      duration: 3000,
    })
  }

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  // Calculer le nombre total d'articles
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)

  // Calculer le prix total
  const totalPrice = state.items.reduce((sum, item) => {
    return sum + (item.product.price || 0) * item.quantity
  }, 0)

  // Vérifier si un produit est dans le panier
  const isInCart = (productId: string | number, size?: string, color?: string) => {
    if (size && color) {
      const itemKey = `${productId}-${size}-${color}`
      return state.items.some((item) => item.id === itemKey)
    }
    return state.items.some((item) => item.product.id.toString() === productId.toString())
  }

  // Obtenir la quantité d'un produit spécifique dans le panier
  const getItemQuantity = (productId: string | number, size?: string, color?: string) => {
    if (size && color) {
      const itemKey = `${productId}-${size}-${color}`
      const item = state.items.find((item) => item.id === itemKey)
      return item?.quantity || 0
    }
    return state.items
      .filter((item) => item.product.id.toString() === productId.toString())
      .reduce((sum, item) => sum + item.quantity, 0)
  }

  const contextValue: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isInCart,
    getItemQuantity,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return {
    cartItems: context.state.items,
    isLoading: context.state.isLoading,
    addToCart: context.addToCart,
    removeFromCart: context.removeFromCart,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
    totalItems: context.totalItems,
    totalPrice: context.totalPrice,
    isInCart: context.isInCart,
    getItemQuantity: context.getItemQuantity,
  }
}
