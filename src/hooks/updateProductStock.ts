import type { CollectionAfterChangeHook } from 'payload'

export const updateProductStock: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  // Gestion automatique des stocks lors des changements de commande
  if (operation === 'update') {
    try {
      for (const item of doc.items || []) {
        if (typeof item.product === 'string') {
          const product = await req.payload.findByID({
            collection: 'products',
            id: item.product,
          })

          if (product && product.sizes) {
            const sizeIndex = product.sizes.findIndex((s: any) => s.size === item.size)

            if (sizeIndex !== -1) {
              // Ajouter un mouvement de stock dans l'historique
              const stockMovement = {
                date: new Date(),
                type: 'sale' as const,
                size: item.size,
                quantity: -item.quantity, // Négatif pour une vente
                reason: `Commande ${doc.orderNumber}`,
                reference: doc.orderNumber,
              }

              const updatedStockHistory = [...(product.stockHistory || []), stockMovement]

              await req.payload.update({
                collection: 'products',
                id: item.product,
                data: {
                  stockHistory: updatedStockHistory,
                },
              })

              req.payload.logger.info(
                `Stock movement recorded for product ${item.product}, size ${item.size}`,
              )
            }
          }
        }
      }
    } catch (error) {
      req.payload.logger.error(`Error updating product stock: ${error}`)
    }
  }
}

export const addStockMovement = async (
  payload: any,
  productId: string,
  size: string,
  quantity: number,
  type: 'restock' | 'sale' | 'return' | 'adjustment' | 'reservation' | 'release',
  reason?: string,
  reference?: string,
) => {
  try {
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
    })

    if (product) {
      const stockMovement = {
        date: new Date(),
        type,
        size,
        quantity,
        reason: reason || '',
        reference: reference || '',
      }

      const updatedStockHistory = [...(product.stockHistory || []), stockMovement]

      await payload.update({
        collection: 'products',
        id: productId,
        data: {
          stockHistory: updatedStockHistory,
        },
      })

      payload.logger.info(
        `Stock movement added: ${type} ${quantity} for product ${productId}, size ${size}`,
      )
      return true
    }
    return false
  } catch (error) {
    payload.logger.error(`Error adding stock movement: ${error}`)
    return false
  }
}
