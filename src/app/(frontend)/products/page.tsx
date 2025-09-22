import type { Metadata } from 'next'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Product } from '@/payload-types'
import { ProductsClient } from './page.client'

export const metadata: Metadata = {
  title: 'Tous nos produits - TERRA',
  description: 'Découvrez notre collection complète de sneakers écoresponsables TERRA',
}

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 100, // Augmentons la limite pour voir plus de produits
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: '-createdAt',
  })

  return <ProductsClient initialProducts={products.docs as Product[]} />
}
