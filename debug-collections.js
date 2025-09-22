#!/usr/bin/env node

// Script de debug pour vérifier les collections dans Payload CMS
import { getPayload } from 'payload'
import config from './src/payload.config.ts'

async function debugCollections() {
  try {
    console.log('🔧 Initialisation de Payload...')
    const payload = await getPayload({ config })
    
    console.log('📊 Récupération des collections...')
    const collections = await payload.find({
      collection: 'terra-collections',
      limit: 100,
    })
    
    console.log(`\n✅ ${collections.docs.length} collection(s) trouvée(s):`)
    
    collections.docs.forEach((collection, index) => {
      console.log(`\n--- Collection ${index + 1} ---`)
      console.log(`Nom: ${collection.name}`)
      console.log(`Slug: ${collection.slug}`)
      console.log(`Status: ${collection._status}`)
      console.log(`Hero Image Type: ${typeof collection.heroImage}`)
      
      if (typeof collection.heroImage === 'object' && collection.heroImage) {
        console.log(`Hero Image ID: ${collection.heroImage.id}`)
        console.log(`Hero Image URL: ${collection.heroImage.url}`)
        if (collection.heroImage.sizes) {
          console.log('Tailles disponibles:')
          Object.keys(collection.heroImage.sizes).forEach(size => {
            const sizeData = collection.heroImage.sizes[size]
            if (sizeData?.url) {
              console.log(`  - ${size}: ${sizeData.url}`)
            }
          })
        }
      } else if (typeof collection.heroImage === 'number') {
        console.log(`Hero Image ID (relation): ${collection.heroImage}`)
      } else {
        console.log('Pas d\'image hero')
      }
      
      console.log(`Lifestyle Image Type: ${typeof collection.lifestyleImage}`)
      if (typeof collection.lifestyleImage === 'object' && collection.lifestyleImage) {
        console.log(`Lifestyle Image URL: ${collection.lifestyleImage.url}`)
      }
    })
    
    // Vérifier aussi les médias
    console.log('\n📷 Vérification des médias...')
    const media = await payload.find({
      collection: 'media',
      limit: 10,
    })
    
    console.log(`${media.docs.length} média(s) trouvé(s):`)
    media.docs.forEach((item, index) => {
      console.log(`${index + 1}. ${item.filename || 'Sans nom'} - ${item.url}`)
    })
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
  
  process.exit(0)
}

debugCollections()
