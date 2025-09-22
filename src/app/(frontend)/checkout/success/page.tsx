import { Metadata } from 'next'
import { Suspense } from 'react'
import CheckoutSuccessClient from './page.client'

export const metadata: Metadata = {
  title: 'Commande confirmée - TERRA',
  description: 'Votre commande TERRA a été confirmée avec succès',
}

export const dynamic = 'force-dynamic'

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="ml-2">Chargement...</span>
        </div>
      </div>
    }>
      <CheckoutSuccessClient />
    </Suspense>
  )
}
