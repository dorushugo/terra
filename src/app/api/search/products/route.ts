import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)

    const query = searchParams.get('q')?.trim()
    const limit = parseInt(searchParams.get('limit') || '10')
    const collection = searchParams.get('collection')

    if (!query) {
      return NextResponse.json({ products: [], total: 0 })
    }

    // Construction des conditions de recherche
    const searchConditions: any = {
      and: [
        {
          _status: {
            equals: 'published',
          },
        },
        {
          or: [
            // Recherche dans le titre
            {
              title: {
                contains: query,
              },
            },
            // Recherche dans la description courte
            {
              shortDescription: {
                contains: query,
              },
            },
            // Recherche dans les couleurs
            {
              'colors.name': {
                contains: query,
              },
            },
            // Recherche dans les couleurs (valeur)
            {
              'colors.value': {
                contains: query,
              },
            },
            // Recherche dans les matériaux durables
            {
              'sustainability.materials.name': {
                contains: query,
              },
            },
            // Recherche dans les caractéristiques
            {
              'features.feature': {
                contains: query,
              },
            },
          ],
        },
      ],
    }

    // Filtre par collection si spécifié
    if (collection) {
      searchConditions.and.push({
        collection: {
          equals: collection,
        },
      })
    }

    // Recherche des produits
    const products = await payload.find({
      collection: 'products',
      where: searchConditions,
      limit,
      depth: 2,
      sort: '-createdAt',
    })

    // Améliorer le score de pertinence basé sur la correspondance
    const scoredProducts = products.docs.map((product: any) => {
      let score = 0
      const lowerQuery = query.toLowerCase()
      const title = product.title?.toLowerCase() || ''
      const shortDesc = product.shortDescription?.toLowerCase() || ''

      // Score basé sur la position de la correspondance dans le titre
      if (title.includes(lowerQuery)) {
        if (title.startsWith(lowerQuery)) {
          score += 100 // Correspondance exacte au début
        } else if (title.includes(` ${lowerQuery}`)) {
          score += 80 // Correspondance de mot complet
        } else {
          score += 50 // Correspondance partielle
        }
      }

      // Score pour la description
      if (shortDesc.includes(lowerQuery)) {
        score += 30
      }

      // Score pour les couleurs
      if (
        product.colors?.some(
          (color: any) =>
            color.name?.toLowerCase().includes(lowerQuery) ||
            color.value?.toLowerCase().includes(lowerQuery),
        )
      ) {
        score += 40
      }

      // Score pour la collection
      if (product.collection?.toLowerCase().includes(lowerQuery)) {
        score += 60
      }

      // Score pour les nouveautés et produits mis en avant
      if (product.isNewArrival) score += 10
      if (product.isFeatured) score += 15

      return {
        ...product,
        searchScore: score,
      }
    })

    // Trier par score de pertinence
    scoredProducts.sort((a, b) => b.searchScore - a.searchScore)

    return NextResponse.json({
      products: scoredProducts,
      total: products.totalDocs,
      hasNextPage: products.hasNextPage,
      hasPrevPage: products.hasPrevPage,
      page: products.page,
      totalPages: products.totalPages,
    })
  } catch (error) {
    console.error('Erreur lors de la recherche de produits:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
