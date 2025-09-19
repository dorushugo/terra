'use client'

import React from 'react'
import { Leaf, Recycle, Globe, Award } from 'lucide-react'

interface SustainabilityStripProps {
  stats: string[]
  className?: string
}

export const SustainabilityStrip: React.FC<SustainabilityStripProps> = ({
  stats,
  className
}) => {
  const icons = [Recycle, Globe, Leaf, Award]

  return (
    <section className={`py-12 bg-terra-green text-white ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-terra-display font-bold mb-2">
            Notre engagement pour la planète
          </h3>
          <p className="font-terra-body text-white/90">
            Chaque paire TERRA contribue à un avenir plus durable
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = icons[index % icons.length]
            return (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 group-hover:bg-white/20 transition-colors duration-300">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <p className="font-terra-display font-semibold text-lg leading-tight">
                  {stat}
                </p>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm font-terra-body text-white/80">
            Certifié B Corp • Membre de l'initiative Seaqual • Partenaire Reforest'Action
          </p>
        </div>
      </div>
    </section>
  )
}

