#!/usr/bin/env python3
"""
Script pour récupérer de vraies images de chaussures depuis Unsplash API
et les associer aux produits Payload CMS

Configuration:
1. Créer un compte sur https://unsplash.com/developers
2. Créer une nouvelle application pour obtenir l'Access Key
3. Définir UNSPLASH_ACCESS_KEY dans l'environnement

Utilisation:
  UNSPLASH_ACCESS_KEY=your_key python3 unsplash_images.py
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
    """Charge les variables du fichier .env dans l'environnement"""
    env_path = Path(__file__).parent.parent / '.env'
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    # Nettoyer les guillemets si présents
                    value = value.strip('"\'')
                    os.environ[key] = value
        print(f'✅ Fichier .env chargé depuis {env_path}')
    else:
        print(f'⚠️  Fichier .env non trouvé à {env_path}')

# Charger le .env au démarrage
load_env_file()

# Configuration
PAYLOAD_API_URL = os.environ.get('PAYLOAD_API_URL', 'http://localhost:3000/api')
ADMIN_EMAIL = os.environ.get('PAYLOAD_EMAIL', 'admin@terra-sneakers.com')
ADMIN_PASSWORD = os.environ.get('PAYLOAD_PASSWORD', 'TerraAdmin2024!')

UNSPLASH_ACCESS_KEY = os.environ.get('UNSPLASH_ACCESS_KEY')
UNSPLASH_API_URL = 'https://api.unsplash.com'

# Mots-clés pour rechercher des chaussures
SHOE_KEYWORDS = [
    'sneakers', 'running shoes', 'basketball shoes', 'athletic shoes',
    'trainers', 'sport shoes', 'casual shoes', 'white sneakers',
    'black sneakers', 'leather shoes', 'canvas shoes', 'tennis shoes'
]

class PayloadClient:
    def __init__(self):
        self.session = requests.Session()
        self.token = None

    def login(self) -> bool:
        """Authentification avec Payload CMS"""
        r = self.session.post(f"{PAYLOAD_API_URL}/users/login", json={
            'email': ADMIN_EMAIL,
            'password': ADMIN_PASSWORD,
        })
        if r.status_code == 200:
            self.token = r.json().get('token')
            self.session.headers.update({'Authorization': f'Bearer {self.token}'})
            print('✅ Authentification Payload réussie')
            return True
        print('❌ Authentification Payload échouée:', r.status_code, r.text[:200])
        return False

    def list_products(self, limit: int = 100) -> List[Dict]:
        """Liste les produits depuis Payload"""
        r = self.session.get(
            f"{PAYLOAD_API_URL}/products",
            params={'limit': limit, 'depth': 2, 'sort': '-createdAt'},
            timeout=30,
        )
        if r.status_code != 200:
            print('❌ Impossible de lister les produits:', r.text[:200])
            return []
        data = r.json()
        return data.get('docs', [])

    def upload_image(self, image_bytes: bytes, filename: str, alt: str) -> Optional[str]:
        """Upload une image vers Payload Media"""
        files = {
            'file': (filename, io.BytesIO(image_bytes), 'image/jpeg')
        }
        data = {'alt': alt}
        r = self.session.post(f"{PAYLOAD_API_URL}/media", files=files, data=data)
        if r.status_code == 201:
            result = r.json()
            # Extraire l'ID correctement selon le format de réponse Payload
            media_id = result.get('id') or (result.get('doc') or {}).get('id')
            print(f'✅ Upload réussi - ID: {media_id}')
            return str(media_id) if media_id else None
        print('❌ Upload échec:', r.status_code, r.text[:200])
        return None

    def update_product_images(self, product_id: str, media_id: str, alt: str) -> bool:
        """Met à jour les images d'un produit en remplaçant les relations invalides"""
        # Vérifier que le média existe avant de l'associer
        r_media = self.session.get(f"{PAYLOAD_API_URL}/media/{media_id}")
        if r_media.status_code != 200:
            print(f'❌ Média {media_id} introuvable')
            return False

        # Récupérer le produit actuel
        r_get = self.session.get(f"{PAYLOAD_API_URL}/products/{product_id}")
        if r_get.status_code != 200:
            print('❌ Lecture produit échouée:', r_get.text[:200])
            return False

        product = r_get.json()
        print(f'📝 Produit récupéré: {product.get("title")}')

        # Créer un nouveau tableau d'images en utilisant l'ID numérique
        new_images = [{'image': int(media_id), 'alt': alt}]

        print(f'🔗 Association image ID {media_id} au produit {product_id}')

        # Mettre à jour le produit
        r = self.session.patch(
            f"{PAYLOAD_API_URL}/products/{product_id}",
            json={'images': new_images}
        )
        if r.status_code == 200:
            print('✅ Produit mis à jour avec succès')
            return True
        print('❌ Mise à jour produit échouée:', r.status_code, r.text[:500])
        return False


class UnsplashClient:
    def __init__(self, access_key: str):
        self.access_key = access_key
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Client-ID {access_key}',
            'Accept-Version': 'v1'
        })

    def search_shoes(self, query: str = 'sneakers', per_page: int = 10, page: int = 1) -> List[Dict]:
        """Recherche des images de chaussures sur Unsplash"""
        params = {
            'query': query,
            'per_page': per_page,
            'page': page,
            'orientation': 'squarish'  # Format carré pour les produits
        }

        r = self.session.get(f'{UNSPLASH_API_URL}/search/photos', params=params)
        if r.status_code != 200:
            print(f'❌ Erreur recherche Unsplash: {r.status_code}')
            return []

        data = r.json()
        return data.get('results', [])

    def download_image(self, photo: Dict) -> Optional[bytes]:
        """Télécharge une image depuis Unsplash"""
        # Utiliser la taille 'regular' (1080px) pour un bon compromis qualité/taille
        url = photo['urls'].get('regular') or photo['urls'].get('small')
        if not url:
            return None

        try:
            # Déclencher le téléchargement (requis par l'API Unsplash)
            download_url = photo['links'].get('download_location')
            if download_url:
                self.session.get(download_url)  # Trigger download tracking

            # Télécharger l'image
            r = self.session.get(url, timeout=30)
            if r.status_code == 200:
                return r.content
        except Exception as e:
            print(f'❌ Erreur téléchargement: {e}')
        return None


def needs_image(product: Dict) -> bool:
    """Vérifie si un produit a besoin d'une image"""
    images = product.get('images') or []
    if len(images) == 0:
        return True

    # Vérifier si la première image est valide
    first = images[0]
    if not isinstance(first, dict):
        return True

    img = first.get('image')
    if not img:
        return True

    # Si relation peuplée, vérifier l'URL
    if isinstance(img, dict):
        return not img.get('url')

    # Si c'est juste un ID, considérer comme potentiellement invalide
    return str(img) in ('', '0', 'None', 'null')


def main():
    print('🖼️  Unsplash Image Fetcher - Images authentiques de chaussures')

    # Vérifier la clé API Unsplash
    if not UNSPLASH_ACCESS_KEY:
        print('❌ UNSPLASH_ACCESS_KEY manquante!')
        print('1. Créez un compte sur https://unsplash.com/developers')
        print('2. Créez une nouvelle application')
        print('3. Copiez votre Access Key')
        print('4. Exportez: export UNSPLASH_ACCESS_KEY=your_key')
        sys.exit(1)

    # Initialiser les clients
    payload = PayloadClient()
    if not payload.login():
        sys.exit(1)

    unsplash = UnsplashClient(UNSPLASH_ACCESS_KEY)

    # Paramètres
    limit_str = input('Combien de produits à traiter ? (défaut 20): ').strip()
    limit = int(limit_str) if limit_str.isdigit() else 20

    # Récupérer les produits
    products = payload.list_products(limit=limit)
    print(f'📦 {len(products)} produits récupérés')

    # Filtrer les produits qui ont besoin d'images
    candidates = [p for p in products if needs_image(p)]
    if not candidates:
        print('ℹ️  Tous les produits ont déjà des images valides!')
        return

    print(f'🎯 {len(candidates)} produits nécessitent des images')

    # Récupérer un lot d'images depuis Unsplash
    print('🔍 Recherche d\'images sur Unsplash...')
    all_photos = []

    # Calculer combien d'images on a besoin
    needed_images = len(candidates)
    print(f'📊 Besoin de {needed_images} images pour tous les produits')

    # Récupérer des images avec plusieurs mots-clés et pages
    for keyword in SHOE_KEYWORDS:
        if len(all_photos) >= needed_images:
            break

        for page in range(1, 6):  # 5 pages par mot-clé
            if len(all_photos) >= needed_images:
                break

            photos = unsplash.search_shoes(keyword, per_page=30, page=page)
            if not photos:
                break

            all_photos.extend(photos)
            print(f'📸 {len(all_photos)} images collectées (mot-clé: {keyword}, page: {page})')
            time.sleep(1)  # Respecter les limites de taux

            if len(all_photos) >= needed_images:
                break

    # Mélanger les images pour éviter les doublons de style
    random.shuffle(all_photos)

    if not all_photos:
        print('❌ Aucune image trouvée sur Unsplash')
        sys.exit(1)

    print(f'📸 {len(all_photos)} images trouvées sur Unsplash')

    # Traiter chaque produit
    success, fail = 0, 0

    for i, product in enumerate(candidates, 1):
        title = product.get('title') or 'Produit'
        print(f'\n📸 {i}/{len(candidates)} - {title}')

        # Choisir une image aléatoire
        if not all_photos:
            print('❌ Plus d\'images disponibles')
            fail += 1
            continue

        photo = all_photos.pop(0)  # Prendre la première image et la retirer

        # Télécharger l'image
        img_bytes = unsplash.download_image(photo)
        if not img_bytes:
            print('❌ Téléchargement échec')
            fail += 1
            continue

        # Upload vers Payload
        alt_text = f"{title} - {photo.get('alt_description', 'chaussure')}"
        filename = f"product_{product.get('id', 'unknown')}_{photo['id']}.jpg"

        media_id = payload.upload_image(img_bytes, filename, alt_text)
        if not media_id:
            fail += 1
            continue

        # Associer au produit
        if payload.update_product_images(str(product.get('id')), media_id, alt_text):
            success += 1
            print(f'✅ Image associée (Unsplash: {photo["user"]["name"]})')
        else:
            fail += 1

        # Pause pour respecter les limites
        time.sleep(1)

    print(f'\n🎉 Terminé!')
    print(f'✅ Succès: {success}')
    print(f'❌ Échecs: {fail}')

    if success > 0:
        print('\n📝 Attribution Unsplash:')
        print('Les images proviennent d\'Unsplash (https://unsplash.com)')
        print('Pensez à créditer les photographes si requis pour usage commercial')


if __name__ == '__main__':
    main()
