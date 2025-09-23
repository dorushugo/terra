import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Fonctions utilitaires pour la mise à jour directe du stock
 * sans déclencher les hooks problématiques
 */

/**
 * Réserver du stock directement (sans hooks)
 */
export async function reserveStockDirect(
  productId: string,
  size: string,
  quantity: number,
): Promise<boolean> {
  try {
    const payload = await getPayload({ config })

    // Récupérer le produit
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
    })

    if (!product || !product.sizes) {
      console.error(`Produit ${productId} non trouvé ou sans tailles`)
      return false
    }

    const sizeIndex = product.sizes.findIndex((s: any) => s.size === size)
    if (sizeIndex === -1) {
      console.error(`Taille ${size} non trouvée pour le produit ${productId}`)
      return false
    }

    const sizeData = product.sizes[sizeIndex]
    const availableStock = (sizeData.stock || 0) - (sizeData.reservedStock || 0)

    if (availableStock < quantity) {
      console.error(`Stock insuffisant: ${availableStock} < ${quantity}`)
      return false
    }

    // Réserver le stock et recalculer availableStock
    const currentReserved = sizeData.reservedStock || 0
    const newReserved = currentReserved + quantity
    const currentStock = sizeData.stock || 0
    product.sizes[sizeIndex].reservedStock = newReserved
    product.sizes[sizeIndex].availableStock = Math.max(0, currentStock - newReserved)

    // Mise à jour directe
    await payload.update({
      collection: 'products',
      id: productId,
      data: {
        sizes: product.sizes,
      },
      context: { skipStockAlerts: true },
    })

    console.log(`✅ Stock réservé directement: ${productId} taille ${size} (${quantity} unités)`)
    return true
  } catch (error) {
    console.error('Erreur réservation stock directe:', error)
    return false
  }
}

/**
 * Libérer du stock réservé directement
 */
export async function releaseStockDirect(
  productId: string,
  size: string,
  quantity: number,
): Promise<boolean> {
  try {
    const payload = await getPayload({ config })

    const product = await payload.findByID({
      collection: 'products',
      id: productId,
    })

    if (!product || !product.sizes) {
      console.error(`Produit ${productId} non trouvé`)
      return false
    }

    const sizeIndex = product.sizes.findIndex((s: any) => s.size === size)
    if (sizeIndex === -1) {
      console.error(`Taille ${size} non trouvée`)
      return false
    }

    // Libérer le stock réservé et recalculer availableStock
    const currentReserved = product.sizes[sizeIndex].reservedStock || 0
    const newReserved = Math.max(0, currentReserved - quantity)
    const currentStock = product.sizes[sizeIndex].stock || 0
    product.sizes[sizeIndex].reservedStock = newReserved
    product.sizes[sizeIndex].availableStock = Math.max(0, currentStock - newReserved)

    await payload.update({
      collection: 'products',
      id: productId,
      data: {
        sizes: product.sizes,
      },
      context: { skipStockAlerts: true },
    })

    console.log(`✅ Stock libéré directement: ${productId} taille ${size} (${quantity} unités)`)
    return true
  } catch (error) {
    console.error('Erreur libération stock directe:', error)
    return false
  }
}

/**
 * Décrémenter le stock définitivement (avec traçabilité)
 */
export async function decrementStockDirect(
  productId: string,
  size: string,
  quantity: number,
  orderNumber?: string,
): Promise<boolean> {
  try {
    const payload = await getPayload({ config })

    const product = await payload.findByID({
      collection: 'products',
      id: productId,
    })

    if (!product || !product.sizes) {
      console.error(`Produit ${productId} non trouvé`)
      return false
    }

    const sizeIndex = product.sizes.findIndex((s: any) => s.size === size)
    if (sizeIndex === -1) {
      console.error(`Taille ${size} non trouvée`)
      return false
    }

    const currentStock = product.sizes[sizeIndex].stock || 0
    const currentReserved = product.sizes[sizeIndex].reservedStock || 0

    // Décrémenter le stock et libérer la réservation puis recalculer availableStock
    const newStock = Math.max(0, currentStock - quantity)
    const newReserved = Math.max(0, currentReserved - quantity)

    product.sizes[sizeIndex].stock = newStock
    product.sizes[sizeIndex].reservedStock = newReserved
    product.sizes[sizeIndex].availableStock = Math.max(0, newStock - newReserved)

    await payload.update({
      collection: 'products',
      id: productId,
      data: {
        sizes: product.sizes,
      },
      context: { skipStockAlerts: true },
    })

    // Créer un mouvement de stock pour traçabilité (optionnel)
    try {
      await payload.create({
        collection: 'stock-movements',
        data: {
          product: productId as any,
          size: size as any,
          type: 'sale',
          quantity: -quantity,
          stockBefore: currentStock,
          stockAfter: newStock,
          reason: `Vente - Commande ${orderNumber || 'N/A'}`,
          reference: orderNumber || 'N/A',
          orderReference: orderNumber,
          date: new Date().toISOString(),
        },
      })
    } catch (movementError) {
      console.error('Erreur création mouvement de stock:', movementError)
      // On continue même si la création du mouvement échoue
    }

    console.log(
      `✅ Stock décrémenté directement: ${productId} taille ${size} (${currentStock} → ${newStock})`,
    )
    return true
  } catch (error) {
    console.error('Erreur décrémentation stock directe:', error)
    return false
  }
}
