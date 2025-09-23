import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

let payload: Payload
let testUser: any

describe('Authentication API Integration', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  beforeEach(async () => {
    // Nettoyer les utilisateurs de test avant chaque test
    try {
      const existingUsers = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: 'test-auth@terra.com',
          },
        },
      })

      for (const user of existingUsers.docs) {
        await payload.delete({
          collection: 'users',
          id: user.id,
        })
      }
    } catch (error) {
      // Ignore si pas d'utilisateurs à nettoyer
    }
  })

  afterAll(async () => {
    // Nettoyer après tous les tests
    if (testUser) {
      try {
        await payload.delete({
          collection: 'users',
          id: testUser.id,
        })
      } catch (error) {
        // Ignore si déjà supprimé
      }
    }
  })

  it('should create a new user', async () => {
    const userData = {
      email: 'test-auth@terra.com',
      password: 'testPassword123',
      firstName: 'Test',
      lastName: 'User',
      role: 'customer' as const,
    }

    testUser = await payload.create({
      collection: 'users',
      data: userData,
    })

    expect(testUser).toBeDefined()
    expect(testUser.email).toBe(userData.email)
    expect(testUser.firstName).toBe(userData.firstName)
    expect(testUser.lastName).toBe(userData.lastName)
    expect(testUser.role).toBe(userData.role)
    expect(testUser.password).toBeUndefined() // Password should not be returned
  })

  it('should authenticate user with valid credentials', async () => {
    // Créer un utilisateur de test
    testUser = await payload.create({
      collection: 'users',
      data: {
        email: 'test-auth@terra.com',
        password: 'testPassword123',
        firstName: 'Test',
        lastName: 'User',
      },
    })

    // Tenter de se connecter
    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email: 'test-auth@terra.com',
        password: 'testPassword123',
      },
    })

    expect(loginResult.user).toBeDefined()
    expect(loginResult.user.email).toBe('test-auth@terra.com')
    expect(loginResult.token).toBeDefined()
  })

  it('should reject authentication with invalid credentials', async () => {
    // Créer un utilisateur de test
    testUser = await payload.create({
      collection: 'users',
      data: {
        email: 'test-auth@terra.com',
        password: 'testPassword123',
        firstName: 'Test',
        lastName: 'User',
      },
    })

    // Tenter de se connecter avec un mauvais mot de passe
    try {
      await payload.login({
        collection: 'users',
        data: {
          email: 'test-auth@terra.com',
          password: 'wrongPassword',
        },
      })
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.message).toContain('Invalid')
    }
  })

  it('should reject authentication with non-existent user', async () => {
    try {
      await payload.login({
        collection: 'users',
        data: {
          email: 'nonexistent@terra.com',
          password: 'anyPassword',
        },
      })
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.message).toContain('Invalid')
    }
  })

  it('should validate user data before creation', async () => {
    // Test avec email invalide
    try {
      await payload.create({
        collection: 'users',
        data: {
          email: 'invalid-email',
          password: 'testPassword123',
          firstName: 'Test',
          lastName: 'User',
        },
      })
      expect.fail('Should have thrown an error for invalid email')
    } catch (error: any) {
      expect(error.message).toContain('email')
    }
  })

  it('should prevent duplicate email registration', async () => {
    const userData = {
      email: 'test-auth@terra.com',
      password: 'testPassword123',
      firstName: 'Test',
      lastName: 'User',
    }

    // Créer le premier utilisateur
    testUser = await payload.create({
      collection: 'users',
      data: userData,
    })

    // Tenter de créer un deuxième utilisateur avec le même email
    try {
      await payload.create({
        collection: 'users',
        data: userData,
      })
      expect.fail('Should have thrown an error for duplicate email')
    } catch (error: any) {
      expect(error.message).toContain('duplicate')
    }
  })

  it('should update user profile', async () => {
    // Créer un utilisateur de test
    testUser = await payload.create({
      collection: 'users',
      data: {
        email: 'test-auth@terra.com',
        password: 'testPassword123',
        firstName: 'Test',
        lastName: 'User',
      },
    })

    // Mettre à jour le profil
    const updatedUser = await payload.update({
      collection: 'users',
      id: testUser.id,
      data: {
        firstName: 'Updated',
        phone: '+33123456789',
      },
    })

    expect(updatedUser.firstName).toBe('Updated')
    expect(updatedUser.phone).toBe('+33123456789')
    expect(updatedUser.email).toBe('test-auth@terra.com') // Should remain unchanged
  })

  it('should handle password reset flow', async () => {
    // Créer un utilisateur de test
    testUser = await payload.create({
      collection: 'users',
      data: {
        email: 'test-auth@terra.com',
        password: 'testPassword123',
        firstName: 'Test',
        lastName: 'User',
      },
    })

    // Note: Dans un vrai test, on testerait la génération du token de reset
    // et l'API de reset de mot de passe. Pour l'instant, on teste juste
    // la mise à jour du mot de passe
    const updatedUser = await payload.update({
      collection: 'users',
      id: testUser.id,
      data: {
        password: 'newPassword123',
      },
    })

    expect(updatedUser.id).toBe(testUser.id)

    // Vérifier que l'ancien mot de passe ne fonctionne plus
    try {
      await payload.login({
        collection: 'users',
        data: {
          email: 'test-auth@terra.com',
          password: 'testPassword123',
        },
      })
      expect.fail('Should have failed with old password')
    } catch (error) {
      // Expected
    }

    // Vérifier que le nouveau mot de passe fonctionne
    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email: 'test-auth@terra.com',
        password: 'newPassword123',
      },
    })

    expect(loginResult.user.email).toBe('test-auth@terra.com')
  })

  it('should handle user roles correctly', async () => {
    // Créer un utilisateur admin
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@terra.com',
        password: 'adminPassword123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin' as const,
      },
    })

    expect(adminUser.role).toBe('admin')

    // Créer un utilisateur customer
    testUser = await payload.create({
      collection: 'users',
      data: {
        email: 'test-auth@terra.com',
        password: 'testPassword123',
        firstName: 'Test',
        lastName: 'User',
        role: 'customer' as const,
      },
    })

    expect(testUser.role).toBe('customer')

    // Nettoyer l'utilisateur admin
    await payload.delete({
      collection: 'users',
      id: adminUser.id,
    })
  })
})
