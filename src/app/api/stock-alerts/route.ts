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

    // Exemple: ?where[isResolved][equals]=false
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

    const alerts = await payload.find({
      collection: 'stock-alerts',
      limit,
      page,
      sort,
      where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
    })

    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Erreur lors de la récupération des alertes de stock:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
