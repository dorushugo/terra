#!/usr/bin/env python3
"""
Récupère de vraies images de chaussures et les associe aux produits Payload

Sources supportées:
- Pexels (recommandé) via API (PEXELS_API_KEY)
- Fallback: LoremFlickr (images libres par mot-clé)

Utilisation:
  PEXELS_API_KEY=xxxx python3 fetch_real_shoe_images.py
"""

import os
import io
import sys
import time
import random
import requests
from typing import Dict, List, Optional

PAYLOAD_API_URL = os.environ.get('PAYLOAD_API_URL', 'http://localhost:3000/api')
ADMIN_EMAIL = os.environ.get('PAYLOAD_EMAIL', 'admin@terra-sneakers.com')
ADMIN_PASSWORD = os.environ.get('PAYLOAD_PASSWORD', 'TerraAdmin2024!')

PEXELS_API_KEY = os.environ.get('PEXELS_API_KEY')

HEADERS_PEXELS = { 'Authorization': PEXELS_API_KEY } if PEXELS_API_KEY else {}

KEYWORDS = [
  'sneakers', 'running shoes', 'basketball shoes', 'sport shoes', 'trainers',
  'sneakers lifestyle', 'sneakers product photo', 'shoes studio',
]

LOCAL_IMAGES_DIR = os.path.join(os.path.dirname(__file__), 'real_images')

class Client:
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
      print('✅ Authentification Payload OK')
      return True
    print('❌ Authentification échouée:', r.status_code, r.text[:200])
    return False

  def list_products(self, limit: int = 100) -> List[Dict]:
    r = self.session.get(
      f"{PAYLOAD_API_URL}/products",
      params={ 'limit': limit, 'depth': 2, 'sort': '-createdAt' },
      timeout=30,
    )
    if r.status_code != 200:
      print('❌ Impossible de lister les produits:', r.text[:200])
      return []
    data = r.json()
    return data.get('docs', [])

  def upload_image(self, image_bytes: bytes, filename: str, alt: str) -> Optional[Dict]:
    files = {
      'file': (filename, io.BytesIO(image_bytes), 'image/jpeg')
    }
    data = {'alt': alt}
    r = self.session.post(f"{PAYLOAD_API_URL}/media", files=files, data=data)
    if r.status_code == 201:
      return r.json()
    print('❌ Upload échec:', r.status_code, r.text[:200])
    return None

  def attach_image_to_product(self, product_id: str, media_id: str, alt: str) -> bool:
    # Récupérer le produit actuel (pour ne pas écraser d'autres champs)
    r_get = self.session.get(f"{PAYLOAD_API_URL}/products/{product_id}")
    if r_get.status_code != 200:
      print('❌ Lecture produit échouée:', r_get.text[:200])
      return False
    product = r_get.json()
    raw_images = product.get('images') or []
    # Nettoyer les entrées invalides (ids nuls / 0 / None)
    images = []
    for entry in raw_images:
      if isinstance(entry, dict):
        rel = entry.get('image')
        valid = False
        if isinstance(rel, dict) and rel.get('id'):
          valid = True
          images.append({ 'image': rel.get('id'), 'alt': entry.get('alt') or alt })
        elif isinstance(rel, (str, int)) and str(rel) not in ('', '0', 'None', 'null'):
          valid = True
          images.append({ 'image': rel, 'alt': entry.get('alt') or alt })
        if not valid:
          # on skip l'entrée invalide
          pass
    # Ajouter la nouvelle image
    images.append({ 'image': media_id, 'alt': alt })

    r = self.session.patch(
      f"{PAYLOAD_API_URL}/products/{product_id}",
      json={ 'images': images }
    )
    if r.status_code == 200:
      return True
    print('❌ Association image échouée:', r.status_code, r.text[:200])
    return False


def fetch_image_from_pexels() -> Optional[bytes]:
  if not PEXELS_API_KEY:
    return None
  query = random.choice(KEYWORDS)
  params = { 'query': query, 'per_page': 1, 'page': random.randint(1, 80) }
  r = requests.get('https://api.pexels.com/v1/search', headers=HEADERS_PEXELS, params=params, timeout=15)
  if r.status_code != 200:
    return None
  items = r.json().get('photos', [])
  if not items:
    return None
  photo = items[0]
  url = photo['src'].get('large') or photo['src'].get('medium') or photo['src'].get('original')
  if not url:
    return None
  img = requests.get(url, timeout=20)
  if img.status_code == 200:
    return img.content
  return None


def fetch_image_from_loremflickr() -> Optional[bytes]:
  # Images libres par mot-clé, 800x800, tag sneakers
  url = f"https://loremflickr.com/800/800/sneakers,shoes,trainers,footwear/all"
  r = requests.get(url, timeout=20)
  if r.status_code == 200:
    return r.content
  return None

def get_local_images() -> List[str]:
  if not os.path.isdir(LOCAL_IMAGES_DIR):
    return []
  exts = {'.jpg', '.jpeg', '.png', '.webp'}
  files = []
  for name in sorted(os.listdir(LOCAL_IMAGES_DIR)):
    if os.path.splitext(name.lower())[1] in exts:
      files.append(os.path.join(LOCAL_IMAGES_DIR, name))
  return files


def main():
  print('🖼️  Image Filler - Produits sans images')
  client = Client()
  if not client.login():
    sys.exit(1)

  limit_str = input('Combien de produits à illustrer ? (défaut 20): ').strip()
  limit = int(limit_str) if limit_str.isdigit() else 20

  products = client.list_products(limit=limit)
  print(f'📦 {len(products)} produits récupérés')

  success, fail = 0, 0
  def needs_image(p: Dict) -> bool:
    images = p.get('images') or []
    if len(images) == 0:
      return True
    first = images[0]
    img = first.get('image') if isinstance(first, dict) else None
    # Si la relation n'est pas peuplée, ou pas d'URL, on considère manquant
    if not img or (isinstance(img, dict) and not img.get('url')):
      return True
    return False

  candidates = [p for p in products if needs_image(p)]
  if not candidates:
    print('ℹ️  Aucun produit sans image exploitable, rien à faire.')
    return

  local_files = get_local_images()
  local_iter = iter(local_files)

  for i, p in enumerate(candidates, 1):
    title = p.get('title') or 'Produit'
    print(f"\n📸 {i}/{len(candidates)}  {title}")

    img_bytes: Optional[bytes] = None

    # 1) Local images if available (no network required)
    try:
      path = next(local_iter)
      with open(path, 'rb') as f:
        img_bytes = f.read()
    except StopIteration:
      img_bytes = None

    # 2) Pexels API if configured
    if not img_bytes:
      img_bytes = fetch_image_from_pexels()

    # 3) Fallback to LoremFlickr (may fail without network)
    if not img_bytes:
      img_bytes = fetch_image_from_loremflickr()

    if not img_bytes:
      print('❌ Aucune image récupérée (réseau/API)')
      fail += 1
      continue

    media = client.upload_image(img_bytes, f"product_{p.get('id','unknown')}.jpg", f"{title} - photo")
    if not media:
      fail += 1
      continue

    media_id = media.get('id') or (media.get('doc') or {}).get('id')
    if not media_id:
      print('❌ ID média introuvable dans la réponse:', str(media)[:200])
      fail += 1
      continue

    ok = client.attach_image_to_product(str(p.get('id')), str(media_id), title)
    if ok:
      success += 1
      print('✅ Image liée au produit')
    else:
      fail += 1

    time.sleep(0.2)

  print('\n🎉 Terminé !')
  print(f'✅ Succès: {success}  ❌ Échecs: {fail}')

if __name__ == '__main__':
  main()


