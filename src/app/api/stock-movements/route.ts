import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)

    // Construire les options de requête
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const sort = searchParams.get('sort') || '-createdAt'

    // Parser les conditions where depuis les paramètres URL
    const whereConditions: any = {}

    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('where[')) {
        const match = key.match(/where\[(.+?)\]\[(.+?)\]/)
        if (match) {
          const [, field, operator] = match
          if (!whereConditions[field]) whereConditions[field] = {}
          whereConditions[field][operator] =
            value === 'false' ? false : value === 'true' ? true : value
        }
      }
    }

    const movements = await payload.find({
      collection: 'stock-movements',
      limit,
      page,
      sort,
      where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
      depth: 2, // Pour récupérer les données des relations (produit, etc.)
    })

    return NextResponse.json(movements)
  } catch (error) {
    console.error('Erreur lors de la récupération des mouvements de stock:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const data = await request.json()

    const movement = await payload.create({
      collection: 'stock-movements',
      data,
    })

    return NextResponse.json(movement)
  } catch (error) {
    console.error('Erreur lors de la création du mouvement de stock:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
