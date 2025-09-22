import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const { productId, collection, limit = 6, offset = 0 } = await request.json()

    if (!productId || !collection) {
      return NextResponse.json({ error: 'Product ID and collection are required' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    const relatedProducts = await payload.find({
      collection: 'products',
      depth: 2,
      limit: Number(limit),
      skip: Number(offset),
      where: {
        and: [
          {
            collection: {
              equals: collection,
            },
          },
          {
            id: {
              not_equals: productId,
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
      sort: '-createdAt', // Sort by newest first
    })

    return NextResponse.json({
      docs: relatedProducts.docs,
      totalDocs: relatedProducts.totalDocs,
      hasNextPage: relatedProducts.hasNextPage,
      hasPrevPage: relatedProducts.hasPrevPage,
      page: relatedProducts.page,
      totalPages: relatedProducts.totalPages,
    })
  } catch (error) {
    console.error('Error fetching related products:', error)
    return NextResponse.json({ error: 'Failed to fetch related products' }, { status: 500 })
  }
}
