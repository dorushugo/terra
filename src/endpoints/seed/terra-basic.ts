import type { Endpoint } from 'payload'

const terraBasicSeed: Endpoint = {
  path: '/seed/terra-basic',
  method: 'post',
  handler: async (req) => {
    const payload = req.payload

    try {
      // 1. Créer un media placeholder d'abord
      const placeholderMedia = await payload.create({
        collection: 'media',
        data: {
          alt: 'Placeholder image',
          filename: 'placeholder.jpg',
        },
        file: {
          name: 'placeholder.jpg',
          data: Buffer.from('fake-image-data'),
          mimetype: 'image/jpeg',
          size: 1000,
        },
      })

      // 2. Créer les produits avec l'image placeholder
      const products = await Promise.all([
        payload.create({
          collection: 'products',
          data: {
            title: 'TERRA Origin Stone White',
            slug: 'terra-origin-stone-white',
            shortDescription: 'Sneaker minimaliste en cuir Apple et matériaux recyclés',
            description: [
              {
                children: [
                  {
                    text: 'La TERRA Origin Stone White incarne notre vision du minimalisme conscient.',
                  },
                ],
              },
            ],
            price: 139,
            collection: 'origin',
            images: [
              {
                image: placeholderMedia.id,
                alt: 'TERRA Origin Stone White - Vue principale',
              },
            ],
            colors: [
              { name: 'Stone White', value: '#F5F5F0' },
              { name: 'Urban Black', value: '#1A1A1A' },
            ],
            sizes: [
              { size: '39', stock: 30, reservedStock: 0, lowStockThreshold: 5 },
              { size: '40', stock: 35, reservedStock: 0, lowStockThreshold: 5 },
              { size: '41', stock: 40, reservedStock: 2, lowStockThreshold: 5 },
              { size: '42', stock: 45, reservedStock: 1, lowStockThreshold: 5 },
            ],
            ecoScore: 8.5,
            featured: true,
            isNewArrival: true,
            _status: 'published',
          },
        }),

        payload.create({
          collection: 'products',
          data: {
            title: 'TERRA Move Clay Orange',
            slug: 'terra-move-clay-orange',
            shortDescription: 'Sneaker technique pour la performance urbaine',
            description: [
              {
                children: [
                  {
                    text: "La TERRA Move Clay Orange est conçue pour l'action urbaine.",
                  },
                ],
              },
            ],
            price: 159,
            collection: 'move',
            images: [
              {
                image: placeholderMedia.id,
                alt: 'TERRA Move Clay Orange - Vue principale',
              },
            ],
            colors: [
              { name: 'Clay Orange', value: '#D4725B' },
              { name: 'Urban Black', value: '#1A1A1A' },
            ],
            sizes: [
              { size: '39', stock: 25, reservedStock: 1, lowStockThreshold: 5 },
              { size: '40', stock: 30, reservedStock: 0, lowStockThreshold: 5 },
              { size: '41', stock: 35, reservedStock: 2, lowStockThreshold: 5 },
              { size: '42', stock: 40, reservedStock: 1, lowStockThreshold: 5 },
            ],
            ecoScore: 9.0,
            featured: true,
            _status: 'published',
          },
        }),

        payload.create({
          collection: 'products',
          data: {
            title: 'TERRA Limited Forest Green',
            slug: 'terra-limited-forest-green',
            shortDescription: 'Édition limitée avec matériaux innovants',
            description: [
              {
                children: [
                  {
                    text: 'La TERRA Limited Forest Green est une création exclusive.',
                  },
                ],
              },
            ],
            price: 179,
            collection: 'limited',
            images: [
              {
                image: placeholderMedia.id,
                alt: 'TERRA Limited Forest Green - Vue principale',
              },
            ],
            colors: [{ name: 'Forest Green', value: '#2D5A27' }],
            sizes: [
              { size: '39', stock: 12, reservedStock: 0, lowStockThreshold: 3 },
              { size: '40', stock: 15, reservedStock: 1, lowStockThreshold: 3 },
              { size: '41', stock: 18, reservedStock: 2, lowStockThreshold: 3 },
              { size: '42', stock: 20, reservedStock: 1, lowStockThreshold: 3 },
            ],
            ecoScore: 8.0,
            featured: true,
            _status: 'published',
          },
        }),
      ])

      return Response.json({
        success: true,
        message: 'TERRA basic seed data created successfully',
        data: {
          media: 1,
          products: products.length,
        },
      })
    } catch (error) {
      console.error('Seed error:', error)
      return Response.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 },
      )
    }
  },
}

export default terraBasicSeed
