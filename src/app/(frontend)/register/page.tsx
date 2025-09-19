import { Metadata } from 'next'
import { RegisterPageClient } from './page.client'

export const metadata: Metadata = {
  title: 'Créer un compte - TERRA',
  description: 'Rejoignez TERRA et créez votre compte pour profiter de toutes nos fonctionnalités.',
}

export default function RegisterPage() {
  return <RegisterPageClient />
}
