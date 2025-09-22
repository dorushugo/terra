import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const { limit = 6, offset = 0 } = await request.json()

    const payload = await getPayload({ config: configPromise })

    const products = await payload.find({
      collection: 'products',
      limit: Number(limit),
      skip: Number(offset),
      where: {
        isFeatured: {
          equals: true,
        },
        _status: {
          equals: 'published',
        },
      },
      sort: '-createdAt', // Sort by newest first
    })

    return NextResponse.json({
      docs: products.docs,
      totalDocs: products.totalDocs,
      hasNextPage: products.hasNextPage,
      hasPrevPage: products.hasPrevPage,
      page: products.page,
      totalPages: products.totalPages,
    })
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
