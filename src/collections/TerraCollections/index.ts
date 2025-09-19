import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const TerraCollections: CollectionConfig = {
  slug: 'terra-collections',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'slug', 'priceRange', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Nom de la collection (ex: TERRA Origin)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL de la collection (ex: origin)',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      admin: {
        description: "Slogan de la collection (ex: L'essentiel réinventé)",
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: false,
      admin: {
        description: 'Description détaillée de la collection',
      },
    },
    {
      name: 'shortDescription',
      type: 'text',
      required: true,
      admin: {
        description: 'Description courte pour les cartes',
      },
    },
    {
      name: 'priceRange',
      type: 'group',
      fields: [
        {
          name: 'from',
          type: 'number',
          required: true,
          admin: {
            description: 'Prix minimum',
            step: 1,
            suffix: '€',
          },
        },
        {
          name: 'to',
          type: 'number',
          admin: {
            description: 'Prix maximum (optionnel)',
            step: 1,
            suffix: '€',
          },
        },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Image principale de la collection',
      },
    },
    {
      name: 'lifestyleImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Image lifestyle de la collection',
      },
    },
    {
      name: 'keyFeatures',
      type: 'array',
      required: false,
      minRows: 0,
      maxRows: 5,
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Caractéristiques clés (3-5 max)',
      },
    },
    {
      name: 'materials',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Nom du matériau',
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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Image du matériau',
          },
        },
      ],
      admin: {
        description: 'Matériaux utilisés dans la collection',
      },
    },
    {
      name: 'craftsmanship',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Savoir-faire',
        },
        {
          name: 'description',
          type: 'text',
          admin: {
            description: 'Description du savoir-faire',
          },
        },
        {
          name: 'stats',
          type: 'array',
          fields: [
            {
              name: 'stat',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Statistiques du savoir-faire',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Image du processus de fabrication',
          },
        },
      ],
    },
    {
      name: 'stylingGuide',
      type: 'array',
      fields: [
        {
          name: 'lookName',
          type: 'text',
          required: true,
          admin: {
            description: 'Nom du look (ex: Casual Urbain)',
          },
        },
        {
          name: 'description',
          type: 'text',
          admin: {
            description: 'Description du style',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Image du look',
          },
        },
      ],
      admin: {
        description: 'Guide de style pour la collection',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: "Ordre d'affichage",
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Collection active',
      },
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
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data._status === 'published') {
          data.publishedAt = data.publishedAt || new Date()
        }
        return data
      },
    ],
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
