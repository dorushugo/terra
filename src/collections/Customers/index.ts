import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const Customers: CollectionConfig = {
  slug: 'customers',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['email', 'firstName', 'lastName', 'totalOrders', 'totalSpent', 'createdAt'],
    useAsTitle: 'email',
    group: 'E-commerce',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        description: 'Adresse email du client',
      },
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
      admin: {
        description: 'Prénom',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      admin: {
        description: 'Nom de famille',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Numéro de téléphone',
      },
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      admin: {
        description: 'Date de naissance (optionnel)',
      },
    },
    {
      name: 'addresses',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: "Label de l'adresse (ex: Domicile, Travail)",
          },
        },
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
        {
          name: 'isDefault',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Adresse par défaut',
          },
        },
      ],
      admin: {
        description: 'Adresses du client',
      },
    },
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'favoriteCollections',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'TERRA Origin', value: 'origin' },
            { label: 'TERRA Move', value: 'move' },
            { label: 'TERRA Limited', value: 'limited' },
          ],
          admin: {
            description: 'Collections préférées',
          },
        },
        {
          name: 'preferredSizes',
          type: 'select',
          hasMany: true,
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
            description: 'Pointures habituelles',
          },
        },
        {
          name: 'newsletterSubscribed',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Abonné à la newsletter',
          },
        },
        {
          name: 'marketingConsent',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Consent marketing (SMS, emails promotionnels)',
          },
        },
      ],
      admin: {
        description: 'Préférences du client',
      },
    },
    {
      name: 'stats',
      type: 'group',
      fields: [
        {
          name: 'totalOrders',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Nombre total de commandes',
            readOnly: true,
          },
        },
        {
          name: 'totalSpent',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Montant total dépensé',
            readOnly: true,
            step: 0.01,
            suffix: '€',
          },
        },
        {
          name: 'averageOrderValue',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Panier moyen',
            readOnly: true,
            step: 0.01,
            suffix: '€',
          },
        },
        {
          name: 'lastOrderDate',
          type: 'date',
          admin: {
            description: 'Date de dernière commande',
            readOnly: true,
          },
        },
      ],
      admin: {
        description: 'Statistiques client',
      },
    },
    {
      name: 'customerTier',
      type: 'select',
      defaultValue: 'bronze',
      options: [
        { label: '🥉 Bronze (0-199€)', value: 'bronze' },
        { label: '🥈 Silver (200-499€)', value: 'silver' },
        { label: '🥇 Gold (500-999€)', value: 'gold' },
        { label: '💎 Platinum (1000€+)', value: 'platinum' },
      ],
      admin: {
        description: 'Niveau de fidélité basé sur le montant dépensé',
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Notes internes sur le client',
        rows: 3,
      },
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'VIP', value: 'vip' },
        { label: 'Influenceur', value: 'influencer' },
        { label: 'Presse', value: 'press' },
        { label: 'Employé', value: 'employee' },
        { label: 'Problématique', value: 'problematic' },
        { label: 'Éco-conscient', value: 'eco_conscious' },
      ],
      admin: {
        description: 'Tags pour catégoriser le client',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Mettre à jour le tier client basé sur le montant total dépensé
        if (doc.stats?.totalSpent !== undefined) {
          let newTier = 'bronze'
          const totalSpent = doc.stats.totalSpent

          if (totalSpent >= 1000) newTier = 'platinum'
          else if (totalSpent >= 500) newTier = 'gold'
          else if (totalSpent >= 200) newTier = 'silver'

          if (doc.customerTier !== newTier) {
            await req.payload.update({
              collection: 'customers',
              id: doc.id,
              data: { customerTier: newTier },
            })
          }
        }
      },
    ],
  },
  timestamps: true,
}
