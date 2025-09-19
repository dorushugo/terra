import type { CollectionAfterChangeHook } from 'payload'

export const terraCollectionsData = [
  {
    name: 'TERRA Origin',
    slug: 'origin',
    tagline: 'L\'essentiel réinventé',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'Design minimaliste, matériaux nobles, confort absolu. La collection Origin incarne l\'essence de TERRA : des sneakers intemporelles qui allient simplicité et performance environnementale.'
              }
            ]
          }
        ]
      }
    },
    shortDescription: 'Design minimaliste, matériaux nobles, confort absolu',
    priceRange: {
      from: 139,
      to: 159
    },
    keyFeatures: [
      { feature: 'Cuir Apple premium' },
      { feature: 'Ocean Plastic recyclé' },
      { feature: 'Fabrication portugaise' },
      { feature: 'Design intemporel' }
    ],
    materials: [
      {
        name: 'Cuir Apple',
        description: 'Résidus de jus de pomme transformés en cuir végétal premium',
        sustainabilityBenefit: '100% végétal, biodégradable en fin de vie'
      },
      {
        name: 'Ocean Plastic',
        description: '5 bouteilles plastique océan = 1 paire de sneakers',
        sustainabilityBenefit: 'Nettoyage des océans et économie circulaire'
      },
      {
        name: 'Semelle Recyclée',
        description: '60% caoutchouc recyclé français',
        sustainabilityBenefit: 'Réduction des déchets industriels'
      }
    ],
    craftsmanship: {
      title: 'Savoir-faire portugais',
      description: 'Atelier familial, 3ème génération d\'artisans maroquiniers',
      stats: [
        { stat: '3 générations d\'artisans' },
        { stat: '48h de fabrication' },
        { stat: '15 contrôles qualité' },
        { stat: '100% fait main' }
      ]
    },
    stylingGuide: [
      {
        lookName: 'Casual Urbain',
        description: 'Jean brut, t-shirt blanc, veste en jean'
      },
      {
        lookName: 'Smart Casual',
        description: 'Chino beige, chemise oxford, blazer non structuré'
      },
      {
        lookName: 'Streetwear',
        description: 'Jogger technique, sweat oversize, bomber'
      }
    ],
    order: 1,
    isActive: true,
    _status: 'published'
  },
  {
    name: 'TERRA Move',
    slug: 'move',
    tagline: 'Performance urbaine',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'Conçue pour l\'action, la collection Move combine innovation technique et style urbain. Chaque détail est pensé pour accompagner votre quotidien dynamique avec un impact environnemental minimal.'
              }
            ]
          }
        ]
      }
    },
    shortDescription: 'Innovation technique et style urbain pour un quotidien dynamique',
    priceRange: {
      from: 159,
      to: 179
    },
    keyFeatures: [
      { feature: 'Technologie Boost recyclée' },
      { feature: 'Mesh respirant 100% recyclé' },
      { feature: 'Semelle anti-dérapante' },
      { feature: 'Maintien optimisé' }
    ],
    materials: [
      {
        name: 'Mesh Recyclé',
        description: 'Fibres polyester issues de bouteilles plastique',
        sustainabilityBenefit: 'Réduction de 40% des émissions CO2 vs polyester vierge'
      },
      {
        name: 'Boost Eco',
        description: 'Mousse technique à base de ricin et algues',
        sustainabilityBenefit: 'Biosourcé et biodégradable'
      },
      {
        name: 'Caoutchouc Continental',
        description: 'Semelle haute performance 70% recyclée',
        sustainabilityBenefit: 'Adhérence optimale et durabilité'
      }
    ],
    craftsmanship: {
      title: 'Innovation technique',
      description: 'Développement en partenariat avec des laboratoires européens',
      stats: [
        { stat: '2 ans de R&D' },
        { stat: '50+ prototypes' },
        { stat: '1000 heures de tests' },
        { stat: 'Certifié performance' }
      ]
    },
    stylingGuide: [
      {
        lookName: 'Sport Tech',
        description: 'Legging technique, brassière, veste coupe-vent'
      },
      {
        lookName: 'Urban Active',
        description: 'Short cycliste, crop top, veste bomber'
      },
      {
        lookName: 'Athleisure',
        description: 'Jogger slim, hoodie, doudoune sans manches'
      }
    ],
    order: 2,
    isActive: true,
    _status: 'published'
  },
  {
    name: 'TERRA Limited',
    slug: 'limited',
    tagline: 'Éditions exclusives',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'Créativité sans limite. La collection Limited explore de nouveaux territoires avec des matériaux innovants et des collaborations artistiques uniques, toujours dans le respect de nos valeurs durables.'
              }
            ]
          }
        ]
      }
    },
    shortDescription: 'Créativité sans limite avec matériaux innovants et collaborations exclusives',
    priceRange: {
      from: 179,
      to: 229
    },
    keyFeatures: [
      { feature: 'Matériaux expérimentaux' },
      { feature: 'Série numérotée limitée' },
      { feature: 'Design collaboratif unique' },
      { feature: 'Packaging collector' }
    ],
    materials: [
      {
        name: 'Cuir de Champignon',
        description: 'Mycelium cultivé en laboratoire, alternative au cuir animal',
        sustainabilityBenefit: 'Zéro impact animal, croissance rapide'
      },
      {
        name: 'Fibre d\'Ananas',
        description: 'Piñatex issu des déchets de l\'industrie de l\'ananas',
        sustainabilityBenefit: 'Valorisation des déchets agricoles'
      },
      {
        name: 'Graphène Recyclé',
        description: 'Matériau ultra-léger et résistant issu du recyclage',
        sustainabilityBenefit: 'Performance maximale, impact minimal'
      }
    ],
    craftsmanship: {
      title: 'Collaborations artistiques',
      description: 'Partenariats avec des créateurs engagés pour l\'environnement',
      stats: [
        { stat: '500 paires max par modèle' },
        { stat: 'Numérotées à la main' },
        { stat: 'Packaging zéro déchet' },
        { stat: 'Certificat d\'authenticité' }
      ]
    },
    stylingGuide: [
      {
        lookName: 'Avant-garde',
        description: 'Pièces architecturales, volumes oversize'
      },
      {
        lookName: 'Art Gallery',
        description: 'Tailleur moderne, accessoires statement'
      },
      {
        lookName: 'Creative Studio',
        description: 'Denim vintage, t-shirt graphique, veste workwear'
      }
    ],
    order: 3,
    isActive: true,
    _status: 'published'
  }
]

export const seedTerraCollections: CollectionAfterChangeHook = async ({ req }) => {
  req.payload.logger.info('Seeding TERRA collections...')
  
  for (const collectionData of terraCollectionsData) {
    try {
      const existingCollection = await req.payload.find({
        collection: 'terra-collections',
        where: {
          slug: {
            equals: collectionData.slug
          }
        }
      })

      if (existingCollection.docs.length === 0) {
        await req.payload.create({
          collection: 'terra-collections',
          data: collectionData
        })
        req.payload.logger.info(`Created collection: ${collectionData.name}`)
      }
    } catch (error) {
      req.payload.logger.error(`Error creating collection ${collectionData.name}:`, error)
    }
  }
}
