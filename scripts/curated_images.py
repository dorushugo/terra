#!/usr/bin/env python3
"""
Script pour des images cohérentes avec critères visuels stricts
Utilise des filtres Unsplash pour une identité visuelle uniforme
"""

import os
import io
import sys
import time
import random
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

PAYLOAD_API_URL = os.environ.get('PAYLOAD_API_URL', 'http://localhost:3000/api')
ADMIN_EMAIL = os.environ.get('PAYLOAD_EMAIL', 'admin@terra-sneakers.com')
ADMIN_PASSWORD = os.environ.get('PAYLOAD_PASSWORD', 'TerraAdmin2024!')
UNSPLASH_ACCESS_KEY = os.environ.get('UNSPLASH_ACCESS_KEY')

# Critères visuels stricts pour TERRA
VISUAL_CRITERIA = {
    'colors': ['white', 'black', 'minimal'],  # Couleurs cohérentes
    'orientation': 'squarish',                # Format carré
    'styles': [                              # Styles photographiques cohérents
        'product photography',
        'studio photography',
        'white background',
        'clean minimal',
        'professional product'
    ]
}

# Mots-clés spécifiques pour chaque type de chaussure
SHOE_CATEGORIES = {
    'sneakers': ['white sneakers studio', 'minimal sneakers photography', 'clean sneakers white background'],
    'running': ['running shoes product photo', 'athletic shoes studio', 'sport shoes white background'],
    'casual': ['casual shoes minimal', 'lifestyle sneakers clean', 'everyday shoes studio'],
    'basketball': ['basketball shoes product', 'high top sneakers studio', 'sport shoes professional'],
    'tennis': ['tennis shoes white background', 'court shoes minimal', 'athletic footwear studio']
}

class CuratedUnsplashProvider:
    def __init__(self, access_key: str):
        self.access_key = access_key
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Client-ID {access_key}',
            'Accept-Version': 'v1'
        })

    def get_curated_images(self, count: int) -> List[Dict]:
        """Récupère des images avec critères visuels stricts"""
        curated_photos = []

        # Utiliser des recherches très spécifiques
        specific_queries = [
            'white sneakers studio photography',
            'minimal shoes white background',
            'clean sneakers product photo',
            'athletic shoes professional photography',
            'running shoes studio shot',
            'casual sneakers minimal style',
            'sport shoes white backdrop',
            'footwear product photography',
            'shoes isolated white background',
            'sneakers commercial photography'
        ]

        for query in specific_queries:
            if len(curated_photos) >= count:
                break

            for page in range(1, 4):  # 3 pages max par requête
                if len(curated_photos) >= count:
                    break

                params = {
                    'query': query,
                    'per_page': 20,
                    'page': page,
                    'orientation': 'squarish',
                    'color': 'white',  # Privilégier les fonds blancs
                    'order_by': 'relevant'
                }

                r = self.session.get('https://api.unsplash.com/search/photos', params=params)
                if r.status_code != 200:
                    continue

                photos = r.json().get('results', [])

                # Filtrer selon nos critères visuels
                for photo in photos:
                    if len(curated_photos) >= count:
                        break

                    if self._meets_visual_criteria(photo):
                        curated_photos.append(photo)
                        print(f'✅ Image sélectionnée: {photo.get("alt_description", "")[:50]}...')

                time.sleep(1)  # Respecter les limites

        return curated_photos

    def _meets_visual_criteria(self, photo: Dict) -> bool:
        """Vérifie si une image respecte nos critères visuels"""
        description = (photo.get('description', '') or '').lower()
        alt_desc = (photo.get('alt_description', '') or '').lower()
        tags = [tag['title'].lower() for tag in photo.get('tags', [])]

        combined_text = f"{description} {alt_desc} {' '.join(tags)}"

        # Critères positifs (on veut ça)
        positive_keywords = [
            'white background', 'studio', 'product', 'minimal', 'clean',
            'isolated', 'professional', 'commercial', 'photography'
        ]

        # Critères négatifs (on évite ça)
        negative_keywords = [
            'person', 'people', 'wearing', 'feet', 'legs', 'model',
            'street', 'outdoor', 'lifestyle', 'fashion', 'portrait'
        ]

        # Vérifier les critères positifs
        has_positive = any(keyword in combined_text for keyword in positive_keywords)

        # Vérifier les critères négatifs
        has_negative = any(keyword in combined_text for keyword in negative_keywords)

        # L'image doit avoir des critères positifs ET ne pas avoir de négatifs
        return has_positive and not has_negative

    def download_image(self, photo: Dict) -> Optional[bytes]:
        """Télécharge une image depuis Unsplash"""
        url = photo['urls'].get('regular') or photo['urls'].get('small')
        if not url:
            return None

        try:
            # Déclencher le téléchargement (requis par l'API Unsplash)
            download_url = photo['links'].get('download_location')
            if download_url:
                self.session.get(download_url)

            # Télécharger l'image
            r = self.session.get(url, timeout=30)
            if r.status_code == 200:
                return r.content
        except Exception as e:
            print(f'❌ Erreur téléchargement: {e}')
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

    def list_products_needing_better_images(self, limit: int = 200) -> List[Dict]:
        """Liste tous les produits (pour remplacer les images existantes)"""
        r = self.session.get(f"{PAYLOAD_API_URL}/products", params={
            'limit': limit, 'depth': 1, 'sort': '-createdAt'
        })
        if r.status_code != 200:
            return []
        return r.json().get('docs', [])

    def replace_product_image(self, product_id: str, image_bytes: bytes, filename: str, alt: str) -> bool:
        """Remplace l'image d'un produit"""
        # Upload nouvelle image
        files = {'file': (filename, io.BytesIO(image_bytes), 'image/jpeg')}
        data = {'alt': alt}
        r = self.session.post(f"{PAYLOAD_API_URL}/media", files=files, data=data)
        if r.status_code != 201:
            return False

        result = r.json()
        media_id = result.get('id') or (result.get('doc') or {}).get('id')
        if not media_id:
            return False

        # Remplacer l'image du produit
        r = self.session.patch(f"{PAYLOAD_API_URL}/products/{product_id}",
                              json={'images': [{'image': int(media_id), 'alt': alt}]})
        return r.status_code == 200

def main():
    print('🎨 Curated Images - Images cohérentes pour TERRA')
    print('📐 Critères: fond blanc, studio, produit, minimal, professionnel')

    if not UNSPLASH_ACCESS_KEY:
        print('❌ Clé Unsplash requise pour des images de qualité')
        sys.exit(1)

    # Connexion
    payload = PayloadClient()
    if not payload.login():
        print('❌ Authentification échouée')
        sys.exit(1)

    unsplash = CuratedUnsplashProvider(UNSPLASH_ACCESS_KEY)

    # Paramètres
    replace_all = input('Remplacer TOUTES les images existantes ? (y/N): ').lower().strip() == 'y'
    limit_str = input('Nombre de produits à traiter (défaut 50): ').strip()
    limit = int(limit_str) if limit_str.isdigit() else 50

    # Récupérer les produits
    products = payload.list_products_needing_better_images(limit)
    print(f'📦 {len(products)} produits à traiter')

    # Récupérer des images curées
    print('🔍 Recherche d\'images avec critères visuels stricts...')
    curated_photos = unsplash.get_curated_images(len(products))

    if not curated_photos:
        print('❌ Aucune image trouvée avec nos critères')
        sys.exit(1)

    print(f'📸 {len(curated_photos)} images curées trouvées')

    # Mélanger pour éviter la répétition
    random.shuffle(curated_photos)

    # Traiter les produits
    success = 0
    for i, product in enumerate(products):
        if i >= len(curated_photos):
            print(f'❌ Plus d\'images curées pour {product.get("title")}')
            continue

        title = product.get('title') or f'Produit {i+1}'
        print(f'\n📸 {i+1}/{len(products)} - {title}')

        photo = curated_photos[i]

        # Télécharger l'image
        img_bytes = unsplash.download_image(photo)
        if not img_bytes:
            print('❌ Téléchargement échec')
            continue

        # Remplacer l'image
        filename = f"curated_{product.get('id', i)}_{photo['id']}.jpg"
        alt_text = f"{title} - {photo.get('alt_description', 'chaussure professionnelle')}"

        if payload.replace_product_image(str(product.get('id')), img_bytes, filename, alt_text):
            success += 1
            photographer = photo['user']['name']
            print(f'✅ Image remplacée (Photo: {photographer})')
        else:
            print('❌ Échec remplacement')

        # Pause
        time.sleep(0.5)

    print(f'\n🎉 Terminé!')
    print(f'✅ Images remplacées: {success}/{len(products)}')
    print(f'📊 Taux de réussite: {success/len(products)*100:.1f}%')
    print('\n🎨 Identité visuelle plus cohérente appliquée!')

if __name__ == '__main__':
    main()
