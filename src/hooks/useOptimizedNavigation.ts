'use client'

import { useRouter } from 'next/navigation'
import { startTransition, useCallback } from 'react'

interface NavigationOptions {
  prefetch?: boolean
  replace?: boolean
  scroll?: boolean
  transition?: boolean
}

export function useOptimizedNavigation() {
  const router = useRouter()

  const navigate = useCallback(
    (href: string, options: NavigationOptions = {}) => {
      const { prefetch = true, replace = false, scroll = true, transition = true } = options

      // Prefetch la route si demandé
      if (prefetch && typeof window !== 'undefined') {
        router.prefetch(href)
      }

      const performNavigation = () => {
        if (replace) {
          router.replace(href, { scroll })
        } else {
          router.push(href, { scroll })
        }
      }

      // Utiliser View Transitions si supporté et demandé
      if (transition && typeof window !== 'undefined' && 'startViewTransition' in document) {
        ;(document as any).startViewTransition(() => {
          startTransition(() => {
            performNavigation()
          })
        })
      } else {
        // Fallback avec React startTransition
        startTransition(() => {
          performNavigation()
        })
      }
    },
    [router],
  )

  // Prefetch intelligent basé sur l'interaction utilisateur
  const prefetchOnHover = useCallback(
    (href: string) => {
      if (typeof window !== 'undefined') {
        // Délai pour éviter les prefetch trop agressifs
        const timeoutId = setTimeout(() => {
          router.prefetch(href)
        }, 100)

        return () => clearTimeout(timeoutId)
      }
    },
    [router],
  )

  // Prefetch basé sur l'intersection observer (quand l'élément est visible)
  const prefetchOnView = useCallback(
    (href: string, element: Element | null) => {
      if (!element || typeof window === 'undefined') return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              router.prefetch(href)
              observer.unobserve(element)
            }
          })
        },
        {
          rootMargin: '50px', // Prefetch quand l'élément est à 50px d'être visible
        },
      )

      observer.observe(element)

      return () => observer.disconnect()
    },
    [router],
  )

  return {
    navigate,
    prefetchOnHover,
    prefetchOnView,
    router,
  }
}
