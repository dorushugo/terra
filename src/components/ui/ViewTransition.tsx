'use client'

import { useOptimizedNavigation } from '@/hooks/useOptimizedNavigation'
import { useRef, useEffect } from 'react'

interface ViewTransitionProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
  prefetch?: boolean
  prefetchOnHover?: boolean
  prefetchOnView?: boolean
}

export function ViewTransition({ 
  href, 
  children, 
  className, 
  onClick,
  prefetch = true,
  prefetchOnHover = true,
  prefetchOnView = true
}: ViewTransitionProps) {
  const { navigate, prefetchOnHover: prefetchOnHoverFn, prefetchOnView: prefetchOnViewFn } = useOptimizedNavigation()
  const linkRef = useRef<HTMLAnchorElement>(null)

  // Prefetch au survol si activé
  const handleMouseEnter = () => {
    if (prefetchOnHover) {
      prefetchOnHoverFn(href)
    }
  }

  // Prefetch à la vue si activé
  useEffect(() => {
    if (prefetchOnView && linkRef.current) {
      return prefetchOnViewFn(href, linkRef.current)
    }
  }, [href, prefetchOnView, prefetchOnViewFn])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Si onClick personnalisé est fourni, l'exécuter
    if (onClick) {
      onClick(e)
    }

    // Naviguer avec les optimisations
    navigate(href, { prefetch, transition: true })
  }

  return (
    <a 
      ref={linkRef}
      href={href} 
      onClick={handleClick} 
      onMouseEnter={handleMouseEnter}
      className={className}
    >
      {children}
    </a>
  )
}

// Hook pour utiliser View Transitions programmatiquement (alias pour useOptimizedNavigation)
export function useViewTransition() {
  return useOptimizedNavigation()
}
