'use client'

import React from 'react'
import Image from 'next/image'
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
  return (
    <section
      className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Image de fond sobre */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt="TERRA Hero"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Overlay simple et sobre */}
        <div className="absolute inset-0 bg-urban-black/40" />
      </div>

      {/* Contenu principal minimaliste */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Badge éco simple */}
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-terra-body text-terra-green">
            <Leaf className="h-4 w-4" />
            <span>Sneakers écoresponsables</span>
          </div>

          {/* Titre principal sobre avec Nectarine */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-terra-nectarine text-white leading-tight tracking-wider">
              TERRA
            </h1>
            <p className="text-xl sm:text-2xl font-terra-body text-white/90 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* CTA simple */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-16">
            <Button
              variant="terra"
              size="lg"
              className="bg-terra-green hover:bg-terra-green/90 text-white font-terra-body font-medium px-8 py-4 text-base group transition-all duration-200"
              onClick={handleCtaClick}
            >
              {cta}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-white/60 text-black hover:bg-white hover:text-urban-black font-terra-body font-medium px-8 py-4 text-base transition-all duration-200"
            >
              Notre impact
            </Button>
          </div>

          {/* Statistiques minimalistes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-terra-display font-bold text-white mb-1">
                60%
              </div>
              <div className="text-sm font-terra-body text-white/80">Matériaux recyclés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-terra-display font-bold text-white mb-1">
                100%
              </div>
              <div className="text-sm font-terra-body text-white/80">Fabrication européenne</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-terra-display font-bold text-white mb-1">
                -50%
              </div>
              <div className="text-sm font-terra-body text-white/80">Émissions CO₂</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-terra-display font-bold text-white mb-1">
                3
              </div>
              <div className="text-sm font-terra-body text-white/80">Arbres plantés par paire</div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de scroll simple */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center items-start p-1">
            <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
