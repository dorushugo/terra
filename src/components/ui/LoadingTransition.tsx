'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function LoadingTransition() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => setIsLoading(false)

    // Écouter les changements de route
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function (...args) {
      handleStart()
      originalPushState.apply(history, args)
      // Le handleComplete sera appelé par l'effet suivant
    }

    history.replaceState = function (...args) {
      handleStart()
      originalReplaceState.apply(history, args)
      // Le handleComplete sera appelé par l'effet suivant
    }

    return () => {
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
    }
  }, [])

  // Détecter les changements de pathname pour arrêter le loading
  useEffect(() => {
    setIsLoading(false)
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Barre de progression */}
      <div className="h-1 bg-terra-green/20">
        <div className="h-full bg-terra-green animate-pulse" />
      </div>

      {/* Loading overlay optionnel */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
        <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 shadow-lg">
          <div className="w-4 h-4 border-2 border-terra-green border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-terra-body text-gray-600">Chargement...</span>
        </div>
      </div>
    </div>
  )
}

// Composant plus simple pour une barre de progression uniquement
export function ProgressBar() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true)
      setProgress(0)

      // Animation de progression simulée
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + Math.random() * 30
        })
      }, 100)

      return () => clearInterval(interval)
    }

    const handleComplete = () => {
      setProgress(100)
      setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
      }, 200)
    }

    // Écouter les changements de route
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function (...args) {
      handleStart()
      originalPushState.apply(history, args)
    }

    history.replaceState = function (...args) {
      handleStart()
      originalReplaceState.apply(history, args)
    }

    return () => {
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
    }
  }, [])

  useEffect(() => {
    if (isLoading) {
      setProgress(100)
      setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
      }, 200)
    }
  }, [pathname, isLoading])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1">
      <div
        className="h-full bg-gradient-to-r from-terra-green to-sage-green transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
