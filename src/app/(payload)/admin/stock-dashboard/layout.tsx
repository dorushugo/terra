import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestion des Stocks - TERRA Admin',
  description: 'Dashboard de gestion des stocks et inventaires TERRA',
}

export default function StockDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

