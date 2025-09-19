import { Metadata } from 'next'
import CheckoutSuccessClient from './page.client'

export const metadata: Metadata = {
  title: 'Commande confirmée - TERRA',
  description: 'Votre commande TERRA a été confirmée avec succès',
}

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessClient />
}
