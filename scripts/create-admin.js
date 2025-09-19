#!/usr/bin/env node

import { getPayload } from 'payload'
import configPromise from '../src/payload.config.ts'

async function createAdmin() {
  try {
    console.log('🔄 Connexion à Payload...')
    const payload = await getPayload({ config: configPromise })

    console.log("👤 Création de l'utilisateur admin...")
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'hugodorus@gmail.com',
        password: 'testMDP1234!#',
        firstName: 'Hugo',
        lastName: 'Admin',
        phone: '+33123456789',
      },
    })

    console.log('✅ Utilisateur admin créé avec succès!')
    console.log('📧 Email:', adminUser.email)
    console.log('🔑 Mot de passe: testMDP1234!#')

    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
}

createAdmin()
