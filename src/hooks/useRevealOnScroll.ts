'use client'

import { useEffect, useRef } from 'react'

interface RevealOnScrollOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
}

export function useRevealOnScroll(options: RevealOnScrollOptions = {}) {
  const elementRef = useRef<HTMLElement>(null)
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
  } = options

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Vérifier si l'utilisateur préfère un mouvement réduit
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      element.classList.add('revealed')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => {
                element.classList.add('revealed')
              }, delay)
            } else {
              element.classList.add('revealed')
            }

            if (triggerOnce) {
              observer.unobserve(element)
            }
          } else if (!triggerOnce) {
            element.classList.remove('revealed')
          }
        })
      },
      {
        threshold,
        rootMargin,
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce, delay])

  return elementRef
}

// Hook pour animer une liste d'éléments avec un stagger
export function useStaggerReveal(count: number, baseDelay: number = 100) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = Array.from(container.children) as HTMLElement[]
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add('revealed')
              }, index * baseDelay)
            })
            observer.unobserve(container)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      },
    )

    observer.observe(container)

    return () => observer.disconnect()
  }, [count, baseDelay])

  return containerRef
}
