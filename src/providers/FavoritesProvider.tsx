'use client'

import React, { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from 'react'
import type { Product } from '@/payload-types'

export interface FavoriteItem {
  id: string
  product: Product
  addedAt: Date
}

interface FavoritesState {
  items: FavoriteItem[]
  isLoading: boolean
}

type FavoritesAction =
  | { type: 'LOAD_FAVORITES'; payload: FavoriteItem[] }
  | { type: 'ADD_FAVORITE'; payload: Product }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'SET_LOADING'; payload: boolean }

interface FavoritesContextType {
  state: FavoritesState
  addToFavorites: (product: Product) => void
  removeFromFavorites: (productId: string | number) => void
  toggleFavorite: (product: Product) => boolean
  clearFavorites: () => void
  isFavorite: (productId: string | number) => boolean
  favoritesCount: number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const FAVORITES_STORAGE_KEY = 'terra-favorites'

function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'LOAD_FAVORITES':
      return { ...state, items: action.payload, isLoading: false }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'ADD_FAVORITE': {
      const product = action.payload
      const favoriteId = product.id.toString()

      // Vérifier si le produit n'est pas déjà en favoris
      const existingIndex = state.items.findIndex((item) => item.id === favoriteId)
      if (existingIndex >= 0) {
        return state // Déjà en favoris
      }

      const newFavorite: FavoriteItem = {
        id: favoriteId,
        product,
        addedAt: new Date(),
      }

      return { ...state, items: [newFavorite, ...state.items] }
    }

    case 'REMOVE_FAVORITE':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.toString()),
      }

    case 'CLEAR_FAVORITES':
      return { ...state, items: [] }

    default:
      return state
  }
}

interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [state, dispatch] = useReducer(favoritesReducer, {
    items: [],
    isLoading: true,
  })

  // Protection contre les ajouts rapides en double
  const lastToggleRef = useRef<{ id: string; timestamp: number } | null>(null)

  // Charger les favoris depuis localStorage au montage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites)
        const items = parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }))
        dispatch({ type: 'LOAD_FAVORITES', payload: items })
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.items))
      } catch (error) {
        console.error('Error saving favorites:', error)
      }
    }
  }, [state.items, state.isLoading])

  // Actions
  const addToFavorites = (product: Product) => {
    dispatch({ type: 'ADD_FAVORITE', payload: product })
  }

  const removeFromFavorites = (productId: string | number) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: productId.toString() })
  }

  const toggleFavorite = (product: Product): boolean => {
    // Protection contre les toggles rapides
    const productId = product.id.toString()
    const now = Date.now()

    if (lastToggleRef.current?.id === productId && now - lastToggleRef.current.timestamp < 300) {
      return isFavorite(product.id) // Retourner l'état actuel
    }

    lastToggleRef.current = { id: productId, timestamp: now }

    const isCurrentlyFavorite = isFavorite(product.id)

    if (isCurrentlyFavorite) {
      removeFromFavorites(product.id)
      return false
    } else {
      addToFavorites(product)
      return true
    }
  }

  const clearFavorites = () => {
    dispatch({ type: 'CLEAR_FAVORITES' })
  }

  // Vérifier si un produit est en favoris
  const isFavorite = (productId: string | number): boolean => {
    return state.items.some((item) => item.id === productId.toString())
  }

  // Calculer le nombre de favoris
  const favoritesCount = state.items.length

  const contextValue: FavoritesContextType = {
    state,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    isFavorite,
    favoritesCount,
  }

  return <FavoritesContext.Provider value={contextValue}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return {
    favorites: context.state.items,
    isLoading: context.state.isLoading,
    addToFavorites: context.addToFavorites,
    removeFromFavorites: context.removeFromFavorites,
    toggleFavorite: context.toggleFavorite,
    clearFavorites: context.clearFavorites,
    isFavorite: context.isFavorite,
    favoritesCount: context.favoritesCount,
  }
}
