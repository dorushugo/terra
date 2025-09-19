import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { updateCustomerStats } from '@/hooks/updateCustomerStats'
import { updateProductStock } from '@/hooks/updateProductStock'
import { updateStockAfterOrder } from '@/hooks/stockManagement'

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: anyone, // Les clients peuvent créer des commandes
    delete: authenticated, // Seuls les admins peuvent supprimer
    read: ({ req: { user } }) => {
      // Les admins peuvent voir toutes les commandes
      // Les utilisateurs connectés peuvent voir leurs propres commandes
      if (user) {
        if (user.role === 'admin') {
          return true
        }
        return {
          user: {
            equals: user.id,
          },
        }
      }
      return false
    },
    update: authenticated, // Seuls les admins peuvent modifier les statuts
  },
  admin: {
    defaultColumns: ['orderNumber', 'customerEmail', 'status', 'total', 'createdAt'],
    useAsTitle: 'orderNumber',
    group: 'E-commerce',
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Numéro de commande unique (auto-généré)',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ value, operation }) => {
            if (operation === 'create' && !value) {
              // Générer un numéro de commande unique
              const timestamp = Date.now().toString(36).toUpperCase()
              const random = Math.random().toString(36).substr(2, 4).toUpperCase()
              return `TERRA-${timestamp}-${random}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Confirmée', value: 'confirmed' },
        { label: 'En préparation', value: 'preparing' },
        { label: 'Expédiée', value: 'shipped' },
        { label: 'Livrée', value: 'delivered' },
        { label: 'Annulée', value: 'cancelled' },
        { label: 'Remboursée', value: 'refunded' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Utilisateur connecté (si applicable)',
      },
    },
    {
      name: 'customer',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
          admin: {
            description: 'Email du client',
          },
        },
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          admin: {
            description: 'Numéro de téléphone (optionnel)',
          },
        },
      ],
      admin: {
        description: 'Informations du client',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          admin: {
            description: 'Produit commandé',
          },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          admin: {
            description: 'Quantité commandée',
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
        },
        {
          name: 'color',
          type: 'text',
          required: true,
          admin: {
            description: 'Couleur choisie',
          },
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          admin: {
            description: 'Prix unitaire au moment de la commande',
            step: 0.01,
            suffix: '€',
          },
        },
        {
          name: 'totalPrice',
          type: 'number',
          required: true,
          admin: {
            description: 'Prix total pour cet item (quantité × prix unitaire)',
            readOnly: true,
            step: 0.01,
            suffix: '€',
          },
          hooks: {
            beforeChange: [
              ({ siblingData }) => {
                return (siblingData.quantity || 0) * (siblingData.unitPrice || 0)
              },
            ],
          },
        },
      ],
      admin: {
        description: 'Articles commandés',
      },
    },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        {
          name: 'subtotal',
          type: 'number',
          required: true,
          admin: {
            description: 'Sous-total (avant frais)',
            readOnly: true,
            step: 0.01,
            suffix: '€',
          },
        },
        {
          name: 'shippingCost',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Frais de livraison',
            step: 0.01,
            suffix: '€',
          },
        },
        {
          name: 'taxAmount',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Montant des taxes (TVA)',
            step: 0.01,
            suffix: '€',
          },
        },
        {
          name: 'discountAmount',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Montant de la réduction',
            step: 0.01,
            suffix: '€',
          },
        },
        {
          name: 'total',
          type: 'number',
          required: true,
          admin: {
            description: 'Total final',
            readOnly: true,
            step: 0.01,
            suffix: '€',
          },
        },
      ],
      admin: {
        description: 'Détails des prix',
      },
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
          required: true,
          admin: {
            description: 'Adresse (rue, numéro)',
          },
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'select',
          required: true,
          defaultValue: 'FR',
          options: [
            { label: 'France', value: 'FR' },
            { label: 'Belgique', value: 'BE' },
            { label: 'Suisse', value: 'CH' },
            { label: 'Luxembourg', value: 'LU' },
            { label: 'Monaco', value: 'MC' },
          ],
        },
      ],
      admin: {
        description: 'Adresse de livraison',
      },
    },
    {
      name: 'paymentInfo',
      type: 'group',
      fields: [
        {
          name: 'method',
          type: 'select',
          required: true,
          options: [
            { label: 'Carte bancaire', value: 'card' },
            { label: 'PayPal', value: 'paypal' },
            { label: 'Apple Pay', value: 'apple_pay' },
            { label: 'Google Pay', value: 'google_pay' },
            { label: 'Virement', value: 'transfer' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: [
            { label: 'En attente', value: 'pending' },
            { label: 'Payé', value: 'paid' },
            { label: 'Échoué', value: 'failed' },
            { label: 'Remboursé', value: 'refunded' },
          ],
        },
        {
          name: 'transactionId',
          type: 'text',
          admin: {
            description: 'ID de transaction du processeur de paiement',
          },
        },
        {
          name: 'paidAt',
          type: 'date',
          admin: {
            description: 'Date et heure du paiement',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
      admin: {
        description: 'Informations de paiement',
      },
    },
    {
      name: 'tracking',
      type: 'group',
      fields: [
        {
          name: 'carrier',
          type: 'select',
          options: [
            { label: 'Colissimo', value: 'colissimo' },
            { label: 'Chronopost', value: 'chronopost' },
            { label: 'UPS', value: 'ups' },
            { label: 'DHL', value: 'dhl' },
            { label: 'FedEx', value: 'fedex' },
          ],
        },
        {
          name: 'trackingNumber',
          type: 'text',
          admin: {
            description: 'Numéro de suivi du colis',
          },
        },
        {
          name: 'shippedAt',
          type: 'date',
          admin: {
            description: "Date d'expédition",
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'deliveredAt',
          type: 'date',
          admin: {
            description: 'Date de livraison',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
      admin: {
        description: 'Suivi de livraison',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Notes internes sur la commande',
        rows: 3,
      },
    },
    {
      name: 'customerNotes',
      type: 'textarea',
      admin: {
        description: 'Commentaires du client',
        readOnly: true,
        rows: 2,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Calculer le sous-total
        if (data.items) {
          const subtotal = data.items.reduce((sum: number, item: any) => {
            return sum + (item.totalPrice || 0)
          }, 0)

          if (!data.pricing) data.pricing = {}
          data.pricing.subtotal = subtotal

          // Calculer le total final
          const shippingCost = data.pricing.shippingCost || 0
          const taxAmount = data.pricing.taxAmount || 0
          const discountAmount = data.pricing.discountAmount || 0

          data.pricing.total = subtotal + shippingCost + taxAmount - discountAmount
        }

        return data
      },
    ],
    afterChange: [
      updateCustomerStats,
      updateProductStock,
      updateStockAfterOrder,
      async ({ doc, operation, req }) => {
        // Mettre à jour les stocks après création/modification de commande
        if (operation === 'create' && doc.status === 'confirmed') {
          // Décrémenter les stocks pour chaque item
          for (const item of doc.items) {
            if (typeof item.product === 'string') {
              const product = await req.payload.findByID({
                collection: 'products',
                id: item.product,
              })

              if (product && product.sizes) {
                const sizeIndex = product.sizes.findIndex((s: any) => s.size === item.size)
                if (sizeIndex !== -1 && product.sizes[sizeIndex].stock >= item.quantity) {
                  product.sizes[sizeIndex].stock -= item.quantity

                  await req.payload.update({
                    collection: 'products',
                    id: item.product,
                    data: {
                      sizes: product.sizes,
                    },
                  })
                }
              }
            }
          }
        }
      },
    ],
  },
  timestamps: true,
}
