import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Addresses: CollectionConfig = {
  slug: 'addresses',
  access: {
    admin: authenticated,
    create: ({ req: { user } }) => Boolean(user), // Utilisateurs connectés seulement
    delete: ({ req: { user } }) => {
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        }
      }
      return false
    },
    read: ({ req: { user } }) => {
      // Les utilisateurs peuvent lire leurs propres adresses
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        }
      }
      return false
    },
    update: ({ req: { user } }) => {
      // Les utilisateurs peuvent modifier leurs propres adresses
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        }
      }
      return false
    },
  },
  admin: {
    defaultColumns: ['type', 'firstName', 'lastName', 'city', 'isDefault'],
    useAsTitle: 'firstName',
    group: 'Utilisateurs',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'Utilisateur propriétaire de cette adresse',
      },
      hooks: {
        beforeChange: [
          ({ req }) => {
            // Auto-assigner l'utilisateur connecté
            return req.user?.id
          },
        ],
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Adresse de livraison', value: 'shipping' },
        { label: 'Adresse de facturation', value: 'billing' },
      ],
      admin: {
        description: "Type d'adresse",
      },
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
      admin: {
        description: 'Prénom du destinataire',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      admin: {
        description: 'Nom du destinataire',
      },
    },
    {
      name: 'company',
      type: 'text',
      admin: {
        description: "Nom de l'entreprise (optionnel)",
      },
    },
    {
      name: 'address1',
      type: 'text',
      required: true,
      admin: {
        description: 'Adresse principale (rue, numéro)',
      },
    },
    {
      name: 'address2',
      type: 'text',
      admin: {
        description: "Complément d'adresse (appartement, étage, etc.)",
      },
    },
    {
      name: 'city',
      type: 'text',
      required: true,
      admin: {
        description: 'Ville',
      },
    },
    {
      name: 'postalCode',
      type: 'text',
      required: true,
      admin: {
        description: 'Code postal',
      },
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
        { label: 'Allemagne', value: 'DE' },
        { label: 'Italie', value: 'IT' },
        { label: 'Espagne', value: 'ES' },
        { label: 'Pays-Bas', value: 'NL' },
        { label: 'Autriche', value: 'AT' },
      ],
      admin: {
        description: 'Pays',
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
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Adresse par défaut pour ce type',
      },
    },
    {
      name: 'label',
      type: 'text',
      admin: {
        description: 'Nom personnalisé pour cette adresse (ex: "Maison", "Bureau")',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Si cette adresse est marquée comme par défaut,
        // retirer le statut par défaut des autres adresses du même type
        if (data.isDefault && data.user && data.type) {
          await req.payload.update({
            collection: 'addresses',
            where: {
              and: [
                { user: { equals: data.user } },
                { type: { equals: data.type } },
                { isDefault: { equals: true } },
              ],
            },
            data: {
              isDefault: false,
            },
          })
        }

        return data
      },
    ],
  },
  timestamps: true,
}
