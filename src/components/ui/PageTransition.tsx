'use client'

import React, { useEffect, useState } from 'react'
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
  animation?: 'page' | 'hero' | 'content' | 'card' | 'text'
  delay?: number
}

export function PageTransition({
  children,
  className = '',
  animation = 'page',
  delay = 0,
}: PageTransitionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const animationClass = mounted ? `${animation}-enter` : ''

  return <div className={`${animationClass} ${className}`}>{children}</div>
}

// Composant pour les animations au scroll
interface RevealOnScrollProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  delay?: number
  as?: keyof JSX.IntrinsicElements
}

export function RevealOnScroll({
  children,
  className = '',
  threshold = 0.1,
  delay = 0,
  as: Component = 'div',
}: RevealOnScrollProps) {
  const elementRef = useRevealOnScroll({ threshold, delay })

  return (
    <Component ref={elementRef} className={`reveal-on-scroll ${className}`}>
      {children}
    </Component>
  )
}

// Composant pour les grilles de produits avec stagger
interface ProductGridProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function ProductGrid({ children, className = '', staggerDelay = 100 }: ProductGridProps) {
  const childrenArray = React.Children.toArray(children)

  return (
    <div className={className}>
      {childrenArray.map((child, index) => {
        const staggerClass = `grid-stagger-${Math.min(index + 1, 6)}`

        return (
          <div key={index} className={`grid-enter ${staggerClass}`}>
            {child}
          </div>
        )
      })}
    </div>
  )
}

// Composant pour les sections avec animation au scroll
interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  titleClassName?: string
  subtitleClassName?: string
}

export function AnimatedSection({
  children,
  className = '',
  title,
  subtitle,
  titleClassName = '',
  subtitleClassName = '',
}: AnimatedSectionProps) {
  return (
    <section className={`${className}`}>
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <RevealOnScroll>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-terra-display font-bold text-urban-black mb-6 ${titleClassName}`}
              >
                {title}
              </h2>
            </RevealOnScroll>
          )}
          {subtitle && (
            <RevealOnScroll delay={100}>
              <p
                className={`text-lg font-terra-body text-gray-600 leading-relaxed max-w-3xl mx-auto ${subtitleClassName}`}
              >
                {subtitle}
              </p>
            </RevealOnScroll>
          )}
        </div>
      )}
      <RevealOnScroll delay={200}>{children}</RevealOnScroll>
    </section>
  )
}
