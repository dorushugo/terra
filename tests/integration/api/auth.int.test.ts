import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET as authMeHandler } from '@/app/api/auth/me/route'
import { POST as loginHandler } from '@/app/api/auth/login/route'
import { POST as registerHandler } from '@/app/api/auth/register/route'

// Mock Payload
const mockPayload = {
  auth: vi.fn(),
  findByID: vi.fn(),
  find: vi.fn(),
  create: vi.fn(),
  login: vi.fn(),
}

vi.mock('payload', () => ({
  getPayload: vi.fn(() => Promise.resolve(mockPayload)),
}))

vi.mock('@payload-config', () => ({}))

describe('/api/auth/* routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/auth/me', () => {
    it('returns user data when authenticated', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      }

      const mockAddresses = { docs: [] }
      const mockOrders = { docs: [] }

      mockPayload.auth.mockResolvedValue({ user: mockUser })
      mockPayload.findByID.mockResolvedValue(mockUser)
      mockPayload.find
        .mockResolvedValueOnce(mockAddresses) // addresses
        .mockResolvedValueOnce(mockOrders) // orders

      const request = new NextRequest('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
          cookie: 'payload-token=valid-token',
        },
      })

      const response = await authMeHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user).toEqual(mockUser)
      expect(data.addresses).toEqual([])
      expect(data.orders).toEqual([])
    })

    it('returns 401 when no token provided', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/me', {
        method: 'GET',
      })

      const response = await authMeHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Non authentifié')
    })

    it('returns 401 when token is invalid', async () => {
      mockPayload.auth.mockResolvedValue({ user: null })

      const request = new NextRequest('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
          cookie: 'payload-token=invalid-token',
        },
      })

      const response = await authMeHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Token invalide')
    })

    it('handles payload auth errors', async () => {
      mockPayload.auth.mockRejectedValue(new Error('Auth error'))

      const request = new NextRequest('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
          cookie: 'payload-token=valid-token',
        },
      })

      const response = await authMeHandler(request)

      expect(response.status).toBe(500)
    })
  })

  describe('POST /api/auth/login', () => {
    it('successfully logs in user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
      }

      const mockLoginResult = {
        user: mockUser,
        token: 'auth-token',
      }

      mockPayload.login.mockResolvedValue(mockLoginResult)

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user).toEqual(mockUser)
      expect(data.message).toBe('Connexion réussie')

      // Check if cookie is set
      const setCookieHeader = response.headers.get('Set-Cookie')
      expect(setCookieHeader).toContain('payload-token=auth-token')
    })

    it('returns 400 for missing credentials', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          // password missing
        }),
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email et mot de passe requis')
    })

    it('returns 401 for invalid credentials', async () => {
      mockPayload.login.mockRejectedValue(new Error('Invalid credentials'))

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Email ou mot de passe incorrect')
    })

    it('handles malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: 'invalid-json',
      })

      const response = await loginHandler(request)

      expect(response.status).toBe(400)
    })
  })

  describe('POST /api/auth/register', () => {
    it('successfully registers new user', async () => {
      const mockUser = {
        id: '1',
        email: 'newuser@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
      }

      mockPayload.create.mockResolvedValue(mockUser)

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email: 'newuser@example.com',
          password: 'password123',
          firstName: 'Jane',
          lastName: 'Doe',
        }),
      })

      const response = await registerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.user).toEqual(mockUser)
      expect(data.message).toBe('Compte créé avec succès')

      expect(mockPayload.create).toHaveBeenCalledWith({
        collection: 'users',
        data: {
          email: 'newuser@example.com',
          password: 'password123',
          firstName: 'Jane',
          lastName: 'Doe',
          role: 'customer',
        },
      })
    })

    it('returns 400 for missing required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email: 'newuser@example.com',
          // password, firstName, lastName missing
        }),
      })

      const response = await registerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('requis')
    })

    it('returns 400 for invalid email format', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'password123',
          firstName: 'Jane',
          lastName: 'Doe',
        }),
      })

      const response = await registerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('email')
    })

    it('returns 409 for existing user', async () => {
      mockPayload.create.mockRejectedValue({
        message: 'Email already exists',
        status: 409,
      })

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email: 'existing@example.com',
          password: 'password123',
          firstName: 'Jane',
          lastName: 'Doe',
        }),
      })

      const response = await registerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Un compte avec cet email existe déjà')
    })

    it('validates password strength', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email: 'newuser@example.com',
          password: '123', // Too short
          firstName: 'Jane',
          lastName: 'Doe',
        }),
      })

      const response = await registerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('mot de passe')
    })

    it('sanitizes user input', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
      }

      mockPayload.create.mockResolvedValue(mockUser)

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email: '  TEST@EXAMPLE.COM  ',
          password: 'password123',
          firstName: '  Jane  ',
          lastName: '  Doe  ',
        }),
      })

      const response = await registerHandler(request)

      expect(response.status).toBe(201)
      expect(mockPayload.create).toHaveBeenCalledWith({
        collection: 'users',
        data: {
          email: 'test@example.com', // Should be trimmed and lowercased
          password: 'password123',
          firstName: 'Jane', // Should be trimmed
          lastName: 'Doe', // Should be trimmed
          role: 'customer',
        },
      })
    })
  })
})
