#!/usr/bin/env python3
"""
Alternative avec Lorem Picsum - Images aléatoires sans clé API
Utilise https://picsum.photos pour des images de test
"""

import os
import io
import sys
import time
import random
import requests
from typing import Dict, List, Optional

# Configuration Payload
PAYLOAD_API_URL = os.environ.get('PAYLOAD_API_URL', 'http://localhost:3000/api')
ADMIN_EMAIL = os.environ.get('PAYLOAD_EMAIL', 'admin@terra-sneakers.com')
ADMIN_PASSWORD = os.environ.get('PAYLOAD_PASSWORD', 'TerraAdmin2024!')

class PayloadClient:
    def __init__(self):
        self.session = requests.Session()
        self.token = None

    def login(self) -> bool:
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


def fetch_random_image(width: int = 800, height: int = 800) -> Optional[bytes]:
    """Récupère une image aléatoire depuis Lorem Picsum"""
    # Utiliser des IDs d'images spécifiques pour plus de cohérence
    image_ids = [1, 2, 3, 5, 6, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25]
    image_id = random.choice(image_ids)

    url = f"https://picsum.photos/id/{image_id}/{width}/{height}.jpg"

    try:
        r = requests.get(url, timeout=20)
        if r.status_code == 200:
            return r.content
    except Exception as e:
        print(f'❌ Erreur téléchargement Picsum: {e}')
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
    print('🖼️  Lorem Picsum Image Filler - Images de test')
    print('⚠️  Note: Utilise des images génériques, pas spécifiquement des chaussures')

    # Initialiser le client Payload
    payload = PayloadClient()
    if not payload.login():
        sys.exit(1)

    # Paramètres
    limit_str = input('Combien de produits à traiter ? (défaut 10): ').strip()
    limit = int(limit_str) if limit_str.isdigit() else 10

    # Récupérer les produits
    products = payload.list_products(limit=limit)
    print(f'📦 {len(products)} produits récupérés')

    # Filtrer les produits qui ont besoin d'images
    candidates = [p for p in products if needs_image(p)]
    if not candidates:
        print('ℹ️  Tous les produits ont déjà des images valides!')
        return

    print(f'🎯 {len(candidates)} produits nécessitent des images')

    # Traiter chaque produit
    success, fail = 0, 0

    for i, product in enumerate(candidates, 1):
        title = product.get('title') or 'Produit'
        print(f'\n📸 {i}/{len(candidates)} - {title}')

        # Télécharger une image aléatoire
        img_bytes = fetch_random_image()
        if not img_bytes:
            print('❌ Téléchargement échec')
            fail += 1
            continue

        # Upload vers Payload
        alt_text = f"{title} - image produit"
        filename = f"product_{product.get('id', 'unknown')}_picsum.jpg"

        media_id = payload.upload_image(img_bytes, filename, alt_text)
        if not media_id:
            fail += 1
            continue

        # Associer au produit
        if payload.update_product_images(str(product.get('id')), media_id, alt_text):
            success += 1
            print('✅ Image associée')
        else:
            fail += 1

        # Pause pour éviter de surcharger
        time.sleep(0.5)

    print(f'\n🎉 Terminé!')
    print(f'✅ Succès: {success}')
    print(f'❌ Échecs: {fail}')

    if success > 0:
        print('\n📝 Note: Images génériques utilisées pour les tests')
        print('Pour de vraies images de chaussures, utilisez unsplash_images.py')


if __name__ == '__main__':
    main()
