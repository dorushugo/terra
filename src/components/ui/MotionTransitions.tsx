'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import React from 'react'

// Variantes d'animation pour différents types de contenu
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as any,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 1.02,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
}

export const heroVariants = {
  initial: {
    opacity: 0,
    y: 40,
    scale: 0.96,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as any,
      delay: 0.2,
    },
  },
}

export const contentVariants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
}

export const cardVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 24,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
}

// Composants d'animation réutilisables
interface MotionPageProps {
  children: React.ReactNode
  className?: string
}

export function MotionPage({ children, className = '' }: MotionPageProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

interface MotionSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  variant?: 'default' | 'hero' | 'content' | 'card'
}

export function MotionSection({
  children,
  className = '',
  delay = 0,
  variant = 'default',
}: MotionSectionProps) {
  const variants = {
    default: contentVariants,
    hero: heroVariants,
    content: contentVariants,
    card: cardVariants,
  }

  return (
    <motion.div
      variants={variants[variant]}
      initial="initial"
      animate="animate"
      className={className}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </motion.div>
  )
}

interface MotionGridProps {
  children: React.ReactNode
  className?: string
  stagger?: boolean
}

export function MotionGrid({ children, className = '', stagger = true }: MotionGridProps) {
  const childrenArray = React.Children.toArray(children)

  return (
    <motion.div
      variants={stagger ? staggerContainer : {}}
      initial="initial"
      animate="animate"
      className={className}
    >
      {childrenArray.map((child, index) => (
        <motion.div key={index} variants={cardVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

interface MotionFadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function MotionFadeIn({ children, className = '', delay = 0 }: MotionFadeInProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className={className}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

// Hook pour les animations au scroll avec Framer Motion
export function useScrollAnimation() {
  const scrollVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  const scrollTransition = {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1] as any,
  }

  return {
    scrollVariants,
    scrollTransition,
    viewport: { once: true, margin: '-50px' },
  }
}

// Animation spéciale pour les images de produit
export const productImageVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
}

// Animation pour les boutons
export const buttonVariants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
}
