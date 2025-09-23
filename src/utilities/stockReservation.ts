import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Fonction utilitaire pour gérer les réservations de stock temporaires
 */

export interface StockReservation {
  productId: string
  size: string
  quantity: number
  reservedAt: Date
  paymentIntentId?: string
}

// Cache temporaire des réservations (en production, utiliser Redis)
declare global {
  var stockReservations: Map<string, StockReservation[]> | undefined
}

/**
 * Réserver du stock temporairement (version simplifiée pour éviter les hooks)
 */
export async function reserveStock(
  productId: string,
  size: string,
  quantity: number,
  paymentIntentId?: string,
): Promise<boolean> {
  try {
    const payload = await getPayload({ config })

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
    if (!sizeData || (sizeData.availableStock || 0) < quantity) {
      console.error(`Stock insuffisant: ${sizeData?.availableStock || 0} < ${quantity}`)
      return false
    }

    // Réserver le stock
    const currentReserved = sizeData.reservedStock || 0
    product.sizes[sizeIndex].reservedStock = currentReserved + quantity

    // Mise à jour du produit
    await payload.update({
      collection: 'products',
      id: productId,
      data: {
        sizes: product.sizes,
      },
    })

    // Ajouter à la liste des réservations temporaires
    global.stockReservations = global.stockReservations || new Map()
    const reservations = global.stockReservations.get(productId) || []
    reservations.push({
      productId,
      size,
      quantity,
      reservedAt: new Date(),
      paymentIntentId,
    })
    global.stockReservations.set(productId, reservations)

    console.log(`✅ Stock réservé: ${productId} taille ${size} (${quantity} unités)`)
    return true
  } catch (error) {
    console.error('Erreur réservation stock:', error)
    return false
  }
}

/**
 * Libérer une réservation de stock
 */
export async function releaseStock(
  productId: string,
  size: string,
  quantity: number,
  paymentIntentId?: string,
): Promise<boolean> {
  try {
    const payload = await getPayload({ config })

    const product = await payload.findByID({
      collection: 'products',
      id: productId,
    })

    if (!product || !product.sizes) {
      return false
    }

    const sizeIndex = product.sizes.findIndex((s: any) => s.size === size)
    if (sizeIndex === -1) {
      return false
    }

    // Libérer le stock réservé
    const currentReserved = product.sizes[sizeIndex].reservedStock || 0
    const newReserved = Math.max(0, currentReserved - quantity)
    product.sizes[sizeIndex].reservedStock = newReserved

    await payload.update({
      collection: 'products',
      id: productId,
      data: {
        sizes: product.sizes,
      },
    })

    // Retirer de la liste des réservations temporaires
    global.stockReservations = global.stockReservations || new Map()
    const reservations = global.stockReservations.get(productId) || []
    const filteredReservations = reservations.filter(
      (r) =>
        !(
          r.size === size &&
          r.quantity === quantity &&
          (!paymentIntentId || r.paymentIntentId === paymentIntentId)
        ),
    )

    if (filteredReservations.length > 0) {
      global.stockReservations.set(productId, filteredReservations)
    } else {
      global.stockReservations.delete(productId)
    }

    return true
  } catch (error) {
    console.error('Erreur libération stock:', error)
    return false
  }
}

/**
 * Nettoyer les réservations expirées (plus de 30 minutes)
 */
export async function cleanExpiredReservations(): Promise<void> {
  try {
    global.stockReservations = global.stockReservations || new Map()
    const now = new Date()
    const expiredTime = 30 * 60 * 1000 // 30 minutes en millisecondes

    for (const [productId, reservations] of global.stockReservations.entries()) {
      const validReservations = []

      for (const reservation of reservations) {
        const reservedTime = now.getTime() - reservation.reservedAt.getTime()

        if (reservedTime > expiredTime) {
          // Libérer la réservation expirée
          await releaseStock(
            productId,
            reservation.size,
            reservation.quantity,
            reservation.paymentIntentId,
          )
          console.log(`🧹 Réservation expirée libérée: ${productId} taille ${reservation.size}`)
        } else {
          validReservations.push(reservation)
        }
      }

      if (validReservations.length > 0) {
        global.stockReservations.set(productId, validReservations)
      } else {
        global.stockReservations.delete(productId)
      }
    }
  } catch (error) {
    console.error('Erreur nettoyage réservations expirées:', error)
  }
}

/**
 * Décrémenter définitivement le stock après paiement réussi
 */
export async function decrementStock(
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
      return false
    }

    const sizeIndex = product.sizes.findIndex((s: any) => s.size === size)
    if (sizeIndex === -1) {
      return false
    }

    const currentStock = product.sizes[sizeIndex].stock || 0
    const currentReserved = product.sizes[sizeIndex].reservedStock || 0

    // Décrémenter le stock et libérer la réservation
    const newStock = Math.max(0, currentStock - quantity)
    const newReserved = Math.max(0, currentReserved - quantity)

    product.sizes[sizeIndex].stock = newStock
    product.sizes[sizeIndex].reservedStock = newReserved

    await payload.update({
      collection: 'products',
      id: productId,
      data: {
        sizes: product.sizes,
      },
    })

    // Créer un mouvement de stock pour traçabilité
    await payload.create({
      collection: 'stock-movements',
      data: {
        product: productId as any, // Cast pour correspondre au type attendu
        size: size as any, // Cast pour éviter l'erreur de type strict
        type: 'sale',
        quantity: -quantity,
        stockBefore: currentStock,
        stockAfter: newStock,
        reason: `Vente - Commande ${orderNumber || 'N/A'}`,
        reference: orderNumber || 'N/A', // Champ requis
        orderReference: orderNumber,
        date: new Date().toISOString(),
      },
    })

    return true
  } catch (error) {
    console.error('Erreur décrémentation stock:', error)
    return false
  }
}
