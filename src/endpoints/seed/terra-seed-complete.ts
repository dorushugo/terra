import type { Endpoint } from 'payload'

const terraCompleteData: Endpoint = {
  path: '/seed/terra-complete',
  method: 'post',
  handler: async (req) => {
    const payload = req.payload

    try {
      // 1. Créer les collections TERRA
      const collections = await Promise.all([
        payload.create({
          collection: 'terra-collections',
          data: {
            name: 'TERRA Origin',
            slug: 'origin',
            tagline: "L'essentiel réinventé",
            description: [
              {
                children: [
                  {
                    text: "Design minimaliste, matériaux nobles, confort absolu. La collection Origin incarne l'essence de TERRA : des sneakers intemporelles qui allient simplicité et performance.",
                  },
                ],
              },
            ],
            shortDescription: "L'essence du minimalisme conscient avec des matériaux durables",
            priceRange: {
              from: 139,
              to: 159,
            },
            keyFeatures: [
              { feature: 'Cuir Apple innovant' },
              { feature: 'Ocean Plastic recyclé' },
              { feature: 'Fabrication européenne' },
              { feature: 'Design intemporel' },
            ],
            _status: 'published',
          },
        }),
        payload.create({
          collection: 'terra-collections',
          data: {
            name: 'TERRA Move',
            slug: 'move',
            tagline: 'Performance urbaine',
            description: [
              {
                children: [
                  {
                    text: "Conçue pour l'action, la collection Move combine innovation technique et style urbain. Chaque détail est pensé pour accompagner votre quotidien dynamique.",
                  },
                ],
              },
            ],
            shortDescription: 'Performance technique et style urbain pour un quotidien actif',
            priceRange: {
              from: 159,
              to: 179,
            },
            keyFeatures: [
              { feature: 'Semelle technique avancée' },
              { feature: 'Mesh respirant recyclé' },
              { feature: 'Maintien optimisé' },
              { feature: 'Résistance urbaine' },
            ],
            _status: 'published',
          },
        }),
        payload.create({
          collection: 'terra-collections',
          data: {
            name: 'TERRA Limited',
            slug: 'limited',
            tagline: 'Éditions exclusives',
            description: [
              {
                children: [
                  {
                    text: 'Créativité sans limite. La collection Limited explore de nouveaux territoires avec des matériaux innovants et des collaborations artistiques uniques.',
                  },
                ],
              },
            ],
            shortDescription:
              'Éditions limitées avec matériaux innovants et collaborations artistiques',
            priceRange: {
              from: 179,
              to: 199,
            },
            keyFeatures: [
              { feature: 'Série numérotée' },
              { feature: 'Matériaux innovants' },
              { feature: 'Collaboration artiste' },
              { feature: 'Design exclusif' },
            ],
            _status: 'published',
          },
        }),
      ])

      // 2. Créer les produits avec les bonnes relations
      const products = await Promise.all([
        // TERRA Origin Products
        payload.create({
          collection: 'products',
          data: {
            title: 'TERRA Origin Stone White',
            slug: 'terra-origin-stone-white',
            shortDescription:
              'Sneaker minimaliste en cuir Apple et matériaux recyclés. Design intemporel pour un style urbain conscient.',
            description: [
              {
                children: [
                  {
                    text: 'La TERRA Origin Stone White incarne notre vision du minimalisme conscient. Confectionnée avec du cuir Apple innovant et des matériaux océaniques recyclés, cette sneaker allie esthétique épurée et performance durable.',
                  },
                ],
              },
            ],
            price: 139,
            originalPrice: 159,
            collection: 'origin',
            colors: [
              { name: 'Stone White', value: '#F5F5F0' },
              { name: 'Urban Black', value: '#1A1A1A' },
              { name: 'Sage Green', value: '#9CAF88' },
            ],
            sizes: [
              { size: '36', stock: 15, reservedStock: 0, lowStockThreshold: 5 },
              { size: '37', stock: 20, reservedStock: 2, lowStockThreshold: 5 },
              { size: '38', stock: 25, reservedStock: 1, lowStockThreshold: 5 },
              { size: '39', stock: 30, reservedStock: 3, lowStockThreshold: 5 },
              { size: '40', stock: 35, reservedStock: 0, lowStockThreshold: 5 },
              { size: '41', stock: 40, reservedStock: 5, lowStockThreshold: 5 },
              { size: '42', stock: 45, reservedStock: 2, lowStockThreshold: 5 },
              { size: '43', stock: 30, reservedStock: 1, lowStockThreshold: 5 },
              { size: '44', stock: 20, reservedStock: 0, lowStockThreshold: 5 },
              { size: '45', stock: 15, reservedStock: 1, lowStockThreshold: 5 },
            ],
            ecoScore: 8.5,
            sustainability: {
              materials: [
                { name: 'Cuir Apple', percentage: 40 },
                { name: 'Ocean Plastic', percentage: 25 },
                { name: 'Coton bio', percentage: 20 },
                { name: 'Caoutchouc recyclé', percentage: 15 },
              ],
              certifications: ['GOTS', 'Cradle to Cradle'],
              carbonFootprint: 2.1,
              recycledContent: 65,
            },
            featured: true,
            isNewArrival: true,
            _status: 'published',
          },
        }),

        payload.create({
          collection: 'products',
          data: {
            title: 'TERRA Origin Urban Black',
            slug: 'terra-origin-urban-black',
            shortDescription:
              'Version noire de notre bestseller Origin. Élégance urbaine et matériaux durables pour un look sophistiqué.',
            description: [
              {
                children: [
                  {
                    text: "La TERRA Origin Urban Black apporte une touche d'élégance urbaine à notre design iconique. Même engagement durable, même confort premium, dans une version plus sophistiquée.",
                  },
                ],
              },
            ],
            price: 139,
            collection: 'origin',
            colors: [
              { name: 'Urban Black', value: '#1A1A1A' },
              { name: 'Stone White', value: '#F5F5F0' },
            ],
            sizes: [
              { size: '36', stock: 12, reservedStock: 1, lowStockThreshold: 5 },
              { size: '37', stock: 18, reservedStock: 0, lowStockThreshold: 5 },
              { size: '38', stock: 22, reservedStock: 2, lowStockThreshold: 5 },
              { size: '39', stock: 28, reservedStock: 1, lowStockThreshold: 5 },
              { size: '40', stock: 32, reservedStock: 3, lowStockThreshold: 5 },
              { size: '41', stock: 38, reservedStock: 2, lowStockThreshold: 5 },
              { size: '42', stock: 42, reservedStock: 4, lowStockThreshold: 5 },
              { size: '43', stock: 28, reservedStock: 0, lowStockThreshold: 5 },
              { size: '44', stock: 18, reservedStock: 1, lowStockThreshold: 5 },
              { size: '45', stock: 12, reservedStock: 0, lowStockThreshold: 5 },
            ],
            ecoScore: 8.5,
            sustainability: {
              materials: [
                { name: 'Cuir Apple', percentage: 40 },
                { name: 'Ocean Plastic', percentage: 25 },
                { name: 'Coton bio', percentage: 20 },
                { name: 'Caoutchouc recyclé', percentage: 15 },
              ],
              certifications: ['GOTS', 'Cradle to Cradle'],
              carbonFootprint: 2.1,
              recycledContent: 65,
            },
            featured: true,
            _status: 'published',
          },
        }),

        // TERRA Move Products
        payload.create({
          collection: 'products',
          data: {
            title: 'TERRA Move Clay Orange',
            slug: 'terra-move-clay-orange',
            shortDescription:
              'Sneaker technique pour la performance urbaine. Mesh respirant recyclé et semelle anti-dérapante.',
            description: [
              {
                children: [
                  {
                    text: "La TERRA Move Clay Orange est conçue pour l'action. Avec sa semelle technique et ses matériaux haute performance, elle accompagne tous vos mouvements urbains avec style et conscience.",
                  },
                ],
              },
            ],
            price: 159,
            collection: 'move',
            colors: [
              { name: 'Clay Orange', value: '#D4725B' },
              { name: 'Urban Black', value: '#1A1A1A' },
              { name: 'Stone Gray', value: '#8E8E93' },
            ],
            sizes: [
              { size: '36', stock: 10, reservedStock: 0, lowStockThreshold: 5 },
              { size: '37', stock: 15, reservedStock: 1, lowStockThreshold: 5 },
              { size: '38', stock: 20, reservedStock: 0, lowStockThreshold: 5 },
              { size: '39', stock: 25, reservedStock: 2, lowStockThreshold: 5 },
              { size: '40', stock: 30, reservedStock: 1, lowStockThreshold: 5 },
              { size: '41', stock: 35, reservedStock: 3, lowStockThreshold: 5 },
              { size: '42', stock: 40, reservedStock: 2, lowStockThreshold: 5 },
              { size: '43', stock: 25, reservedStock: 1, lowStockThreshold: 5 },
              { size: '44', stock: 15, reservedStock: 0, lowStockThreshold: 5 },
              { size: '45', stock: 10, reservedStock: 0, lowStockThreshold: 5 },
            ],
            ecoScore: 9.0,
            sustainability: {
              materials: [
                { name: 'Mesh recyclé', percentage: 45 },
                { name: 'Ocean Plastic', percentage: 30 },
                { name: 'Caoutchouc bio', percentage: 25 },
              ],
              certifications: ['GOTS', 'Fair Trade'],
              carbonFootprint: 1.8,
              recycledContent: 70,
            },
            featured: true,
            isNewArrival: true,
            _status: 'published',
          },
        }),

        // TERRA Limited Products
        payload.create({
          collection: 'products',
          data: {
            title: 'TERRA Limited Forest Green',
            slug: 'terra-limited-forest-green',
            shortDescription:
              'Édition limitée en collaboration avec un artiste local. Design unique et matériaux innovants.',
            description: [
              {
                children: [
                  {
                    text: "La TERRA Limited Forest Green est une création exclusive en édition limitée. Chaque paire est numérotée et représente l'innovation créative de notre démarche durable.",
                  },
                ],
              },
            ],
            price: 179,
            originalPrice: 199,
            collection: 'limited',
            colors: [
              { name: 'Forest Green', value: '#2D5A27' },
              { name: 'Clay Orange', value: '#D4725B' },
            ],
            sizes: [
              { size: '36', stock: 5, reservedStock: 0, lowStockThreshold: 3 },
              { size: '37', stock: 8, reservedStock: 1, lowStockThreshold: 3 },
              { size: '38', stock: 10, reservedStock: 0, lowStockThreshold: 3 },
              { size: '39', stock: 12, reservedStock: 2, lowStockThreshold: 3 },
              { size: '40', stock: 15, reservedStock: 1, lowStockThreshold: 3 },
              { size: '41', stock: 18, reservedStock: 3, lowStockThreshold: 3 },
              { size: '42', stock: 20, reservedStock: 2, lowStockThreshold: 3 },
              { size: '43', stock: 12, reservedStock: 1, lowStockThreshold: 3 },
              { size: '44', stock: 8, reservedStock: 0, lowStockThreshold: 3 },
              { size: '45', stock: 5, reservedStock: 0, lowStockThreshold: 3 },
            ],
            ecoScore: 8.0,
            sustainability: {
              materials: [
                { name: 'Cuir végétal', percentage: 50 },
                { name: 'Fibres innovantes', percentage: 30 },
                { name: 'Ocean Plastic', percentage: 20 },
              ],
              certifications: ['B Corp', 'Cradle to Cradle'],
              carbonFootprint: 2.3,
              recycledContent: 60,
            },
            featured: false,
            isNewArrival: true,
            _status: 'published',
          },
        }),

        // Produit en rupture pour tester
        payload.create({
          collection: 'products',
          data: {
            title: 'TERRA Move Urban Black',
            slug: 'terra-move-urban-black',
            shortDescription:
              'Version noire de notre Move technique. Performance et style urbain en parfaite harmonie.',
            price: 159,
            collection: 'move',
            colors: [{ name: 'Urban Black', value: '#1A1A1A' }],
            sizes: [
              { size: '36', stock: 0, reservedStock: 0, lowStockThreshold: 5 },
              { size: '37', stock: 2, reservedStock: 1, lowStockThreshold: 5 },
              { size: '38', stock: 1, reservedStock: 0, lowStockThreshold: 5 },
              { size: '39', stock: 0, reservedStock: 0, lowStockThreshold: 5 },
              { size: '40', stock: 3, reservedStock: 2, lowStockThreshold: 5 },
              { size: '41', stock: 0, reservedStock: 0, lowStockThreshold: 5 },
              { size: '42', stock: 2, reservedStock: 1, lowStockThreshold: 5 },
              { size: '43', stock: 0, reservedStock: 0, lowStockThreshold: 5 },
              { size: '44', stock: 1, reservedStock: 0, lowStockThreshold: 5 },
              { size: '45', stock: 0, reservedStock: 0, lowStockThreshold: 5 },
            ],
            ecoScore: 9.0,
            sustainability: {
              materials: [
                { name: 'Mesh recyclé', percentage: 45 },
                { name: 'Ocean Plastic', percentage: 30 },
                { name: 'Caoutchouc bio', percentage: 25 },
              ],
              certifications: ['GOTS', 'Fair Trade'],
              carbonFootprint: 1.8,
              recycledContent: 70,
            },
            featured: false,
            _status: 'published',
          },
        }),
      ])

      // 3. Lier les produits aux collections
      for (let i = 0; i < collections.length; i++) {
        const collection = collections[i]
        const relatedProducts = products.filter((product) => {
          if (i === 0) return product.collection === 'origin' // Origin
          if (i === 1) return product.collection === 'move' // Move
          if (i === 2) return product.collection === 'limited' // Limited
          return false
        })

        await payload.update({
          collection: 'terra-collections',
          id: collection.id,
          data: {
            products: relatedProducts.map((p) => p.id),
          },
        })
      }

      return Response.json({
        success: true,
        message: 'TERRA seed data created successfully',
        data: {
          collections: collections.length,
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

export default terraCompleteData
