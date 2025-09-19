'use client'

import React from 'react'
import { Leaf } from 'lucide-react'

interface TerraEcoScoreProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
  details?: string[]
  className?: string
}

export const TerraEcoScore: React.FC<TerraEcoScoreProps> = ({
  score,
  size = 'md',
  showDetails = false,
  details = [],
  className,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-terra-green'
    if (score >= 6) return 'text-sage-green'
    if (score >= 4) return 'text-yellow-600'
    return 'text-red-500'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 8) return 'bg-terra-green'
    if (score >= 6) return 'bg-sage-green'
    if (score >= 4) return 'bg-yellow-600'
    return 'bg-red-500'
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  }

  const iconSizes = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-3.5 w-3.5',
  }

  const circumference = 2 * Math.PI * 12 // rayon de 12 pour un cercle compact
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (score / 10) * circumference

  return (
    <div className={`relative group ${className}`}>
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        {/* Cercle de fond */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 28 28">
          <circle
            cx="14"
            cy="14"
            r="12"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="14"
            cy="14"
            r="12"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            className={getScoreColor(score)}
            style={{
              strokeDasharray,
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
            strokeLinecap="round"
          />
        </svg>

        {/* Contenu central */}
        <div className="flex flex-col items-center justify-center gap-0.5">
          <Leaf className={`${iconSizes[size]} ${getScoreColor(score)}`} />
          <span
            className={`font-bold ${getScoreColor(score)} font-terra-display leading-none ${size === 'sm' ? 'text-[8px]' : size === 'md' ? 'text-[10px]' : 'text-[10px]'}`}
          >
            {score.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Tooltip avec détails */}
      {showDetails && details.length > 0 && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          <div className="bg-urban-black text-white text-xs rounded-lg px-3 py-2 min-w-48 shadow-lg">
            <div className="font-semibold mb-1">Éco-score: {score}/10</div>
            <ul className="space-y-1">
              {details.map((detail, index) => (
                <li key={index} className="flex items-center">
                  <Leaf className="h-3 w-3 text-terra-green mr-1 flex-shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
            {/* Flèche */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-urban-black"></div>
          </div>
        </div>
      )}
    </div>
  )
}
