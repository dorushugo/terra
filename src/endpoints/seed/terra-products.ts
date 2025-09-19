import type { CollectionAfterChangeHook } from 'payload'

export const terraProductsData = [
  // TERRA Origin Products
  {
    title: 'TERRA Origin Stone White',
    slug: 'terra-origin-stone-white',
    collection: 'origin',
    price: 139,
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'La sneaker qui redéfinit l\'essentiel. Conçue avec du cuir Apple premium et une semelle Ocean Plastic, la TERRA Origin Stone White incarne notre vision d\'un style minimaliste et responsable.'
              }
            ]
          }
        ]
      }
    },
    shortDescription: 'Sneaker minimaliste en cuir Apple et Ocean Plastic, l\'essentiel réinventé',
    colors: [
      {
        name: 'Stone White',
        value: '#F5F5F0'
      },
      {
        name: 'Urban Black',
        value: '#1A1A1A'
      },
      {
        name: 'Sage Green',
        value: '#9CAF88'
      }
    ],
    sizes: [
      { size: '39', stock: 15 },
      { size: '40', stock: 20 },
      { size: '41', stock: 18 },
      { size: '42', stock: 25 },
      { size: '43', stock: 22 },
      { size: '44', stock: 12 },
      { size: '45', stock: 8 }
    ],
    ecoScore: 8.5,
    sustainability: {
      materials: [
        {
          name: 'Cuir Apple',
          description: 'Résidus de jus de pomme transformés en cuir végétal',
          sustainabilityBenefit: '100% végétal, biodégradable',
          percentage: 40
        },
        {
          name: 'Ocean Plastic',
          description: '5 bouteilles recyclées par paire',
          sustainabilityBenefit: 'Nettoyage des océans',
          percentage: 35
        },
        {
          name: 'Caoutchouc Recyclé',
          description: 'Semelle 60% recyclée française',
          sustainabilityBenefit: 'Économie circulaire',
          percentage: 25
        }
      ],
      carbonFootprint: 2.1,
      recycledContent: 65
    },
    features: [
      { feature: 'Livraison gratuite dès 80€' },
      { feature: 'Retours 30 jours' },
      { feature: 'Garantie 2 ans' },
      { feature: 'Fabrication européenne' },
      { feature: 'Matériaux certifiés' }
    ],
    isFeatured: true,
    isNewArrival: false,
    _status: 'published'
  },
  {
    title: 'TERRA Origin Urban Black',
    slug: 'terra-origin-urban-black',
    collection: 'origin',
    price: 139,
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'L\'élégance urbaine à l\'état pur. Cette version noire de notre modèle phare Origin s\'adapte à tous les styles tout en conservant notre engagement environnemental.'
              }
            ]
          }
        ]
      }
    },
    shortDescription: 'Version urbaine de notre Origin, polyvalente et intemporelle',
    colors: [
      {
        name: 'Urban Black',
        value: '#1A1A1A'
      },
      {
        name: 'Stone White',
        value: '#F5F5F0'
      }
    ],
    sizes: [
      { size: '38', stock: 10 },
      { size: '39', stock: 18 },
      { size: '40', stock: 22 },
      { size: '41', stock: 20 },
      { size: '42', stock: 28 },
      { size: '43', stock: 25 },
      { size: '44', stock: 15 }
    ],
    ecoScore: 8.5,
    sustainability: {
      materials: [
        {
          name: 'Cuir Apple',
          description: 'Cuir végétal premium teinté naturellement',
          sustainabilityBenefit: 'Teinture sans métaux lourds',
          percentage: 40
        },
        {
          name: 'Ocean Plastic',
          description: 'Plastique océan recyclé',
          sustainabilityBenefit: 'Impact positif sur l\'environnement marin',
          percentage: 35
        }
      ],
      carbonFootprint: 2.0,
      recycledContent: 65
    },
    features: [
      { feature: 'Polyvalence maximale' },
      { feature: 'Teinture naturelle' },
      { feature: 'Résistant aux taches' },
      { feature: 'Confort longue durée' }
    ],
    isFeatured: true,
    isNewArrival: false,
    _status: 'published'
  },
  // TERRA Move Products
  {
    title: 'TERRA Move Clay Orange',
    slug: 'terra-move-clay-orange',
    collection: 'move',
    price: 159,
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'Performance et style se rencontrent dans cette sneaker technique. Conçue pour l\'action avec des matériaux innovants recyclés et une technologie de pointe.'
              }
            ]
          }
        ]
      }
    },
    shortDescription: 'Sneaker technique haute performance avec matériaux recyclés innovants',
    colors: [
      {
        name: 'Clay Orange',
        value: '#D4725B'
      },
      {
        name: 'Stone Gray',
        value: '#708090'
      }
    ],
    sizes: [
      { size: '37', stock: 8 },
      { size: '38', stock: 15 },
      { size: '39', stock: 20 },
      { size: '40', stock: 25 },
      { size: '41', stock: 23 },
      { size: '42', stock: 30 },
      { size: '43', stock: 20 }
    ],
    ecoScore: 9.0,
    sustainability: {
      materials: [
        {
          name: 'Mesh Recyclé',
          description: 'Fibres polyester issues de bouteilles plastique',
          sustainabilityBenefit: 'Réduction de 40% des émissions CO2',
          percentage: 50
        },
        {
          name: 'Boost Eco',
          description: 'Mousse technique biosourcée',
          sustainabilityBenefit: 'Matière première renouvelable',
          percentage: 30
        }
      ],
      carbonFootprint: 1.8,
      recycledContent: 70
    },
    features: [
      { feature: 'Technologie Boost recyclée' },
      { feature: 'Respirabilité optimale' },
      { feature: 'Adhérence tout-terrain' },
      { feature: 'Maintien du pied' },
      { feature: 'Séchage rapide' }
    ],
    isFeatured: true,
    isNewArrival: true,
    _status: 'published'
  },
  // TERRA Limited Products
  {
    title: 'TERRA Limited x Artist Edition',
    slug: 'terra-limited-artist-edition',
    collection: 'limited',
    price: 199,
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'Collaboration exclusive avec l\'artiste éco-conscient Maya Chen. Cette édition limitée explore les frontières du design durable avec des matériaux révolutionnaires.'
              }
            ]
          }
        ]
      }
    },
    shortDescription: 'Édition limitée collaborative avec matériaux révolutionnaires',
    colors: [
      {
        name: 'Terra Green',
        value: '#2D5A27'
      },
      {
        name: 'Unique Pattern',
        value: '#4A5D23'
      }
    ],
    sizes: [
      { size: '39', stock: 3 },
      { size: '40', stock: 5 },
      { size: '41', stock: 4 },
      { size: '42', stock: 8 },
      { size: '43', stock: 6 },
      { size: '44', stock: 2 }
    ],
    ecoScore: 8.0,
    sustainability: {
      materials: [
        {
          name: 'Cuir de Champignon',
          description: 'Mycelium cultivé en laboratoire',
          sustainabilityBenefit: 'Alternative révolutionnaire au cuir animal',
          percentage: 45
        },
        {
          name: 'Fibre d\'Ananas',
          description: 'Piñatex issu des déchets agricoles',
          sustainabilityBenefit: 'Valorisation des déchets',
          percentage: 35
        }
      ],
      carbonFootprint: 2.5,
      recycledContent: 60
    },
    features: [
      { feature: 'Série limitée à 500 exemplaires' },
      { feature: 'Numérotation à la main' },
      { feature: 'Packaging collector' },
      { feature: 'Certificat d\'authenticité' },
      { feature: 'Matériaux expérimentaux' }
    ],
    isFeatured: true,
    isNewArrival: true,
    _status: 'published'
  }
]

export const seedTerraProducts: CollectionAfterChangeHook = async ({ req }) => {
  req.payload.logger.info('Seeding TERRA products...')
  
  for (const productData of terraProductsData) {
    try {
      const existingProduct = await req.payload.find({
        collection: 'products',
        where: {
          slug: {
            equals: productData.slug
          }
        }
      })

      if (existingProduct.docs.length === 0) {
        await req.payload.create({
          collection: 'products',
          data: productData
        })
        req.payload.logger.info(`Created product: ${productData.title}`)
      }
    } catch (error) {
      req.payload.logger.error(`Error creating product ${productData.title}:`, error)
    }
  }
}
