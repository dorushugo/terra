'use client'

import React from 'react'

export default function OrdersPageClient() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mes Commandes</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Vous n'avez pas encore de commandes.</p>
        <a 
          href="/products" 
          className="inline-block mt-4 bg-terra-green text-white px-6 py-2 rounded hover:bg-terra-green/90 transition-colors"
        >
          Découvrir nos produits
        </a>
      </div>
    </div>
  )
}

