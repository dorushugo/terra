#!/usr/bin/env python3
"""
Script optimisé pour remplir TOUS les produits avec des images d'un coup
Utilise plusieurs sources d'images pour maximiser la couverture
"""

import os
import io
import sys
import time
import random
import requests
from typing import Dict, List, Optional
from pathlib import Path

# Fonction pour charger le fichier .env
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
        print(f'✅ Fichier .env chargé')

load_env_file()

# Configuration
PAYLOAD_API_URL = os.environ.get('PAYLOAD_API_URL', 'http://localhost:3000/api')
ADMIN_EMAIL = os.environ.get('PAYLOAD_EMAIL', 'admin@terra-sneakers.com')
ADMIN_PASSWORD = os.environ.get('PAYLOAD_PASSWORD', 'TerraAdmin2024!')
UNSPLASH_ACCESS_KEY = os.environ.get('UNSPLASH_ACCESS_KEY')

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

    def list_all_products_needing_images(self) -> List[Dict]:
        all_products = []
        page = 1
        while True:
            r = self.session.get(f"{PAYLOAD_API_URL}/products", params={
                'limit': 100, 'page': page, 'depth': 1
            })
            if r.status_code != 200:
                break
            data = r.json()
            products = data.get('docs', [])
            if not products:
                break
            all_products.extend(products)
            page += 1
            if len(products) < 100:  # Dernière page
                break

        # Filtrer ceux qui ont besoin d'images
        candidates = []
        for p in all_products:
            images = p.get('images') or []
            needs_image = True
            if images and isinstance(images[0], dict):
                img = images[0].get('image')
                if isinstance(img, dict) and img.get('url'):
                    needs_image = False
            if needs_image:
                candidates.append(p)

        return candidates

    def upload_and_attach_image(self, product_id: str, image_bytes: bytes, filename: str, alt: str) -> bool:
        # Upload
        files = {'file': (filename, io.BytesIO(image_bytes), 'image/jpeg')}
        data = {'alt': alt}
        r = self.session.post(f"{PAYLOAD_API_URL}/media", files=files, data=data)
        if r.status_code != 201:
            return False

        result = r.json()
        media_id = result.get('id') or (result.get('doc') or {}).get('id')
        if not media_id:
            return False

        # Attach
        r = self.session.patch(f"{PAYLOAD_API_URL}/products/{product_id}",
                              json={'images': [{'image': int(media_id), 'alt': alt}]})
        return r.status_code == 200

class ImageProvider:
    def get_images(self, count: int) -> List[bytes]:
        raise NotImplementedError

class UnsplashProvider(ImageProvider):
    def __init__(self, access_key: str):
        self.access_key = access_key
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Client-ID {access_key}',
            'Accept-Version': 'v1'
        })

    def get_images(self, count: int) -> List[bytes]:
        keywords = ['sneakers', 'running shoes', 'basketball shoes', 'athletic shoes',
                   'trainers', 'sport shoes', 'casual shoes', 'white sneakers']

        images = []
        for keyword in keywords:
            if len(images) >= count:
                break
            for page in range(1, 11):  # 10 pages max
                if len(images) >= count:
                    break

                r = self.session.get('https://api.unsplash.com/search/photos', params={
                    'query': keyword, 'per_page': 30, 'page': page, 'orientation': 'squarish'
                })
                if r.status_code != 200:
                    continue

                photos = r.json().get('results', [])
                for photo in photos:
                    if len(images) >= count:
                        break
                    url = photo['urls'].get('regular')
                    if url:
                        try:
                            img_r = self.session.get(url, timeout=10)
                            if img_r.status_code == 200:
                                images.append(img_r.content)
                        except:
                            continue
                time.sleep(0.5)
        return images

class PicsumProvider(ImageProvider):
    def get_images(self, count: int) -> List[bytes]:
        images = []
        image_ids = list(range(1, 1000))  # IDs Picsum disponibles
        random.shuffle(image_ids)

        for img_id in image_ids[:count]:
            try:
                url = f"https://picsum.photos/id/{img_id}/800/800.jpg"
                r = requests.get(url, timeout=10)
                if r.status_code == 200:
                    images.append(r.content)
            except:
                continue
        return images

def main():
    print('🚀 Mass Image Fill - Traitement de TOUS les produits')

    # Connexion Payload
    payload = PayloadClient()
    if not payload.login():
        print('❌ Authentification Payload échouée')
        sys.exit(1)

    # Récupérer tous les produits sans images
    print('📊 Analyse de tous les produits...')
    candidates = payload.list_all_products_needing_images()
    if not candidates:
        print('✅ Tous les produits ont déjà des images!')
        return

    print(f'🎯 {len(candidates)} produits nécessitent des images')

    # Préparer les sources d'images
    providers = []

    if UNSPLASH_ACCESS_KEY:
        print('📸 Unsplash disponible')
        providers.append(UnsplashProvider(UNSPLASH_ACCESS_KEY))

    providers.append(PicsumProvider())
    print(f'📋 {len(providers)} sources d\'images configurées')

    # Récupérer toutes les images nécessaires
    print(f'🔍 Récupération de {len(candidates)} images...')
    all_images = []

    for provider in providers:
        if len(all_images) >= len(candidates):
            break
        needed = len(candidates) - len(all_images)
        print(f'📥 Récupération de {needed} images depuis {provider.__class__.__name__}...')
        images = provider.get_images(needed)
        all_images.extend(images)
        print(f'✅ {len(images)} images récupérées')

    if len(all_images) < len(candidates):
        print(f'⚠️  Seulement {len(all_images)} images disponibles pour {len(candidates)} produits')

    # Mélanger les images
    random.shuffle(all_images)

    # Traiter tous les produits
    success = 0
    for i, product in enumerate(candidates):
        if i >= len(all_images):
            print(f'❌ Plus d\'images disponibles pour {product.get("title")}')
            continue

        title = product.get('title') or f'Produit {i+1}'
        print(f'📸 {i+1}/{len(candidates)} - {title}', end=' ... ')

        filename = f"product_{product.get('id', i)}.jpg"
        alt_text = f"{title} - image produit"

        if payload.upload_and_attach_image(str(product.get('id')), all_images[i], filename, alt_text):
            success += 1
            print('✅')
        else:
            print('❌')

        # Petite pause pour ne pas surcharger
        if i % 10 == 0:
            time.sleep(1)

    print(f'\n🎉 Terminé!')
    print(f'✅ Succès: {success}/{len(candidates)}')
    print(f'📊 Taux de réussite: {success/len(candidates)*100:.1f}%')

if __name__ == '__main__':
    main()
