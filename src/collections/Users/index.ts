import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: anyone, // Permet la création de compte depuis le frontend
    delete: authenticated,
    read: ({ req: { user } }) => {
      // Les utilisateurs peuvent lire leur propre profil
      if (user) {
        return {
          id: {
            equals: user.id,
          },
        }
      }
      return false
    },
    update: ({ req: { user } }) => {
      // Les utilisateurs peuvent modifier leur propre profil
      if (user) {
        return {
          id: {
            equals: user.id,
          },
        }
      }
      return false
    },
  },
  admin: {
    defaultColumns: ['firstName', 'lastName', 'email', 'createdAt'],
    useAsTitle: 'email',
    group: 'Utilisateurs',
  },
  auth: {
    tokenExpiration: 7200, // 2 heures
    verify: false, // Désactiver la vérification email pour simplifier
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      admin: {
        description: "Prénom de l'utilisateur",
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      admin: {
        description: "Nom de famille de l'utilisateur",
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Numéro de téléphone (optionnel)',
      },
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      admin: {
        description: 'Date de naissance (optionnelle)',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Photo de profil',
      },
    },
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'newsletter',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Recevoir la newsletter TERRA',
          },
        },
        {
          name: 'smsNotifications',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Recevoir les notifications SMS',
          },
        },
        {
          name: 'emailNotifications',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Recevoir les notifications par email',
          },
        },
        {
          name: 'language',
          type: 'select',
          defaultValue: 'fr',
          options: [
            { label: 'Français', value: 'fr' },
            { label: 'English', value: 'en' },
          ],
        },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'EUR',
          options: [
            { label: 'Euro (€)', value: 'EUR' },
            { label: 'US Dollar ($)', value: 'USD' },
          ],
        },
      ],
      admin: {
        description: 'Préférences utilisateur',
      },
    },
    // Champ pour lier aux commandes (virtuel)
    {
      name: 'orders',
      type: 'relationship',
      relationTo: 'orders',
      hasMany: true,
      admin: {
        readOnly: true,
        description: 'Commandes de cet utilisateur',
      },
    },
  ],
  timestamps: true,
}
