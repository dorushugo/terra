'use client'

import React from 'react'

interface OrderDetailPageClientProps {
  orderId: string
}

export default function OrderDetailPageClient({ orderId }: OrderDetailPageClientProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Détail de la Commande #{orderId}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Détails de la commande en cours de développement.</p>
        <a 
          href="/account/orders" 
          className="inline-block mt-4 bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Retour aux commandes
        </a>
      </div>
    </div>
  )
}

