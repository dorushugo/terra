// Setup spécifique pour les tests unitaires (environnement jsdom)

// Load .env files
import 'dotenv/config'

// Setup Jest-DOM matchers pour les tests de composants React
import '@testing-library/jest-dom'

// Extend Vitest matchers
import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)
