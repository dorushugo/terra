'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Leaf } from 'lucide-react'

interface TerraHeroProps {
  title: string
  subtitle: string
  image: string
  cta: string
  className?: string
}

export const TerraHero: React.FC<TerraHeroProps> = ({ title, subtitle, image, cta, className }) => {
  const handleCtaClick = () => {
    document.getElementById('collections')?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  // Variantes d'animation pour les différents éléments
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const fadeInUp = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  }

  const fadeInScale = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  }

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as any,
        delay: 0.2,
      },
    },
  }

  const statsVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.8,
      },
    },
  }

  const statItemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  }

  return (
    <section
      className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Image de fond sobre */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as any }}
      >
        <Image
          src={image}
          alt="TERRA Hero"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Overlay simple et sobre */}
        <motion.div
          className="absolute inset-0 bg-urban-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </motion.div>

      {/* Contenu principal minimaliste */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-12">
          {/* Badge éco simple */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-terra-body text-terra-green"
            variants={fadeInScale}
          >
            <Leaf className="h-4 w-4" />
            <span>Sneakers écoresponsables</span>
          </motion.div>

          {/* Titre principal sobre avec Nectarine */}
          <div className="space-y-6">
            <motion.h1
              className="text-5xl sm:text-7xl lg:text-8xl font-terra-nectarine text-white leading-tight tracking-wider"
              variants={titleVariants}
            >
              TERRA
            </motion.h1>
            <motion.p
              className="text-xl sm:text-2xl font-terra-body text-white/90 max-w-2xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              {subtitle}
            </motion.p>
          </div>

          {/* CTA simple */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-16"
            variants={fadeInUp}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="terra"
                size="lg"
                className="bg-terra-green hover:bg-terra-green/90 text-white font-terra-body font-medium px-8 py-4 text-base group transition-terra-safe"
                onClick={handleCtaClick}
              >
                {cta}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="terra-hero-outline-btn font-terra-body font-medium px-8 py-4 text-base transition-all duration-200"
              >
                Notre impact
              </Button>
            </motion.div>
          </motion.div>

          {/* Statistiques minimalistes */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-8 border-t border-white/20"
            variants={statsVariants}
          >
            <motion.div className="text-center" variants={statItemVariants}>
              <motion.div
                className="text-2xl sm:text-3xl font-terra-display font-bold text-white mb-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 1, type: 'spring', stiffness: 200 }}
              >
                60%
              </motion.div>
              <div className="text-sm font-terra-body text-white/80">Matériaux recyclés</div>
            </motion.div>
            <motion.div className="text-center" variants={statItemVariants}>
              <motion.div
                className="text-2xl sm:text-3xl font-terra-display font-bold text-white mb-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 1.1, type: 'spring', stiffness: 200 }}
              >
                100%
              </motion.div>
              <div className="text-sm font-terra-body text-white/80">Fabrication européenne</div>
            </motion.div>
            <motion.div className="text-center" variants={statItemVariants}>
              <motion.div
                className="text-2xl sm:text-3xl font-terra-display font-bold text-white mb-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2, type: 'spring', stiffness: 200 }}
              >
                -50%
              </motion.div>
              <div className="text-sm font-terra-body text-white/80">Émissions CO₂</div>
            </motion.div>
            <motion.div className="text-center" variants={statItemVariants}>
              <motion.div
                className="text-2xl sm:text-3xl font-terra-display font-bold text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 1.3, type: 'spring', stiffness: 200 }}
              >
                3
              </motion.div>
              <div className="text-sm font-terra-body text-white/80">Arbres plantés par paire</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Indicateur de scroll simple */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <motion.div
          className="animate-bounce"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center items-start p-1 cursor-pointer">
            <motion.div
              className="w-1 h-3 bg-white/70 rounded-full"
              animate={{
                y: [0, 8, 0],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
