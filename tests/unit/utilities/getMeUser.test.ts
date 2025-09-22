import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getMeUser } from '@/utilities/getMeUser'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getClientSideURL } from '@/utilities/getURL'

// Mock dependencies
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('@/utilities/getURL', () => ({
  getClientSideURL: vi.fn(() => 'http://localhost:3000'),
}))

// Mock fetch
global.fetch = vi.fn()

const mockCookies = {
  get: vi.fn(),
}

describe('getMeUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(cookies as any).mockResolvedValue(mockCookies)
    mockCookies.get.mockReturnValue({ value: 'mock-token' })
  })

  it('returns user and token when authenticated', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: mockUser }),
    })

    const result = await getMeUser()

    expect(result).toEqual({
      token: 'mock-token',
      user: mockUser,
    })

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/users/me', {
      headers: {
        Authorization: 'JWT mock-token',
      },
    })
  })

  it('handles missing token', async () => {
    mockCookies.get.mockReturnValue(undefined)
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ user: null }),
    })

    const result = await getMeUser()

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/users/me', {
      headers: {
        Authorization: 'JWT undefined',
      },
    })

    expect(result.token).toBe(undefined)
  })

  it('redirects when nullUserRedirect is provided and user is null', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ user: null }),
    })

    await expect(getMeUser({ nullUserRedirect: '/login' })).rejects.toThrow()

    expect(redirect).toHaveBeenCalledWith('/login')
  })

  it('redirects when validUserRedirect is provided and user exists', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: mockUser }),
    })

    await expect(getMeUser({ validUserRedirect: '/dashboard' })).rejects.toThrow()

    expect(redirect).toHaveBeenCalledWith('/dashboard')
  })

  it('does not redirect when user is null and no nullUserRedirect', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ user: null }),
    })

    const result = await getMeUser()

    expect(redirect).not.toHaveBeenCalled()
    expect(result.user).toBeNull()
  })

  it('does not redirect when user exists and no validUserRedirect', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: mockUser }),
    })

    const result = await getMeUser()

    expect(redirect).not.toHaveBeenCalled()
    expect(result.user).toEqual(mockUser)
  })

  it('handles API error gracefully', async () => {
    ;(global.fetch as any).mockRejectedValueOnce(new Error('API Error'))

    await expect(getMeUser()).rejects.toThrow('API Error')
  })

  it('handles invalid JSON response', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON')),
    })

    await expect(getMeUser()).rejects.toThrow('Invalid JSON')
  })

  it('uses correct client URL', async () => {
    ;(getClientSideURL as any).mockReturnValue('https://example.com')
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: null }),
    })

    await getMeUser()

    expect(fetch).toHaveBeenCalledWith('https://example.com/api/users/me', {
      headers: {
        Authorization: 'JWT mock-token',
      },
    })
  })

  it('handles both redirect conditions correctly', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: mockUser }),
    })

    await expect(
      getMeUser({
        nullUserRedirect: '/login',
        validUserRedirect: '/dashboard',
      }),
    ).rejects.toThrow()

    // Should redirect to validUserRedirect since user exists
    expect(redirect).toHaveBeenCalledWith('/dashboard')
    expect(redirect).not.toHaveBeenCalledWith('/login')
  })

  it('prioritizes nullUserRedirect when user is null', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ user: null }),
    })

    await expect(
      getMeUser({
        nullUserRedirect: '/login',
        validUserRedirect: '/dashboard',
      }),
    ).rejects.toThrow()

    // Should redirect to nullUserRedirect since user is null
    expect(redirect).toHaveBeenCalledWith('/login')
    expect(redirect).not.toHaveBeenCalledWith('/dashboard')
  })

  it('handles empty token gracefully', async () => {
    mockCookies.get.mockReturnValue({ value: '' })
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ user: null }),
    })

    const result = await getMeUser()

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/users/me', {
      headers: {
        Authorization: 'JWT ',
      },
    })

    expect(result.token).toBe('')
  })

  it('handles network timeout', async () => {
    ;(global.fetch as any).mockImplementationOnce(
      () => new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), 100)),
    )

    await expect(getMeUser()).rejects.toThrow('Network timeout')
  })

  it('handles malformed user data', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: 'invalid-user-data' }),
    })

    const result = await getMeUser()

    expect(result.user).toBe('invalid-user-data')
    expect(result.token).toBe('mock-token')
  })
})
