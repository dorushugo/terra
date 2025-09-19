import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

interface RestockItem {
  productId: string
  size: string
  quantity: number
  unitCost?: number
  supplierReference?: string
  reason?: string
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    const { items, reason = 'Réapprovisionnement en masse' } = body as {
      items: RestockItem[]
      reason?: string
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Liste d'articles requise" }, { status: 400 })
    }

    const results = []
    let successCount = 0
    let errorCount = 0

    for (const item of items) {
      try {
        // Récupérer le produit
        const product = await payload.findByID({
          collection: 'products',
          id: item.productId,
        })

        if (!product) {
          results.push({
            productId: item.productId,
            size: item.size,
            status: 'error',
            message: 'Produit non trouvé',
          })
          errorCount++
          continue
        }

        // Trouver la taille
        const sizeIndex = product.sizes?.findIndex((s: any) => s.size === item.size)
        if (sizeIndex === -1 || !product.sizes) {
          results.push({
            productId: item.productId,
            size: item.size,
            status: 'error',
            message: 'Taille non trouvée',
          })
          errorCount++
          continue
        }

        const currentStock = product.sizes[sizeIndex].stock || 0
        const newStock = currentStock + item.quantity

        // Mettre à jour le stock
        product.sizes[sizeIndex].stock = newStock

        await payload.update({
          collection: 'products',
          id: item.productId,
          data: {
            sizes: product.sizes,
          },
        })

        // Créer un mouvement de stock
        await payload.create({
          collection: 'stock-movements',
          data: {
            type: 'restock',
            product: item.productId,
            size: item.size,
            quantity: item.quantity,
            stockBefore: currentStock,
            stockAfter: newStock,
            reason: item.reason || reason,
            supplierReference: item.supplierReference,
            unitCost: item.unitCost,
            isAutomated: false,
          },
        })

        results.push({
          productId: item.productId,
          size: item.size,
          status: 'success',
          message: `Stock mis à jour: ${currentStock} → ${newStock}`,
          stockBefore: currentStock,
          stockAfter: newStock,
        })
        successCount++
      } catch (error) {
        console.error(`Erreur pour ${item.productId} taille ${item.size}:`, error)
        results.push({
          productId: item.productId,
          size: item.size,
          status: 'error',
          message: 'Erreur lors de la mise à jour',
        })
        errorCount++
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: items.length,
        success: successCount,
        errors: errorCount,
      },
      results,
    })
  } catch (error) {
    console.error('Erreur lors du réapprovisionnement en masse:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
