import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { createStockAlerts, calculateRestockSuggestions } from '@/hooks/stockManagement'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'collection', 'price', 'ecoScore', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Nom du produit (ex: TERRA Origin Stone White)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL du produit (auto-généré)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'collection',
      type: 'select',
      required: true,
      options: [
        { label: 'TERRA Origin', value: 'origin' },
        { label: 'TERRA Move', value: 'move' },
        { label: 'TERRA Limited', value: 'limited' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        step: 0.01,
        description: 'Prix en euros',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: false,
      admin: {
        description: 'Description détaillée du produit',
      },
      validate: (val) => {
        // Allow empty values
        if (!val) return true
        // Allow valid Lexical objects
        if (typeof val === 'object' && val.root) return true
        // Reject string values to prevent Lexical errors
        if (typeof val === 'string') {
          return 'Les descriptions texte doivent être converties. Veuillez resaisir le contenu.'
        }
        return true
      },
    },
    {
      name: 'shortDescription',
      type: 'text',
      required: true,
      admin: {
        description: 'Description courte pour les cartes produits',
      },
    },
    {
      name: 'images',
      type: 'array',
      required: false,
      minRows: 0,
      maxRows: 8,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Images du produit (6-8 angles recommandés)',
      },
    },
    {
      name: 'colors',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Nom de la couleur (ex: Stone White)',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'Code couleur hex (ex: #F5F5F0)',
          },
        },
        {
          name: 'images',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
          admin: {
            description: 'Images spécifiques à cette couleur',
          },
        },
      ],
    },
    {
      name: 'sizes',
      type: 'array',
      required: true,
      fields: [
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
          name: 'stock',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Quantité en stock',
          },
        },
        {
          name: 'reservedStock',
          type: 'number',
          defaultValue: 0,
          min: 0,
          admin: {
            description: 'Stock réservé (commandes en attente)',
            readOnly: true,
          },
        },
        {
          name: 'availableStock',
          type: 'number',
          admin: {
            description: 'Stock disponible (stock - réservé)',
            readOnly: true,
          },
          hooks: {
            beforeChange: [
              ({ siblingData }) => {
                const stock = siblingData.stock || 0
                const reserved = siblingData.reservedStock || 0
                return Math.max(0, stock - reserved)
              },
            ],
          },
        },
        {
          name: 'lowStockThreshold',
          type: 'number',
          defaultValue: 5,
          min: 0,
          admin: {
            description: "Seuil d'alerte stock faible",
          },
        },
        {
          name: 'isLowStock',
          type: 'checkbox',
          admin: {
            description: 'Stock faible (alerte)',
            readOnly: true,
          },
          hooks: {
            beforeChange: [
              ({ siblingData }) => {
                const available = siblingData.availableStock || 0
                const threshold = siblingData.lowStockThreshold || 5
                return available <= threshold && available > 0
              },
            ],
          },
        },
        {
          name: 'isOutOfStock',
          type: 'checkbox',
          admin: {
            description: 'Rupture de stock',
            readOnly: true,
          },
          hooks: {
            beforeChange: [
              ({ siblingData }) => {
                const available = siblingData.availableStock || 0
                return available <= 0
              },
            ],
          },
        },
      ],
    },
    {
      name: 'ecoScore',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      admin: {
        description: 'Score éco de 1 à 10',
        step: 0.1,
      },
    },
    {
      name: 'sustainability',
      type: 'group',
      fields: [
        {
          name: 'materials',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: 'Nom du matériau (ex: Cuir Apple)',
              },
            },
            {
              name: 'description',
              type: 'text',
              required: true,
              admin: {
                description: 'Description du matériau',
              },
            },
            {
              name: 'sustainabilityBenefit',
              type: 'text',
              required: true,
              admin: {
                description: 'Avantage écologique',
              },
            },
            {
              name: 'percentage',
              type: 'number',
              admin: {
                description: 'Pourcentage dans le produit',
                step: 1,
                suffix: '%',
              },
            },
          ],
        },
        {
          name: 'carbonFootprint',
          type: 'number',
          admin: {
            description: 'Empreinte carbone en kg CO2',
            step: 0.1,
            suffix: 'kg CO2',
          },
        },
        {
          name: 'recycledContent',
          type: 'number',
          admin: {
            description: 'Pourcentage de matériaux recyclés',
            step: 1,
            suffix: '%',
          },
        },
      ],
      admin: {
        description: 'Informations de durabilité',
      },
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Caractéristiques du produit',
      },
    },
    {
      name: 'careInstructions',
      type: 'richText',
      admin: {
        description: "Instructions d'entretien",
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Produit mis en avant',
      },
    },
    {
      name: 'isNewArrival',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Nouvelle arrivée',
      },
    },
    {
      name: 'stockHistory',
      type: 'array',
      admin: {
        description: 'Historique des mouvements de stock',
        readOnly: true,
      },
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Réapprovisionnement', value: 'restock' },
            { label: 'Vente', value: 'sale' },
            { label: 'Retour', value: 'return' },
            { label: 'Ajustement', value: 'adjustment' },
            { label: 'Réservation', value: 'reservation' },
            { label: 'Libération', value: 'release' },
          ],
        },
        {
          name: 'size',
          type: 'text',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'reason',
          type: 'text',
          admin: {
            description: 'Raison du mouvement',
          },
        },
        {
          name: 'reference',
          type: 'text',
          admin: {
            description: 'Référence (numéro de commande, etc.)',
          },
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      calculateRestockSuggestions,
      ({ data }) => {
        if (data._status === 'published') {
          data.publishedAt = data.publishedAt || new Date()
        }
        return data
      },
    ],
    afterChange: [createStockAlerts],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}
