'use client'

import React, { useEffect, useState } from 'react'

export default function StockDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/admin/stock-stats')
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        console.error('Erreur lors du chargement:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Gestion des Stocks TERRA</h1>
        <div className="flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span>Chargement des données...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Gestion des Stocks TERRA</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold mb-2">Erreur de chargement</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion des Stocks TERRA</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Produits Total</h3>
          <p className="text-2xl font-bold">{data?.totalProducts || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Stock Faible</h3>
          <p className="text-2xl font-bold text-orange-600">{data?.lowStockProducts || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Ruptures</h3>
          <p className="text-2xl font-bold text-red-600">{data?.outOfStockProducts || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Valeur Stock</h3>
          <p className="text-2xl font-bold text-green-600">
            {data?.stockValue?.toLocaleString('fr-FR') || 0}€
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Données de debug</h2>
        <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  )
}

// Metadata moved to layout.tsx to avoid client component export error
