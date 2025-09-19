import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { TerraProductCard } from '@/components/terra/TerraProductCard'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Product } from '@/payload-types'
import { ProductPageClient } from './page.client'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProductPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const product = products.docs?.[0] as Product

  if (!product) {
    return notFound()
  }

  // Produits similaires
  const relatedProducts = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 4,
    where: {
      and: [
        {
          collection: {
            equals: product.collection,
          },
        },
        {
          id: {
            not_equals: product.id,
          },
        },
      ],
    },
  })

  return <ProductPageClient product={product} relatedProducts={relatedProducts.docs as Product[]} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const product = products.docs?.[0]

  if (!product) {
    return {
      title: 'Produit non trouvé - TERRA',
    }
  }

  return {
    title: `${product.title} - TERRA`,
    description: product.shortDescription || product.description,
    openGraph: {
      title: `${product.title} - TERRA`,
      description: product.shortDescription,
      images:
        product.images?.[0] && typeof product.images[0].image === 'object'
          ? [product.images[0].image.url || '']
          : [],
    },
  }
}
