import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Récupérer tous les produits avec leurs stocks
    const products = await payload.find({
      collection: 'products',
      limit: 1000, // Ajuster selon vos besoins
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    let totalProducts = 0
    let lowStockProducts = 0
    let outOfStockProducts = 0
    let totalStock = 0
    let stockValue = 0

    products.docs.forEach((product: any) => {
      totalProducts++

      if (product.sizes && Array.isArray(product.sizes)) {
        product.sizes.forEach((size: any) => {
          const stock = size.stock || 0
          const availableStock = size.availableStock || 0
          const threshold = size.lowStockThreshold || 5

          totalStock += stock
          stockValue += stock * (product.price || 0)

          if (availableStock <= 0) {
            outOfStockProducts++
          } else if (availableStock <= threshold) {
            lowStockProducts++
          }
        })
      }
    })

    // Récupérer les mouvements récents (7 derniers jours)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentMovements = await payload.find({
      collection: 'stock-movements',
      where: {
        createdAt: {
          greater_than: sevenDaysAgo,
        },
      },
    })

    // Récupérer les alertes non résolues
    const pendingAlerts = await payload.find({
      collection: 'stock-alerts',
      where: {
        isResolved: {
          equals: false,
        },
      },
    })

    const stats = {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalStock,
      stockValue: Math.round(stockValue),
      recentMovements: recentMovements.totalDocs,
      pendingAlerts: pendingAlerts.totalDocs,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erreur lors de la récupération des stats de stock:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
