import { describe, it, expect } from 'vitest'

// Fonctions utilitaires pour les tests (à créer si elles n'existent pas)
const formatPrice = (price: number, currency = '€'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency === '€' ? 'EUR' : 'USD',
  }).format(price)
}

const formatEcoScore = (score: number): { label: string; color: string } => {
  if (score >= 90) return { label: 'Excellent', color: 'green' }
  if (score >= 80) return { label: 'Très bon', color: 'lightgreen' }
  if (score >= 70) return { label: 'Bon', color: 'yellow' }
  if (score >= 60) return { label: 'Moyen', color: 'orange' }
  return { label: 'Faible', color: 'red' }
}

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const calculateShipping = (total: number, country = 'FR'): number => {
  if (total >= 75) return 0 // Free shipping over 75€
  if (country === 'FR') return 7.9
  if (['BE', 'LU', 'NL', 'DE'].includes(country)) return 12.9
  return 19.9 // Rest of Europe
}

describe('Formatters Utilities', () => {
  describe('formatPrice', () => {
    it('should format price in euros', () => {
      const result = formatPrice(139)
      expect(result).toContain('139,00')
      expect(result).toContain('€')

      const result2 = formatPrice(0)
      expect(result2).toContain('0,00')
      expect(result2).toContain('€')
    })

    it('should handle decimal prices', () => {
      const result1 = formatPrice(139.5)
      expect(result1).toContain('139,50')
      expect(result1).toContain('€')

      const result2 = formatPrice(139.99)
      expect(result2).toContain('139,99')
      expect(result2).toContain('€')

      const result3 = formatPrice(139.1)
      expect(result3).toContain('139,10')
      expect(result3).toContain('€')
    })

    it('should handle large numbers', () => {
      const result1 = formatPrice(10000)
      expect(result1).toContain('000,00')
      expect(result1).toContain('€')

      const result2 = formatPrice(123456.78)
      expect(result2).toContain('456,78')
      expect(result2).toContain('€')
    })
  })

  describe('formatEcoScore', () => {
    it('should return correct labels for score ranges', () => {
      expect(formatEcoScore(95)).toEqual({ label: 'Excellent', color: 'green' })
      expect(formatEcoScore(90)).toEqual({ label: 'Excellent', color: 'green' })
      expect(formatEcoScore(85)).toEqual({ label: 'Très bon', color: 'lightgreen' })
      expect(formatEcoScore(80)).toEqual({ label: 'Très bon', color: 'lightgreen' })
      expect(formatEcoScore(75)).toEqual({ label: 'Bon', color: 'yellow' })
      expect(formatEcoScore(70)).toEqual({ label: 'Bon', color: 'yellow' })
      expect(formatEcoScore(65)).toEqual({ label: 'Moyen', color: 'orange' })
      expect(formatEcoScore(60)).toEqual({ label: 'Moyen', color: 'orange' })
      expect(formatEcoScore(50)).toEqual({ label: 'Faible', color: 'red' })
    })

    it('should handle edge cases', () => {
      expect(formatEcoScore(0)).toEqual({ label: 'Faible', color: 'red' })
      expect(formatEcoScore(100)).toEqual({ label: 'Excellent', color: 'green' })
    })
  })

  describe('slugify', () => {
    it('should create valid slugs from product names', () => {
      expect(slugify('TERRA Origin Stone White')).toBe('terra-origin-stone-white')
      expect(slugify('TERRA Move Urban Black')).toBe('terra-move-urban-black')
      expect(slugify('TERRA Limited Clay Orange')).toBe('terra-limited-clay-orange')
    })

    it('should handle special characters and accents', () => {
      expect(slugify('Chaussures été 2024')).toBe('chaussures-ete-2024')
      expect(slugify('Modèle spécial & unique!')).toBe('modele-special-unique')
      expect(slugify('Café noir')).toBe('cafe-noir')
    })

    it('should handle edge cases', () => {
      expect(slugify('')).toBe('')
      expect(slugify('   ')).toBe('')
      expect(slugify('---test---')).toBe('test')
      expect(slugify('Test   Multiple   Spaces')).toBe('test-multiple-spaces')
    })

    it('should handle numbers and mixed content', () => {
      expect(slugify('Product 123')).toBe('product-123')
      expect(slugify('2024 New Collection')).toBe('2024-new-collection')
      expect(slugify('Size 42-43')).toBe('size-42-43')
    })
  })

  describe('calculateShipping', () => {
    it('should return free shipping for orders over 75€', () => {
      expect(calculateShipping(75)).toBe(0)
      expect(calculateShipping(100)).toBe(0)
      expect(calculateShipping(1000)).toBe(0)
    })

    it('should calculate shipping for France', () => {
      expect(calculateShipping(50, 'FR')).toBe(7.9)
      expect(calculateShipping(74.99, 'FR')).toBe(7.9)
    })

    it('should calculate shipping for neighboring countries', () => {
      expect(calculateShipping(50, 'BE')).toBe(12.9)
      expect(calculateShipping(50, 'LU')).toBe(12.9)
      expect(calculateShipping(50, 'NL')).toBe(12.9)
      expect(calculateShipping(50, 'DE')).toBe(12.9)
    })

    it('should calculate shipping for rest of Europe', () => {
      expect(calculateShipping(50, 'IT')).toBe(19.9)
      expect(calculateShipping(50, 'ES')).toBe(19.9)
      expect(calculateShipping(50, 'PT')).toBe(19.9)
    })

    it('should default to France if no country specified', () => {
      expect(calculateShipping(50)).toBe(7.9)
    })

    it('should handle edge cases', () => {
      expect(calculateShipping(0, 'FR')).toBe(7.9)
      expect(calculateShipping(74.99, 'FR')).toBe(7.9)
      expect(calculateShipping(75, 'IT')).toBe(0) // Free shipping applies everywhere
    })
  })
})
