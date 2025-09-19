import type { Metadata } from 'next'
import { AccountPageClient } from './page.client'

export const metadata: Metadata = {
  title: 'Mon compte - TERRA',
  description: 'Gérez votre compte TERRA, vos commandes et vos informations personnelles',
}

export default function AccountPage() {
  return <AccountPageClient />
}
