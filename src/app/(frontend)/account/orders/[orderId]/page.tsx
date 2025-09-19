import { Metadata } from 'next'
import OrderDetailPageClient from './page.client'

export const metadata: Metadata = {
  title: 'Détail de la commande - TERRA',
  description: 'Consultez les détails de votre commande TERRA',
}

interface Props {
  params: Promise<{ orderId: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  const { orderId } = await params
  return <OrderDetailPageClient orderId={orderId} />
}
