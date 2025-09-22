import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createStockAlerts,
  calculateRestockSuggestions,
  updateStockAfterOrder,
} from '@/hooks/stockManagement'

// Mock Payload
const mockPayload = {
  find: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  findByID: vi.fn(),
}

vi.mock('payload', () => ({
  getPayload: vi.fn(() => Promise.resolve(mockPayload)),
}))

vi.mock('@payload-config', () => ({}))

describe('Stock Management', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createStockAlerts', () => {
    it('creates alert for low stock product', async () => {
      const productData = {
        id: 'product-1',
        title: 'TERRA Origin Stone White',
        colors: [
          {
            name: 'Stone White',
            stock: {
              '42': 2, // Low stock
              '43': 10,
            },
          },
        ],
      }

      mockPayload.find.mockResolvedValue({ docs: [] }) // No existing alerts
      mockPayload.create.mockResolvedValue({})

      await createStockAlerts(productData as any)

      expect(mockPayload.create).toHaveBeenCalledWith({
        collection: 'stock-alerts',
        data: {
          product: 'product-1',
          type: 'low_stock',
          message:
            'Stock faible pour TERRA Origin Stone White (Stone White, taille 42): 2 unités restantes',
          threshold: 5,
          currentStock: 2,
          size: '42',
          color: 'Stone White',
          isResolved: false,
          severity: 'high',
        },
      })
    })

    it('creates alert for out of stock product', async () => {
      const productData = {
        id: 'product-1',
        title: 'TERRA Origin Stone White',
        colors: [
          {
            name: 'Stone White',
            stock: {
              '42': 0, // Out of stock
              '43': 5,
            },
          },
        ],
      }

      mockPayload.find.mockResolvedValue({ docs: [] })
      mockPayload.create.mockResolvedValue({})

      await createStockAlerts(productData as any)

      expect(mockPayload.create).toHaveBeenCalledWith({
        collection: 'stock-alerts',
        data: {
          product: 'product-1',
          type: 'out_of_stock',
          message: 'Rupture de stock pour TERRA Origin Stone White (Stone White, taille 42)',
          threshold: 0,
          currentStock: 0,
          size: '42',
          color: 'Stone White',
          isResolved: false,
          severity: 'critical',
        },
      })
    })

    it('does not create duplicate alerts', async () => {
      const productData = {
        id: 'product-1',
        title: 'TERRA Origin Stone White',
        colors: [
          {
            name: 'Stone White',
            stock: {
              '42': 2, // Low stock
            },
          },
        ],
      }

      // Existing alert for the same product/size/color
      mockPayload.find.mockResolvedValue({
        docs: [
          {
            id: 'alert-1',
            product: 'product-1',
            size: '42',
            color: 'Stone White',
            isResolved: false,
          },
        ],
      })

      await createStockAlerts(productData as any)

      expect(mockPayload.create).not.toHaveBeenCalled()
    })

    it('handles products with no stock data', async () => {
      const productData = {
        id: 'product-1',
        title: 'TERRA Origin Stone White',
        colors: [
          {
            name: 'Stone White',
            // No stock property
          },
        ],
      }

      await createStockAlerts(productData as any)

      expect(mockPayload.find).not.toHaveBeenCalled()
      expect(mockPayload.create).not.toHaveBeenCalled()
    })

    it('handles empty colors array', async () => {
      const productData = {
        id: 'product-1',
        title: 'TERRA Origin Stone White',
        colors: [],
      }

      await createStockAlerts(productData as any)

      expect(mockPayload.find).not.toHaveBeenCalled()
      expect(mockPayload.create).not.toHaveBeenCalled()
    })
  })

  describe('calculateRestockSuggestions', () => {
    it('suggests restock for products with low stock', async () => {
      const mockProducts = [
        {
          id: 'product-1',
          title: 'TERRA Origin Stone White',
          collection: 'origin',
          colors: [
            {
              name: 'Stone White',
              stock: {
                '42': 2, // Low stock
                '43': 8,
              },
            },
          ],
        },
      ]

      const mockSalesData = [
        {
          product: 'product-1',
          size: '42',
          color: 'Stone White',
          quantity: 15, // High sales volume
        },
      ]

      mockPayload.find
        .mockResolvedValueOnce({ docs: mockProducts }) // Products
        .mockResolvedValueOnce({ docs: mockSalesData }) // Sales data

      const suggestions = await calculateRestockSuggestions()

      expect(suggestions).toHaveLength(1)
      expect(suggestions[0]).toMatchObject({
        product: 'product-1',
        size: '42',
        color: 'Stone White',
        currentStock: 2,
        suggestedQuantity: expect.any(Number),
        reason: 'low_stock_high_demand',
        priority: 'high',
      })
    })

    it('calculates suggested quantity based on sales velocity', async () => {
      const mockProducts = [
        {
          id: 'product-1',
          title: 'TERRA Origin Stone White',
          colors: [
            {
              name: 'Stone White',
              stock: {
                '42': 3,
              },
            },
          ],
        },
      ]

      const mockSalesData = [
        {
          product: 'product-1',
          size: '42',
          color: 'Stone White',
          quantity: 20, // 20 units sold in last period
        },
      ]

      mockPayload.find
        .mockResolvedValueOnce({ docs: mockProducts })
        .mockResolvedValueOnce({ docs: mockSalesData })

      const suggestions = await calculateRestockSuggestions()

      expect(suggestions[0].suggestedQuantity).toBeGreaterThan(10)
      expect(suggestions[0].suggestedQuantity).toBeLessThan(50)
    })

    it('handles products with no sales data', async () => {
      const mockProducts = [
        {
          id: 'product-1',
          title: 'TERRA Origin Stone White',
          colors: [
            {
              name: 'Stone White',
              stock: {
                '42': 1, // Very low stock
              },
            },
          ],
        },
      ]

      mockPayload.find
        .mockResolvedValueOnce({ docs: mockProducts })
        .mockResolvedValueOnce({ docs: [] }) // No sales data

      const suggestions = await calculateRestockSuggestions()

      expect(suggestions).toHaveLength(1)
      expect(suggestions[0].suggestedQuantity).toBe(10) // Default minimum
      expect(suggestions[0].reason).toBe('low_stock_no_data')
    })

    it('does not suggest restock for products with sufficient stock', async () => {
      const mockProducts = [
        {
          id: 'product-1',
          title: 'TERRA Origin Stone White',
          colors: [
            {
              name: 'Stone White',
              stock: {
                '42': 15, // Sufficient stock
              },
            },
          ],
        },
      ]

      mockPayload.find
        .mockResolvedValueOnce({ docs: mockProducts })
        .mockResolvedValueOnce({ docs: [] })

      const suggestions = await calculateRestockSuggestions()

      expect(suggestions).toHaveLength(0)
    })

    it('prioritizes suggestions correctly', async () => {
      const mockProducts = [
        {
          id: 'product-1',
          title: 'Product 1',
          colors: [
            {
              name: 'Color 1',
              stock: { '42': 0 }, // Out of stock
            },
          ],
        },
        {
          id: 'product-2',
          title: 'Product 2',
          colors: [
            {
              name: 'Color 2',
              stock: { '42': 3 }, // Low stock
            },
          ],
        },
      ]

      const mockSalesData = [
        { product: 'product-1', size: '42', color: 'Color 1', quantity: 10 },
        { product: 'product-2', size: '42', color: 'Color 2', quantity: 5 },
      ]

      mockPayload.find
        .mockResolvedValueOnce({ docs: mockProducts })
        .mockResolvedValueOnce({ docs: mockSalesData })

      const suggestions = await calculateRestockSuggestions()

      expect(suggestions).toHaveLength(2)
      expect(suggestions[0].priority).toBe('critical') // Out of stock first
      expect(suggestions[1].priority).toBe('high') // Low stock second
    })
  })

  describe('updateStockAfterOrder', () => {
    it('decreases stock after successful order', async () => {
      const orderData = {
        id: 'order-1',
        status: 'paid',
        items: [
          {
            product: {
              id: 'product-1',
              colors: [
                {
                  name: 'Stone White',
                  stock: {
                    '42': 10,
                    '43': 5,
                  },
                },
              ],
            },
            quantity: 2,
            size: '42',
            color: 'Stone White',
          },
        ],
      }

      mockPayload.findByID.mockResolvedValue(orderData.items[0].product)
      mockPayload.update.mockResolvedValue({})
      mockPayload.create.mockResolvedValue({})

      await updateStockAfterOrder(orderData as any)

      expect(mockPayload.update).toHaveBeenCalledWith({
        collection: 'products',
        id: 'product-1',
        data: {
          colors: [
            {
              name: 'Stone White',
              stock: {
                '42': 8, // Decreased by 2
                '43': 5,
              },
            },
          ],
        },
      })
    })

    it('creates stock movement record', async () => {
      const orderData = {
        id: 'order-1',
        orderNumber: 'TER-2024-001',
        status: 'paid',
        items: [
          {
            product: {
              id: 'product-1',
              title: 'TERRA Origin Stone White',
              colors: [
                {
                  name: 'Stone White',
                  stock: { '42': 10 },
                },
              ],
            },
            quantity: 1,
            size: '42',
            color: 'Stone White',
          },
        ],
      }

      mockPayload.findByID.mockResolvedValue(orderData.items[0].product)
      mockPayload.update.mockResolvedValue({})
      mockPayload.create.mockResolvedValue({})

      await updateStockAfterOrder(orderData as any)

      expect(mockPayload.create).toHaveBeenCalledWith({
        collection: 'stock-movements',
        data: {
          product: 'product-1',
          type: 'sale',
          quantity: -1,
          size: '42',
          color: 'Stone White',
          reason: 'Vente commande TER-2024-001',
          previousStock: 10,
          newStock: 9,
        },
      })
    })

    it('does not update stock for pending orders', async () => {
      const orderData = {
        id: 'order-1',
        status: 'pending', // Not paid yet
        items: [
          {
            product: { id: 'product-1' },
            quantity: 1,
            size: '42',
            color: 'Stone White',
          },
        ],
      }

      await updateStockAfterOrder(orderData as any)

      expect(mockPayload.update).not.toHaveBeenCalled()
      expect(mockPayload.create).not.toHaveBeenCalled()
    })

    it('handles insufficient stock gracefully', async () => {
      const orderData = {
        id: 'order-1',
        status: 'paid',
        items: [
          {
            product: {
              id: 'product-1',
              colors: [
                {
                  name: 'Stone White',
                  stock: { '42': 1 }, // Only 1 in stock
                },
              ],
            },
            quantity: 3, // Trying to order 3
            size: '42',
            color: 'Stone White',
          },
        ],
      }

      mockPayload.findByID.mockResolvedValue(orderData.items[0].product)

      await expect(updateStockAfterOrder(orderData as any)).rejects.toThrow('Stock insuffisant')
    })

    it('handles multiple items in order', async () => {
      const orderData = {
        id: 'order-1',
        status: 'paid',
        items: [
          {
            product: {
              id: 'product-1',
              colors: [{ name: 'White', stock: { '42': 10 } }],
            },
            quantity: 1,
            size: '42',
            color: 'White',
          },
          {
            product: {
              id: 'product-2',
              colors: [{ name: 'Black', stock: { '43': 5 } }],
            },
            quantity: 2,
            size: '43',
            color: 'Black',
          },
        ],
      }

      mockPayload.findByID
        .mockResolvedValueOnce(orderData.items[0].product)
        .mockResolvedValueOnce(orderData.items[1].product)
      mockPayload.update.mockResolvedValue({})
      mockPayload.create.mockResolvedValue({})

      await updateStockAfterOrder(orderData as any)

      expect(mockPayload.update).toHaveBeenCalledTimes(2)
      expect(mockPayload.create).toHaveBeenCalledTimes(2)
    })
  })
})
