import { describe, it, expect } from 'vitest'

// Fonctions de validation (à créer si elles n'existent pas)
const validateEmail = (email: string): boolean => {
  const emailRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9._+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

const validatePhone = (phone: string): boolean => {
  // French phone number validation
  const phoneRegex = /^(?:\+33|0)[1-9](?:[0-9]{8})$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

const validatePostalCode = (postalCode: string, country = 'FR'): boolean => {
  const patterns = {
    FR: /^[0-9]{5}$/,
    BE: /^[0-9]{4}$/,
    DE: /^[0-9]{5}$/,
    IT: /^[0-9]{5}$/,
    ES: /^[0-9]{5}$/,
  }

  const pattern = patterns[country as keyof typeof patterns]
  return pattern ? pattern.test(postalCode) : false
}

const validatePassword = (
  password: string,
): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre')
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

const validateProductData = (
  product: any,
): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []

  if (!product.title || product.title.trim().length === 0) {
    errors.push('Le titre du produit est requis')
  }

  if (!product.price || product.price <= 0) {
    errors.push('Le prix doit être supérieur à 0')
  }

  if (!product.collection || !['origin', 'move', 'limited'].includes(product.collection)) {
    errors.push('La collection doit être origin, move ou limited')
  }

  if (!product.shortDescription || product.shortDescription.trim().length === 0) {
    errors.push('La description courte est requise')
  }

  if (!product.ecoScore || product.ecoScore < 0 || product.ecoScore > 100) {
    errors.push("L'éco-score doit être entre 0 et 100")
  }

  if (!product.sizes || !Array.isArray(product.sizes) || product.sizes.length === 0) {
    errors.push('Au moins une taille doit être définie')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

const validateOrderData = (
  order: any,
): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []

  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    errors.push('La commande doit contenir au moins un article')
  }

  if (!order.customer || !order.customer.email) {
    errors.push("L'email du client est requis")
  }

  if (order.customer?.email && !validateEmail(order.customer.email)) {
    errors.push("L'email du client n'est pas valide")
  }

  if (!order.shippingAddress) {
    errors.push("L'adresse de livraison est requise")
  }

  if (order.shippingAddress && !order.shippingAddress.street) {
    errors.push("La rue de l'adresse de livraison est requise")
  }

  if (order.shippingAddress && !order.shippingAddress.city) {
    errors.push("La ville de l'adresse de livraison est requise")
  }

  if (
    order.shippingAddress &&
    !validatePostalCode(order.shippingAddress.postalCode, order.shippingAddress.country)
  ) {
    errors.push("Le code postal n'est pas valide")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@terra.com')).toBe(true)
      expect(validateEmail('user.name@example.org')).toBe(true)
      expect(validateEmail('contact+newsletter@terra-shoes.com')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@terra.com')).toBe(false)
      expect(validateEmail('test@com')).toBe(false) // No TLD
      expect(validateEmail('')).toBe(false)
      expect(validateEmail('test@.com')).toBe(false) // Starts with dot
    })
  })

  describe('validatePhone', () => {
    it('should validate French phone numbers', () => {
      expect(validatePhone('0123456789')).toBe(true)
      expect(validatePhone('+33123456789')).toBe(true)
      expect(validatePhone('01 23 45 67 89')).toBe(true)
      expect(validatePhone('+33 1 23 45 67 89')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('012345678')).toBe(false) // Too short
      expect(validatePhone('0023456789')).toBe(false) // Starts with 00
      expect(validatePhone('1234567890')).toBe(false) // Doesn't start with 0 or +33
      expect(validatePhone('abcdefghij')).toBe(false) // Not numbers
      expect(validatePhone('')).toBe(false)
    })
  })

  describe('validatePostalCode', () => {
    it('should validate French postal codes', () => {
      expect(validatePostalCode('75001', 'FR')).toBe(true)
      expect(validatePostalCode('13000', 'FR')).toBe(true)
      expect(validatePostalCode('69000', 'FR')).toBe(true)
    })

    it('should validate other European postal codes', () => {
      expect(validatePostalCode('1000', 'BE')).toBe(true)
      expect(validatePostalCode('10115', 'DE')).toBe(true)
      expect(validatePostalCode('20121', 'IT')).toBe(true)
      expect(validatePostalCode('28001', 'ES')).toBe(true)
    })

    it('should reject invalid postal codes', () => {
      expect(validatePostalCode('7500', 'FR')).toBe(false) // Too short
      expect(validatePostalCode('750001', 'FR')).toBe(false) // Too long
      expect(validatePostalCode('ABCDE', 'FR')).toBe(false) // Not numbers
      expect(validatePostalCode('', 'FR')).toBe(false)
    })

    it('should default to French validation', () => {
      expect(validatePostalCode('75001')).toBe(true)
      expect(validatePostalCode('7500')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('Password123!')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject weak passwords', () => {
      const result = validatePassword('weak')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Le mot de passe doit contenir au moins 8 caractères')
      expect(result.errors).toContain('Le mot de passe doit contenir au moins une majuscule')
      expect(result.errors).toContain('Le mot de passe doit contenir au moins un chiffre')
      expect(result.errors).toContain('Le mot de passe doit contenir au moins un caractère spécial')
    })

    it('should check individual requirements', () => {
      expect(validatePassword('password123!').errors).toContain(
        'Le mot de passe doit contenir au moins une majuscule',
      )
      expect(validatePassword('PASSWORD123!').errors).toContain(
        'Le mot de passe doit contenir au moins une minuscule',
      )
      expect(validatePassword('Password!').errors).toContain(
        'Le mot de passe doit contenir au moins un chiffre',
      )
      expect(validatePassword('Password123').errors).toContain(
        'Le mot de passe doit contenir au moins un caractère spécial',
      )
    })
  })

  describe('validateProductData', () => {
    const validProduct = {
      title: 'TERRA Origin Stone White',
      price: 139,
      collection: 'origin',
      shortDescription: 'Sneaker écoresponsable',
      ecoScore: 85,
      sizes: [{ size: '42', availableStock: 10 }],
    }

    it('should validate correct product data', () => {
      const result = validateProductData(validProduct)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject product without required fields', () => {
      const result = validateProductData({})
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Le titre du produit est requis')
      expect(result.errors).toContain('Le prix doit être supérieur à 0')
      expect(result.errors).toContain('La collection doit être origin, move ou limited')
    })

    it('should validate individual fields', () => {
      const invalidProduct = {
        ...validProduct,
        price: -10,
        collection: 'invalid',
        ecoScore: 150,
        sizes: [],
      }

      const result = validateProductData(invalidProduct)
      expect(result.errors).toContain('Le prix doit être supérieur à 0')
      expect(result.errors).toContain('La collection doit être origin, move ou limited')
      expect(result.errors).toContain("L'éco-score doit être entre 0 et 100")
      expect(result.errors).toContain('Au moins une taille doit être définie')
    })
  })

  describe('validateOrderData', () => {
    const validOrder = {
      items: [{ productId: '1', quantity: 1 }],
      customer: { email: 'test@terra.com' },
      shippingAddress: {
        street: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'FR',
      },
    }

    it('should validate correct order data', () => {
      const result = validateOrderData(validOrder)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject order without required fields', () => {
      const result = validateOrderData({})
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('La commande doit contenir au moins un article')
      expect(result.errors).toContain("L'email du client est requis")
      expect(result.errors).toContain("L'adresse de livraison est requise")
    })

    it('should validate email format in customer data', () => {
      const invalidOrder = {
        ...validOrder,
        customer: { email: 'invalid-email' },
      }

      const result = validateOrderData(invalidOrder)
      expect(result.errors).toContain("L'email du client n'est pas valide")
    })

    it('should validate shipping address', () => {
      const invalidOrder = {
        ...validOrder,
        shippingAddress: {
          postalCode: 'INVALID',
          country: 'FR',
        },
      }

      const result = validateOrderData(invalidOrder)
      expect(result.errors).toContain("La rue de l'adresse de livraison est requise")
      expect(result.errors).toContain("La ville de l'adresse de livraison est requise")
      expect(result.errors).toContain("Le code postal n'est pas valide")
    })
  })
})
