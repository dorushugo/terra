import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const StockAlerts: CollectionConfig = {
  slug: 'stock-alerts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['product', 'size', 'alertType', 'currentStock', 'threshold', 'isResolved'],
    useAsTitle: 'alertReference',
    group: 'Gestion des Stocks',
    description: 'Alertes automatiques de gestion des stocks',
  },
  fields: [
    {
      name: 'alertReference',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: "Référence unique de l'alerte",
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.product && data?.size) {
              const timestamp = Date.now()
              return `ALERT-${data.alertType?.toUpperCase()}-${timestamp}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'alertType',
      type: 'select',
      required: true,
      options: [
        { label: '⚠️ Stock faible', value: 'low_stock' },
        { label: '❌ Rupture de stock', value: 'out_of_stock' },
        { label: '📈 Surstock', value: 'overstock' },
        { label: '🔄 Réapprovisionnement suggéré', value: 'restock_suggestion' },
      ],
      admin: {
        description: "Type d'alerte",
      },
    },
    {
      name: 'priority',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        { label: '🔴 Critique', value: 'critical' },
        { label: '🟠 Élevée', value: 'high' },
        { label: '🟡 Moyenne', value: 'medium' },
        { label: '🟢 Faible', value: 'low' },
      ],
      admin: {
        description: "Priorité de l'alerte",
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      admin: {
        description: 'Produit concerné',
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
      name: 'currentStock',
      type: 'number',
      required: true,
      admin: {
        description: 'Stock actuel',
        readOnly: true,
      },
    },
    {
      name: 'threshold',
      type: 'number',
      admin: {
        description: "Seuil qui a déclenché l'alerte",
        readOnly: true,
      },
    },
    {
      name: 'suggestedQuantity',
      type: 'number',
      admin: {
        description: 'Quantité suggérée pour réapprovisionnement',
        step: 1,
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: {
        description: "Message d'alerte détaillé",
        rows: 3,
      },
    },
    {
      name: 'isResolved',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Alerte résolue',
      },
    },
    {
      name: 'resolvedAt',
      type: 'date',
      admin: {
        description: 'Date de résolution',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        condition: (data) => data.isResolved,
      },
    },
    {
      name: 'resolvedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Résolu par',
        condition: (data) => data.isResolved,
      },
    },
    {
      name: 'resolutionNotes',
      type: 'textarea',
      admin: {
        description: 'Notes de résolution',
        rows: 2,
        condition: (data) => data.isResolved,
      },
    },
    {
      name: 'actionTaken',
      type: 'select',
      options: [
        { label: 'Réapprovisionnement effectué', value: 'restocked' },
        { label: 'Produit discontinué', value: 'discontinued' },
        { label: 'Seuil ajusté', value: 'threshold_adjusted' },
        { label: 'Fausse alerte', value: 'false_alert' },
        { label: 'En attente fournisseur', value: 'waiting_supplier' },
        { label: 'Autre', value: 'other' },
      ],
      admin: {
        description: 'Action entreprise',
        condition: (data) => data.isResolved,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'update' && data.isResolved && !data.resolvedAt) {
          data.resolvedAt = new Date()
        }
        return data
      },
    ],
  },
  timestamps: true,
}
