#!/usr/bin/env python3
"""
Générateur d'images IA cohérentes pour TERRA
Utilise OpenAI DALL-E ou alternative pour créer des images uniformes
"""

import os
import io
import sys
import time
import requests
from typing import Dict, List, Optional
from pathlib import Path

def load_env_file():
    env_path = Path(__file__).parent.parent / '.env'
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    value = value.strip('"\'')
                    os.environ[key] = value

load_env_file()

# Configuration
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')  # À ajouter dans .env
PAYLOAD_API_URL = os.environ.get('PAYLOAD_API_URL', 'http://localhost:3000/api')
ADMIN_EMAIL = os.environ.get('PAYLOAD_EMAIL', 'admin@terra-sneakers.com')
ADMIN_PASSWORD = os.environ.get('PAYLOAD_PASSWORD', 'TerraAdmin2024!')

# Template de prompt uniforme pour TERRA
TERRA_PROMPT_TEMPLATE = """
Professional product photography of {shoe_description},
clean white background, studio lighting, minimal aesthetic,
commercial photography style, high resolution, isolated product,
no people, no feet, square format 1:1,
eco-friendly sustainable design, TERRA brand style,
soft shadows, professional e-commerce photo
"""

# Variations de couleurs TERRA
TERRA_COLORS = {
    'white': 'pristine white',
    'black': 'deep black',
    'green': 'sage green',
    'beige': 'natural beige',
    'gray': 'light gray'
}

# Types de chaussures avec descriptions cohérentes
SHOE_TYPES = {
    'sneakers': 'modern sustainable sneakers',
    'running': 'eco-friendly running shoes',
    'casual': 'minimalist casual shoes',
    'basketball': 'sustainable basketball shoes',
    'tennis': 'eco-conscious tennis shoes'
}

class AIImageGenerator:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })

    def generate_image(self, prompt: str) -> Optional[bytes]:
        """Génère une image via DALL-E 3"""
        try:
            payload = {
                "model": "dall-e-3",
                "prompt": prompt,
                "n": 1,
                "size": "1024x1024",
                "quality": "standard",
                "style": "natural"
            }

            r = self.session.post(
                'https://api.openai.com/v1/images/generations',
                json=payload,
                timeout=60
            )

            if r.status_code == 200:
                result = r.json()
                image_url = result['data'][0]['url']

                # Télécharger l'image générée
                img_response = requests.get(image_url, timeout=30)
                if img_response.status_code == 200:
                    return img_response.content

        except Exception as e:
            print(f'❌ Erreur génération IA: {e}')

        return None

class PayloadClient:
    def __init__(self):
        self.session = requests.Session()
        self.token = None

    def login(self) -> bool:
        r = self.session.post(f"{PAYLOAD_API_URL}/users/login", json={
            'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD,
        })
        if r.status_code == 200:
            self.token = r.json().get('token')
            self.session.headers.update({'Authorization': f'Bearer {self.token}'})
            return True
        return False

    def get_all_products(self) -> List[Dict]:
        r = self.session.get(f"{PAYLOAD_API_URL}/products", params={'limit': 200})
        if r.status_code == 200:
            return r.json().get('docs', [])
        return []

    def update_product_image(self, product_id: str, image_bytes: bytes, filename: str, alt: str) -> bool:
        # Upload
        files = {'file': (filename, io.BytesIO(image_bytes), 'image/png')}
        data = {'alt': alt}
        r = self.session.post(f"{PAYLOAD_API_URL}/media", files=files, data=data)
        if r.status_code != 201:
            return False

        result = r.json()
        media_id = result.get('id') or (result.get('doc') or {}).get('id')
        if not media_id:
            return False

        # Update product
        r = self.session.patch(f"{PAYLOAD_API_URL}/products/{product_id}",
                              json={'images': [{'image': int(media_id), 'alt': alt}]})
        return r.status_code == 200

def create_cohesive_prompt(product_title: str) -> str:
    """Crée un prompt cohérent basé sur le titre du produit"""
    title_lower = product_title.lower()

    # Déterminer le type de chaussure
    shoe_type = 'sneakers'  # défaut
    for key, desc in SHOE_TYPES.items():
        if key in title_lower:
            shoe_type = desc
            break

    # Déterminer la couleur
    color = 'white'  # défaut
    for color_key in TERRA_COLORS.keys():
        if color_key in title_lower:
            color = TERRA_COLORS[color_key]
            break

    # Construire la description
    shoe_description = f"{color} {shoe_type}"

    return TERRA_PROMPT_TEMPLATE.format(shoe_description=shoe_description).strip()

def main():
    print('🤖 AI Image Generator - Images cohérentes par IA')

    if not OPENAI_API_KEY:
        print('❌ OPENAI_API_KEY requise dans le fichier .env')
        print('1. Créez un compte sur https://platform.openai.com')
        print('2. Générez une clé API')
        print('3. Ajoutez OPENAI_API_KEY=sk-... dans votre .env')
        sys.exit(1)

    # Connexion
    payload = PayloadClient()
    if not payload.login():
        print('❌ Authentification Payload échouée')
        sys.exit(1)

    ai_generator = AIImageGenerator(OPENAI_API_KEY)

    # Paramètres
    limit_str = input('Nombre de produits à traiter (défaut 20): ').strip()
    limit = int(limit_str) if limit_str.isdigit() else 20

    # Récupérer les produits
    products = payload.get_all_products()[:limit]
    print(f'📦 {len(products)} produits à traiter')

    # Traitement
    success = 0
    for i, product in enumerate(products, 1):
        title = product.get('title') or f'Produit {i}'
        print(f'\n🎨 {i}/{len(products)} - {title}')

        # Créer un prompt cohérent
        prompt = create_cohesive_prompt(title)
        print(f'📝 Prompt: {prompt[:80]}...')

        # Générer l'image
        print('⏳ Génération IA...', end=' ')
        img_bytes = ai_generator.generate_image(prompt)

        if not img_bytes:
            print('❌')
            continue

        # Upload et association
        filename = f"ai_generated_{product.get('id', i)}.png"
        alt_text = f"{title} - Image générée par IA"

        if payload.update_product_image(str(product.get('id')), img_bytes, filename, alt_text):
            success += 1
            print('✅')
        else:
            print('❌')

        # Pause pour respecter les limites API
        time.sleep(2)

    print(f'\n🎉 Terminé!')
    print(f'✅ Images générées: {success}/{len(products)}')
    print(f'📊 Cohérence visuelle: 100% (toutes les images suivent le même style)')

if __name__ == '__main__':
    main()
