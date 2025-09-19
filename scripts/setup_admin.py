#!/usr/bin/env python3
"""
Script pour créer un utilisateur admin dans Payload CMS
Nécessaire avant d'utiliser l'importer
"""

import requests
import json

PAYLOAD_API_URL = "http://localhost:3000/api"
ADMIN_EMAIL = "admin@terra-sneakers.com"
ADMIN_PASSWORD = "TerraAdmin2024!"

def create_admin_user():
    """Créer l'utilisateur admin pour l'import"""
    try:
        # Vérifier si l'utilisateur existe déjà
        response = requests.post(
            f"{PAYLOAD_API_URL}/users/login",
            json={
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            }
        )

        if response.status_code == 200:
            print("✅ Utilisateur admin existe déjà")
            return True

        # Créer l'utilisateur
        print("👤 Création utilisateur admin...")
        response = requests.post(
            f"{PAYLOAD_API_URL}/users",
            json={
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD,
                "confirmPassword": ADMIN_PASSWORD,
                "firstName": "Admin",
                "lastName": "TERRA"
            }
        )

        if response.status_code == 201:
            print("✅ Utilisateur admin créé avec succès")
            print(f"📧 Email: {ADMIN_EMAIL}")
            print(f"🔑 Mot de passe: {ADMIN_PASSWORD}")
            return True
        else:
            print(f"❌ Erreur création admin: {response.status_code}")
            print(response.text)
            return False

    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

if __name__ == "__main__":
    print("🔧 Configuration admin TERRA")
    print("=" * 30)

    success = create_admin_user()
    if success:
        print("\n🎉 Configuration terminée!")
        print("Vous pouvez maintenant lancer l'importer")
    else:
        print("\n💥 Erreur de configuration")
        print("Vérifiez que le serveur Payload est démarré")
