import { Metadata } from 'next'
import CheckoutClient from './page.client'

export const metadata: Metadata = {
  title: 'Checkout - TERRA',
  description: 'Finalisez votre commande TERRA',
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
