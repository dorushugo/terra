import type { Endpoint } from 'payload'

const terraCollectionsSeed: Endpoint = {
  path: '/seed/terra-collections',
  method: 'post',
  handler: async (req) => {
    const payload = req.payload

    try {
      // Créer les 3 collections TERRA
      const collections = await Promise.all([
        payload.create({
          collection: 'terra-collections',
          data: {
            name: 'TERRA Origin',
            slug: 'origin',
            tagline: "L'essentiel réinventé",
            description:
              "Design minimaliste, matériaux nobles, confort absolu. La collection Origin incarne l'essence de TERRA : des sneakers intemporelles qui allient simplicité et performance.",
            shortDescription: 'Sneakers minimalistes et intemporelles avec matériaux nobles',
            priceRange: {
              from: 139,
              to: 159,
            },
            _status: 'published',
          },
        }),
        payload.create({
          collection: 'terra-collections',
          data: {
            name: 'TERRA Move',
            slug: 'move',
            tagline: 'Performance urbaine',
            description:
              "Conçue pour l'action, la collection Move combine innovation technique et style urbain. Chaque paire est pensée pour accompagner vos mouvements avec fluidité et conscience.",
            shortDescription: 'Performance technique et style urbain pour un quotidien actif',
            priceRange: {
              from: 159,
              to: 179,
            },
            _status: 'published',
          },
        }),
        payload.create({
          collection: 'terra-collections',
          data: {
            name: 'TERRA Limited',
            slug: 'limited',
            tagline: 'Édition exclusive',
            description:
              "Créations uniques en édition limitée, fruits de collaborations artistiques et d'innovations matériaux. Chaque paire raconte une histoire d'exception et d'engagement.",
            shortDescription:
              'Éditions limitées avec matériaux innovants et collaborations artistiques',
            priceRange: {
              from: 179,
              to: 199,
            },
            _status: 'published',
          },
        }),
      ])

      return Response.json(
        {
          message: 'TERRA Collections seed completed successfully',
          collections: collections.length,
        },
        { status: 200 },
      )
    } catch (error: any) {
      console.error('Error seeding TERRA collections:', error)
      return Response.json(
        {
          message: 'Error seeding TERRA collections',
          error: error.message,
        },
        { status: 500 },
      )
    }
  },
}

export default terraCollectionsSeed
