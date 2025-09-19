import React from 'react'
import { Metadata } from 'next'
import { FavoritesPageClient } from './page.client'

export default function FavoritesPage() {
  return <FavoritesPageClient />
}

export const metadata: Metadata = {
  title: 'Mes Favoris - TERRA',
  description: 'Retrouvez tous vos produits TERRA favoris. Sneakers écoresponsables ajoutées à votre liste de souhaits.',
  keywords: 'favoris, wishlist, sneakers, TERRA, écoresponsable',
  openGraph: {
    title: 'Mes Favoris - TERRA',
    description: 'Retrouvez tous vos produits TERRA favoris. Sneakers écoresponsables ajoutées à votre liste de souhaits.',
    type: 'website',
  },
}
