import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Récupérer les statistiques des commandes
    const orders = await payload.find({
      collection: 'orders',
      limit: 1000, // Ajuster selon les besoins
    })

    const orderStats = {
      total: orders.docs.length,
      pending: orders.docs.filter((o) => o.status === 'pending').length,
      confirmed: orders.docs.filter((o) => o.status === 'confirmed').length,
      shipped: orders.docs.filter((o) => o.status === 'shipped').length,
      delivered: orders.docs.filter((o) => o.status === 'delivered').length,
      totalRevenue: orders.docs
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, order) => sum + (order.pricing?.total || 0), 0),
    }

    // Récupérer les statistiques des clients
    const customers = await payload.find({
      collection: 'customers',
      limit: 1000,
    })

    const customerStats = {
      total: customers.docs.length,
      new: customers.docs.filter((c) => {
        const createdAt = new Date(c.createdAt)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return createdAt > thirtyDaysAgo
      }).length,
      returning: customers.docs.filter((c) => (c.stats?.totalOrders || 0) > 1).length,
    }

    // Récupérer les statistiques d'inventaire
    const products = await payload.find({
      collection: 'products',
      limit: 1000,
    })

    let totalStock = 0
    let lowStock = 0
    let outOfStock = 0

    products.docs.forEach((product) => {
      if (product.sizes) {
        product.sizes.forEach((size: any) => {
          const available = (size.stock || 0) - (size.reservedStock || 0)
          totalStock += available

          if (available <= 0) {
            outOfStock++
          } else if (available <= (size.lowStockThreshold || 5)) {
            lowStock++
          }
        })
      }
    })

    const inventoryStats = {
      totalProducts: products.docs.length,
      lowStock,
      outOfStock,
      totalStock,
    }

    // Statistiques par collection (simulation)
    const collectionStats = {
      origin: { sales: 78, revenue: 10842 },
      move: { sales: 45, revenue: 7155 },
      limited: { sales: 33, revenue: 5453.5 },
    }

    return NextResponse.json({
      orders: orderStats,
      customers: customerStats,
      inventory: inventoryStats,
      collections: collectionStats,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
  }
}
