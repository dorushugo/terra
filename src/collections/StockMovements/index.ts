import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const StockMovements: CollectionConfig = {
  slug: 'stock-movements',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['date', 'type', 'product', 'size', 'quantity', 'reason'],
    useAsTitle: 'reference',
    group: 'Gestion des Stocks',
    description: 'Suivi détaillé de tous les mouvements de stock',
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Référence unique du mouvement (auto-généré)',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              const timestamp = Date.now()
              const random = Math.floor(Math.random() * 1000)
              return `MOV-${timestamp}-${random}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Date et heure du mouvement',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: '📦 Réapprovisionnement', value: 'restock' },
        { label: '🛒 Vente', value: 'sale' },
        { label: '↩️ Retour client', value: 'return' },
        { label: '🔄 Ajustement inventaire', value: 'adjustment' },
        { label: '🔒 Réservation', value: 'reservation' },
        { label: '🔓 Libération réservation', value: 'release' },
        { label: '❌ Casse/Perte', value: 'loss' },
        { label: '🎁 Échantillon/Cadeau', value: 'sample' },
        { label: '📋 Inventaire initial', value: 'initial' },
      ],
      admin: {
        description: 'Type de mouvement de stock',
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      admin: {
        description: 'Produit concerné par le mouvement',
      },
    },
    {
      name: 'size',
      type: 'select',
      required: true,
      options: [
        { label: '36', value: '36' },
        { label: '37', value: '37' },
        { label: '38', value: '38' },
        { label: '39', value: '39' },
        { label: '40', value: '40' },
        { label: '41', value: '41' },
        { label: '42', value: '42' },
        { label: '43', value: '43' },
        { label: '44', value: '44' },
        { label: '45', value: '45' },
        { label: '46', value: '46' },
      ],
      admin: {
        description: 'Taille concernée',
      },
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      admin: {
        description: 'Quantité (positive pour entrée, négative pour sortie)',
        step: 1,
      },
    },
    {
      name: 'stockBefore',
      type: 'number',
      required: true,
      admin: {
        description: 'Stock avant le mouvement',
        readOnly: true,
      },
    },
    {
      name: 'stockAfter',
      type: 'number',
      required: true,
      admin: {
        description: 'Stock après le mouvement',
        readOnly: true,
      },
    },
    {
      name: 'reason',
      type: 'text',
      required: true,
      admin: {
        description: 'Raison du mouvement (obligatoire)',
      },
    },
    {
      name: 'orderReference',
      type: 'text',
      admin: {
        description: 'Référence de commande (si applicable)',
      },
    },
    {
      name: 'supplierReference',
      type: 'text',
      admin: {
        description: 'Référence fournisseur (pour réapprovisionnements)',
      },
    },
    {
      name: 'unitCost',
      type: 'number',
      admin: {
        description: 'Coût unitaire (pour réapprovisionnements)',
        step: 0.01,
        suffix: '€',
      },
    },
    {
      name: 'totalCost',
      type: 'number',
      admin: {
        description: 'Coût total du mouvement',
        readOnly: true,
        step: 0.01,
        suffix: '€',
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const quantity = Math.abs(siblingData.quantity || 0)
            const unitCost = siblingData.unitCost || 0
            return quantity * unitCost
          },
        ],
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Utilisateur ayant effectué le mouvement',
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ req }) => {
            return req.user?.id || null
          },
        ],
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Notes additionnelles',
        rows: 3,
      },
    },
    {
      name: 'isAutomated',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mouvement automatique (via commande)',
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          // Récupérer le produit pour obtenir le stock actuel
          if (data.product && data.size) {
            const product = await req.payload.findByID({
              collection: 'products',
              id: data.product,
            })

            if (product && product.sizes) {
              const sizeData = product.sizes.find((s: any) => s.size === data.size)
              if (sizeData) {
                data.stockBefore = sizeData.stock || 0
                data.stockAfter = data.stockBefore + (data.quantity || 0)
              }
            }
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          // Mettre à jour le stock du produit
          const product = await req.payload.findByID({
            collection: 'products',
            id: doc.product,
          })

          if (product && product.sizes) {
            const sizeIndex = product.sizes.findIndex((s: any) => s.size === doc.size)
            if (sizeIndex !== -1) {
              // Mettre à jour le stock
              product.sizes[sizeIndex].stock = doc.stockAfter

              // Ajouter à l'historique du produit
              const historyEntry = {
                date: doc.date,
                type: doc.type,
                size: doc.size,
                quantity: doc.quantity,
                reason: doc.reason,
                reference: doc.orderReference || doc.supplierReference || doc.reference,
              }

              if (!product.stockHistory) {
                product.stockHistory = []
              }
              product.stockHistory.push(historyEntry)

              // Sauvegarder le produit
              await req.payload.update({
                collection: 'products',
                id: doc.product,
                data: {
                  sizes: product.sizes,
                  stockHistory: product.stockHistory,
                },
              })
            }
          }
        }
      },
    ],
  },
  timestamps: true,
}
