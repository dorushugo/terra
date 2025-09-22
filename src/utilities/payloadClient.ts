import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Cache pour l'instance payload
let payloadInstance: any = null

/**
 * Obtient une instance réutilisable de Payload pour éviter la création de multiples connexions
 */
export async function getPayloadClient() {
  if (!payloadInstance) {
    payloadInstance = await getPayload({ config: configPromise })
  }
  return payloadInstance
}

/**
 * Exécute une opération Payload avec gestion d'erreur et retry
 */
export async function executePayloadOperation<T>(
  operation: (payload: any) => Promise<T>,
  fallback?: T,
  retries = 1,
): Promise<T> {
  const payload = await getPayloadClient()

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation(payload)
    } catch (error) {
      console.warn(`Tentative ${attempt + 1}/${retries + 1} échouée:`, error)

      if (attempt === retries) {
        if (fallback !== undefined) {
          console.warn('Utilisation de la valeur de fallback')
          return fallback
        }
        throw error
      }

      // Attendre un peu avant de réessayer
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)))
    }
  }

  throw new Error('Toutes les tentatives ont échoué')
}

/**
 * Batch plusieurs opérations pour réduire le nombre de connexions
 */
export async function batchPayloadOperations<T>(
  operations: Array<(payload: any) => Promise<T>>,
  fallbacks: T[] = [],
): Promise<T[]> {
  const payload = await getPayloadClient()

  return Promise.allSettled(operations.map((op) => op(payload))).then((results) =>
    results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value
      } else {
        console.warn(`Opération ${index} échouée:`, result.reason)
        return fallbacks[index] || null
      }
    }),
  )
}
