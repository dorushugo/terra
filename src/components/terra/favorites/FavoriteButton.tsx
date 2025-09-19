'use client'

import React, { useState } from 'react'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/providers/FavoritesProvider'
import { Product } from '@/payload-types'

interface FavoriteButtonProps {
  product: Product
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'floating'
  className?: string
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  product,
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [isAnimating, setIsAnimating] = useState(false)
  const isProductFavorite = isFavorite(product.id)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAnimating(true)
    await toggleFavorite(product)

    setTimeout(() => setIsAnimating(false), 300)
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const baseClasses = `
    ${sizeClasses[size]}
    rounded-full
    flex items-center justify-center
    transition-all duration-300 ease-out
    cursor-pointer
    group
    ${className}
  `

  const variantClasses = {
    default: `
      border-2
      ${
        isProductFavorite
          ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
          : 'bg-white border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500'
      }
    `,
    floating: `
      bg-white/90 backdrop-blur-sm
      border border-white/20
      shadow-lg hover:shadow-xl
      ${isProductFavorite ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}
    `,
  }

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
      title={isProductFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart
        className={`
          ${iconSizes[size]}
          transition-all duration-300
          ${isProductFavorite ? 'fill-current' : ''}
          ${isAnimating ? 'scale-125' : 'scale-100'}
          group-hover:scale-110
        `}
      />

      {/* Animation pulse */}
      {isAnimating && (
        <div className="absolute inset-0 rounded-full border-2 border-red-400 opacity-75" />
      )}
    </button>
  )
}
