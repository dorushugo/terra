// Configuration globale pour les tests Vitest

// Load .env files
import 'dotenv/config'

// Import des utilitaires de test globaux
import { beforeEach, afterEach, vi } from 'vitest'

// Configuration des mocks globaux
beforeEach(() => {
  // Mock de fetch global
  global.fetch = vi.fn()

  // Mock de console pour éviter les logs de test
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  // Nettoyage après chaque test
  vi.clearAllMocks()
  vi.restoreAllMocks()
})

// Mock des variables d'environnement pour les tests
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
