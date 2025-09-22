import { Metadata } from 'next'
import OrdersPageClient from './page.client'

export const metadata: Metadata = {
  title: 'Mes commandes - TERRA',
  description: "Consultez l'historique de vos commandes TERRA",
}

export default function OrdersPage() {
  return <OrdersPageClient />
}

