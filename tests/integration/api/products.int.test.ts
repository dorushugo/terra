import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET as searchProductsHandler } from '@/app/api/search/products/route'
import { TEST_PRODUCTS, TEST_SEARCH_RESULTS } from '../../setup/test-data'

// Mock Payload
const mockPayload = {
  find: vi.fn(),
}

vi.mock('payload', () => ({
  getPayload: vi.fn(() => Promise.resolve(mockPayload)),
}))

vi.mock('@payload-config', () => ({}))

describe('/api/search/products', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/search/products', () => {
    it('returns search results for valid query', async () => {
      mockPayload.find.mockResolvedValue({
        docs: [TEST_PRODUCTS.origin, TEST_PRODUCTS.move],
        totalDocs: 2,
        hasNextPage: false,
        hasPrevPage: false,
        page: 1,
        totalPages: 1,
      })

      const request = new NextRequest('http://localhost:3000/api/search/products?q=terra&limit=10')

      const response = await searchProductsHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.products).toHaveLength(2)
      expect(data.total).toBe(2)
      expect(data.products[0]).toEqual(TEST_PRODUCTS.origin)
      expect(data.products[1]).toEqual(TEST_PRODUCTS.move)
    })

    it('returns empty results for empty query', async () => {
      const request = new NextRequest('http://localhost:3000/api/search/products?q=')

      const response = await searchProductsHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.products).toEqual([])
      expect(data.total).toBe(0)
      expect(mockPayload.find).not.toHaveBeenCalled()
    })

    it('returns empty results for missing query', async () => {
      const request = new NextRequest('http://localhost:3000/api/search/products')

      const response = await searchProductsHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.products).toEqual([])
      expect(data.total).toBe(0)
    })

    it('filters by collection when specified', async () => {
      mockPayload.find.mockResolvedValue({
        docs: [TEST_PRODUCTS.origin],
        totalDocs: 1,
        hasNextPage: false,
        hasPrevPage: false,
        page: 1,
        totalPages: 1,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/search/products?q=terra&collection=origin',
      )

      const response = await searchProductsHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.products).toHaveLength(1)
      expect(data.products[0]).toEqual(TEST_PRODUCTS.origin)

      // Verify collection filter was applied
      expect(mockPayload.find).toHaveBeenCalledWith({
        collection: 'products',
        limit: 10,
        where: expect.objectContaining({
          and: expect.arrayContaining([
            expect.objectContaining({
              collection: {
                equals: 'origin',
              },
            }),
          ]),
        }),
      })
    })

    it('respects limit parameter', async () => {
      mockPayload.find.mockResolvedValue({
        docs: [TEST_PRODUCTS.origin],
        totalDocs: 1,
        hasNextPage: false,
        hasPrevPage: false,
        page: 1,
        totalPages: 1,
      })

      const request = new NextRequest('http://localhost:3000/api/search/products?q=terra&limit=5')

      const response = await searchProductsHandler(request)

      expect(mockPayload.find).toHaveBeenCalledWith({
        collection: 'products',
        limit: 5,
        where: expect.any(Object),
      })
    })

    it('uses default limit when not specified', async () => {
      mockPayload.find.mockResolvedValue({
        docs: [],
        totalDocs: 0,
        hasNextPage: false,
        hasPrevPage: false,
        page: 1,
        totalPages: 1,
      })

      const request = new NextRequest('http://localhost:3000/api/search/products?q=terra')

      const response = await searchProductsHandler(request)

      expect(mockPayload.find).toHaveBeenCalledWith({
        collection: 'products',
        limit: 10, // Default limit
        where: expect.any(Object),
      })
    })

    it('searches across multiple fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/search/products?q=stone')

      await searchProductsHandler(request)

      expect(mockPayload.find).toHaveBeenCalledWith({
        collection: 'products',
        limit: 10,
        where: {
          and: [
            {
              _status: {
                equals: 'published',
              },
            },
            {
              or: [
                {
                  title: {
                    contains: 'stone',
                  },
                },
                {
                  shortDescription: {
                    contains: 'stone',
                  },
                },
                {
                  'colors.name': {
                    contains: 'stone',
                  },
                },
                {
                  'colors.value': {
                    contains: 'stone',
                  },
                },
                {
                  'sustainability.materials.name': {
                    contains: 'stone',
                  },
                },
                {
                  'features.feature': {
                    contains: 'stone',
                  },
                },
              ],
            },
          ],
        },
      })
    })

    it('only returns published products', async () => {
      const request = new NextRequest('http://localhost:3000/api/search/products?q=test')

      await searchProductsHandler(request)

      expect(mockPayload.find).toHaveBeenCalledWith({
        collection: 'products',
        limit: 10,
        where: expect.objectContaining({
          and: expect.arrayContaining([
            {
              _status: {
                equals: 'published',
              },
            },
          ]),
        }),
      })
    })

    it('handles special characters in search query', async () => {
      mockPayload.find.mockResolvedValue({
        docs: [],
        totalDocs: 0,
        hasNextPage: false,
        hasPrevPage: false,
        page: 1,
        totalPages: 1,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/search/products?q=terra%20%26%20co',
      )

      const response = await searchProductsHandler(request)

      expect(response.status).toBe(200)
      expect(mockPayload.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            and: expect.arrayContaining([
              expect.objectContaining({
                or: expect.arrayContaining([
                  {
                    title: {
                      contains: 'terra & co',
                    },
                  },
                ]),
              }),
            ]),
          }),
        }),
      )
    })

    it('handles database errors gracefully', async () => {
      mockPayload.find.mockRejectedValue(new Error('Database connection failed'))

      const request = new NextRequest('http://localhost:3000/api/search/products?q=terra')

      const response = await searchProductsHandler(request)

      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toBe('Erreur interne du serveur')
    })

    it('handles timeout errors', async () => {
      mockPayload.find.mockImplementation(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100)),
      )

      const request = new NextRequest('http://localhost:3000/api/search/products?q=terra')

      const response = await searchProductsHandler(request)

      expect(response.status).toBe(500)
    })

    it('trims whitespace from query', async () => {
      mockPayload.find.mockResolvedValue({
        docs: [],
        totalDocs: 0,
        hasNextPage: false,
        hasPrevPage: false,
        page: 1,
        totalPages: 1,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/search/products?q=%20%20terra%20%20',
      )

      const response = await searchProductsHandler(request)

      expect(response.status).toBe(200)
      expect(mockPayload.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            and: expect.arrayContaining([
              expect.objectContaining({
                or: expect.arrayContaining([
                  {
                    title: {
                      contains: 'terra', // Should be trimmed
                    },
                  },
                ]),
              }),
            ]),
          }),
        }),
      )
    })

    it('handles case insensitive search', async () => {
      mockPayload.find.mockResolvedValue({
        docs: [TEST_PRODUCTS.origin],
        totalDocs: 1,
        hasNextPage: false,
        hasPrevPage: false,
        page: 1,
        totalPages: 1,
      })

      const request = new NextRequest('http://localhost:3000/api/search/products?q=TERRA')

      const response = await searchProductsHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.products).toHaveLength(1)
    })

    it('returns correct pagination info', async () => {
      mockPayload.find.mockResolvedValue({
        docs: [TEST_PRODUCTS.origin],
        totalDocs: 25,
        hasNextPage: true,
        hasPrevPage: false,
        page: 1,
        totalPages: 3,
      })

      const request = new NextRequest('http://localhost:3000/api/search/products?q=terra&limit=10')

      const response = await searchProductsHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.total).toBe(25)
      expect(data.hasNextPage).toBe(true)
      expect(data.hasPrevPage).toBe(false)
      expect(data.page).toBe(1)
      expect(data.totalPages).toBe(3)
    })
  })
})
