import type { CollectionAfterChangeHook, CollectionBeforeChangeHook } from 'payload'

// Hook pour créer automatiquement des alertes de stock
export const createStockAlerts: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  // Seulement pour les produits
  if (operation === 'update' || operation === 'create') {
    if (doc.sizes && Array.isArray(doc.sizes)) {
      for (const size of doc.sizes) {
        const availableStock = size.availableStock || 0
        const threshold = size.lowStockThreshold || 5

        // Vérifier s'il faut créer une alerte
        let alertType = null
        let priority = 'medium'
        let message = ''

        if (availableStock <= 0) {
          alertType = 'out_of_stock'
          priority = 'critical'
          message = `Rupture de stock pour ${doc.title} en taille ${size.size}`
        } else if (availableStock <= threshold) {
          alertType = 'low_stock'
          priority = availableStock <= Math.ceil(threshold / 2) ? 'high' : 'medium'
          message = `Stock faible pour ${doc.title} en taille ${size.size} (${availableStock} restant)`
        }

        if (alertType) {
          // Vérifier si une alerte similaire existe déjà
          const existingAlert = await req.payload.find({
            collection: 'stock-alerts',
            where: {
              and: [
                { product: { equals: doc.id } },
                { size: { equals: size.size } },
                { alertType: { equals: alertType } },
                { isResolved: { equals: false } },
              ],
            },
          })

          // Créer l'alerte seulement si elle n'existe pas
          if (existingAlert.totalDocs === 0) {
            try {
              await req.payload.create({
                collection: 'stock-alerts',
                data: {
                  alertType,
                  priority,
                  product: doc.id,
                  size: size.size,
                  currentStock: availableStock,
                  threshold,
                  message,
                  suggestedQuantity: threshold * 3, // Suggestion de réapprovisionnement
                },
              })
            } catch (error) {
              console.error("Erreur lors de la création d'alerte:", error)
            }
          }
        } else {
          // Si le stock est OK, résoudre les alertes existantes
          try {
            const alertsToResolve = await req.payload.find({
              collection: 'stock-alerts',
              where: {
                and: [
                  { product: { equals: doc.id } },
                  { size: { equals: size.size } },
                  { isResolved: { equals: false } },
                  {
                    or: [
                      { alertType: { equals: 'out_of_stock' } },
                      { alertType: { equals: 'low_stock' } },
                    ],
                  },
                ],
              },
            })

            for (const alert of alertsToResolve.docs) {
              await req.payload.update({
                collection: 'stock-alerts',
                id: alert.id,
                data: {
                  isResolved: true,
                  resolvedAt: new Date(),
                  actionTaken: 'restocked',
                  resolutionNotes: 'Stock réapprovisionné automatiquement',
                },
              })
            }
          } catch (error) {
            console.error("Erreur lors de la résolution d'alertes:", error)
          }
        }
      }
    }
  }
}

// Hook pour enregistrer les mouvements de stock automatiquement
export const recordStockMovement = async (
  productId: string,
  size: string,
  quantity: number,
  type: string,
  reason: string,
  orderReference?: string,
  req?: any,
) => {
  if (!req?.payload) return

  try {
    // Récupérer le produit pour obtenir le stock actuel
    const product = await req.payload.findByID({
      collection: 'products',
      id: productId,
    })

    if (product && product.sizes) {
      const sizeData = product.sizes.find((s: any) => s.size === size)
      if (sizeData) {
        await req.payload.create({
          collection: 'stock-movements',
          data: {
            type,
            product: productId,
            size,
            quantity,
            stockBefore: sizeData.stock || 0,
            stockAfter: (sizeData.stock || 0) + quantity,
            reason,
            orderReference,
            isAutomated: true,
          },
        })
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du mouvement:", error)
  }
}

// Hook pour mettre à jour les stocks après une commande
export const updateStockAfterOrder: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  // Seulement pour les nouvelles commandes confirmées
  if (operation === 'create' && doc.status === 'confirmed') {
    if (doc.items && Array.isArray(doc.items)) {
      for (const item of doc.items) {
        if (item.product && item.size && item.quantity) {
          // Enregistrer le mouvement de stock
          await recordStockMovement(
            item.product,
            item.size,
            -item.quantity, // Quantité négative pour une vente
            'sale',
            `Vente - Commande ${doc.orderNumber}`,
            doc.orderNumber,
            req,
          )
        }
      }
    }
  }

  // Gérer les changements de statut
  if (operation === 'update' && previousDoc) {
    // Si commande annulée, remettre le stock
    if (previousDoc.status === 'confirmed' && doc.status === 'cancelled') {
      if (doc.items && Array.isArray(doc.items)) {
        for (const item of doc.items) {
          if (item.product && item.size && item.quantity) {
            await recordStockMovement(
              item.product,
              item.size,
              item.quantity, // Quantité positive pour remettre en stock
              'return',
              `Annulation - Commande ${doc.orderNumber}`,
              doc.orderNumber,
              req,
            )
          }
        }
      }
    }
  }
}

// Hook pour calculer automatiquement les suggestions de réapprovisionnement
export const calculateRestockSuggestions: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  if (operation === 'create' || operation === 'update') {
    if (data.sizes && Array.isArray(data.sizes)) {
      data.sizes.forEach((size: any) => {
        const availableStock = size.availableStock || 0
        const threshold = size.lowStockThreshold || 5

        // Calculer la suggestion basée sur l'historique des ventes
        // Pour l'instant, suggestion simple : 3x le seuil
        if (availableStock <= threshold) {
          size.suggestedRestockQuantity = threshold * 3
        }
      })
    }
  }

  return data
}
