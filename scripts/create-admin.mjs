#!/usr/bin/env node

import { spawn } from 'child_process'

async function createAdminViaAPI() {
  console.log("🔄 Création de l'admin via API...")

  const userData = {
    email: 'hugodorus@gmail.com',
    password: 'testMDP1234!#',
    firstName: 'Hugo',
    lastName: 'Admin',
    phone: '+33123456789',
  }

  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✅ Utilisateur admin créé avec succès!')
      console.log('📧 Email:', result.doc.email)
      console.log('🔑 Mot de passe: testMDP1234!#')
    } else {
      const error = await response.text()
      console.error('❌ Erreur:', error)
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message)
    console.log('💡 Assurez-vous que le serveur est démarré sur http://localhost:3000')
  }
}

createAdminViaAPI()
