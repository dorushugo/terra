import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// Mock fetch
global.fetch = vi.fn()

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Interface simplifiée pour le compte
interface SimpleAccountState {
  isAuthenticated: boolean
  isLoading: boolean
  user: { id: string; email: string } | null
}

interface SimpleAccountContextType {
  state: SimpleAccountState
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const SimpleAccountContext = createContext<SimpleAccountContextType | undefined>(undefined)

// Reducer simplifié
type SimpleAccountAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: { id: string; email: string } | null }
  | { type: 'LOGOUT' }

function simpleAccountReducer(
  state: SimpleAccountState,
  action: SimpleAccountAction,
): SimpleAccountState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    default:
      return state
  }
}

// Provider simplifié
function SimpleAccountProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(simpleAccountReducer, {
    isAuthenticated: false,
    isLoading: false,
    user: null,
  })

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        dispatch({ type: 'SET_USER', payload: data.user })
        return { success: true }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
        return { success: false, error: data.error }
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      return { success: false, error: 'Network error' }
    }
  }

  const logout = async () => {
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <SimpleAccountContext.Provider value={{ state, login, logout }}>
      {children}
    </SimpleAccountContext.Provider>
  )
}

// Hook simplifié
function useSimpleAccount() {
  const context = useContext(SimpleAccountContext)
  if (!context) {
    throw new Error('useSimpleAccount must be used within SimpleAccountProvider')
  }
  return context
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <SimpleAccountProvider>{children}</SimpleAccountProvider>
)

describe('Simple Account Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    ;(fetch as any).mockClear()
  })

  it('should initialize with unauthenticated state', () => {
    const { result } = renderHook(() => useSimpleAccount(), { wrapper })

    expect(result.current.state.isAuthenticated).toBe(false)
    expect(result.current.state.user).toBeNull()
    expect(result.current.state.isLoading).toBe(false)
  })

  it('should handle successful login', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        user: { id: 'user-1', email: 'test@terra.com' },
      }),
    })

    const { result } = renderHook(() => useSimpleAccount(), { wrapper })

    let loginResult: any
    await act(async () => {
      loginResult = await result.current.login('test@terra.com', 'password123')
    })

    expect(loginResult.success).toBe(true)
    expect(result.current.state.isAuthenticated).toBe(true)
    expect(result.current.state.user?.email).toBe('test@terra.com')
    expect(result.current.state.isLoading).toBe(false)
  })

  it('should handle login failure', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: 'Invalid credentials',
      }),
    })

    const { result } = renderHook(() => useSimpleAccount(), { wrapper })

    let loginResult: any
    await act(async () => {
      loginResult = await result.current.login('test@terra.com', 'wrongpassword')
    })

    expect(loginResult.success).toBe(false)
    expect(loginResult.error).toBe('Invalid credentials')
    expect(result.current.state.isAuthenticated).toBe(false)
    expect(result.current.state.isLoading).toBe(false)
  })

  it('should handle logout', async () => {
    // D'abord se connecter
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        user: { id: 'user-1', email: 'test@terra.com' },
      }),
    })

    const { result } = renderHook(() => useSimpleAccount(), { wrapper })

    await act(async () => {
      await result.current.login('test@terra.com', 'password123')
    })

    expect(result.current.state.isAuthenticated).toBe(true)

    // Puis se déconnecter
    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.state.isAuthenticated).toBe(false)
    expect(result.current.state.user).toBeNull()
  })

  it('should handle network errors', async () => {
    ;(fetch as any).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useSimpleAccount(), { wrapper })

    let loginResult: any
    await act(async () => {
      loginResult = await result.current.login('test@terra.com', 'password123')
    })

    expect(loginResult.success).toBe(false)
    expect(loginResult.error).toBe('Network error')
    expect(result.current.state.isAuthenticated).toBe(false)
  })

  it('should set loading state during login', async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    ;(fetch as any).mockReturnValueOnce(promise)

    const { result } = renderHook(() => useSimpleAccount(), { wrapper })

    // Démarrer le login
    act(() => {
      result.current.login('test@terra.com', 'password123')
    })

    // Vérifier que le loading est activé
    expect(result.current.state.isLoading).toBe(true)

    // Résoudre la promesse
    await act(async () => {
      resolvePromise!({
        ok: true,
        json: async () => ({
          success: true,
          user: { id: 'user-1', email: 'test@terra.com' },
        }),
      })
      await promise
    })

    // Vérifier que le loading est désactivé
    expect(result.current.state.isLoading).toBe(false)
    expect(result.current.state.isAuthenticated).toBe(true)
  })
})
