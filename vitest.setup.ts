// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'

// Setup Jest-DOM matchers
import '@testing-library/jest-dom'

// Extend Vitest matchers
import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)
