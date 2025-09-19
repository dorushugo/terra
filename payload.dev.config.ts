// Configuration optimisée pour le développement
// Utilisez cette configuration pour éviter les rechargements constants du schema

import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const devOptimizations = {
  // Optimisations de la base de données
  db: {
    // Désactiver la vérification automatique du schema
    disableSchemaValidation: true,
    // Réduire la fréquence des checks de connexion
    pool: {
      max: 5, // Limiter le nombre de connexions
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
  },
  
  // Optimisations de l'admin
  admin: {
    // Désactiver le hot reload de l'admin en développement
    hot: false,
    // Réduire la fréquence de polling
    polling: {
      interval: 5000, // 5 secondes au lieu de 1 seconde par défaut
    },
  },
  
  // Optimisations webpack
  webpack: {
    // Ignorer certains fichiers pour éviter les rechargements
    watchOptions: {
      ignored: [
        '**/node_modules',
        '**/.next',
        '**/migrations',
        '**/build',
        '**/.env*',
      ],
      poll: 2000, // Polling moins fréquent
      aggregateTimeout: 500,
    },
  },
}

// Variables d'environnement recommandées pour le développement
export const recommendedEnvVars = {
  PAYLOAD_DROP_DATABASE: 'false',
  PAYLOAD_DISABLE_ADMIN_HOT_RELOAD: 'true',
  NODE_ENV: 'development',
  // Désactiver les logs de debug pour réduire le bruit
  PAYLOAD_LOG_LEVEL: 'warn',
}
