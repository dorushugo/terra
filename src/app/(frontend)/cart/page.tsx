import React from 'react'
import { Metadata } from 'next'
import { CartPageClient } from './page.client'

export default function CartPage() {
  return <CartPageClient />
}

export const metadata: Metadata = {
  title: 'Panier - TERRA',
  description: 'Votre panier TERRA. Finalisez votre commande de sneakers écoresponsables avec livraison gratuite dès 75€.',
  keywords: 'panier, commande, sneakers, TERRA, écoresponsable, livraison',
  openGraph: {
    title: 'Panier - TERRA',
    description: 'Votre panier TERRA. Finalisez votre commande de sneakers écoresponsables avec livraison gratuite dès 75€.',
    type: 'website',
  },
}
