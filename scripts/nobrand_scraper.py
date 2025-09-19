#!/usr/bin/env python3
"""
Scraper pour récupérer les images de chaussures de NOBRAND
Site: https://nobrand.pt/men (4 pages)
Style: Fond blanc, professionnel, cohérent
"""

import os
import io
import sys
import time
import random
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
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

# Configuration du scraper
BASE_URL = 'https://nobrand.pt'
START_URL = 'https://nobrand.pt/men'
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
}

class NobrandScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.scraped_images = []

    def scrape_all_pages(self) -> List[Dict]:
        """Scrape toutes les pages (1-4) du site NOBRAND"""
        all_products = []

        seen_urls = set()  # Pour éviter les doublons

        # URLs à scraper (hommes ET femmes)
        base_urls = [
            ('HOMMES', 'https://nobrand.pt/men'),
            ('FEMMES', 'https://nobrand.pt/women')
        ]

        for section_name, base_url in base_urls:
            print(f'\\n👟 Section {section_name}:')

            for page_num in range(1, 6):  # Pages 1 à 5 pour chaque section
                print(f'🔍 Scraping {section_name.lower()} page {page_num}/5...')

                if page_num == 1:
                    url = base_url
                else:
                    # Construction de l'URL pour les pages suivantes
                    url = f"{base_url}?p={page_num}"

                products = self.scrape_page(url)

                # Filtrer les doublons par URL d'image
                unique_products = []
                for product in products:
                    if product['image_url'] not in seen_urls:
                        seen_urls.add(product['image_url'])
                        unique_products.append(product)

                if unique_products:
                    all_products.extend(unique_products)
                    print(f'✅ Page {page_num}: {len(unique_products)} produits uniques trouvés ({len(products)} total)')
                else:
                    print(f'❌ Page {page_num}: Aucun produit unique trouvé')

                # Pause entre les pages
                time.sleep(2)

        return all_products

    def scrape_page(self, url: str) -> List[Dict]:
        """Scrape une page spécifique"""
        try:
            response = self.session.get(url, timeout=15)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')
            products = []

            # Chercher toutes les images de produits
            images = soup.find_all('img')

            for img in images:
                # Chercher différents attributs d'image (lazy loading)
                src_candidates = [
                    img.get('src'),
                    img.get('data-src'),
                    img.get('data-lazy-src'),
                    img.get('data-original'),
                    img.get('data-srcset')
                ]

                # Prendre le premier src valide
                src = None
                for candidate in src_candidates:
                    if candidate and not candidate.startswith('data:'):
                        src = candidate
                        break

                alt = img.get('alt', '')

                if src and self.is_product_image(src, alt):
                    # Nettoyer et construire l'URL complète
                    if src.startswith('//'):
                        src = 'https:' + src
                    elif src.startswith('/'):
                        src = BASE_URL + src
                    elif not src.startswith('http'):
                        src = urljoin(BASE_URL, src)

                    # Extraire le nom du produit depuis l'alt ou contexte
                    name = self.extract_product_name(img, alt)

                    product = {
                        'name': name,
                        'image_url': src,
                        'alt': alt or name
                    }
                    products.append(product)

            return products

        except Exception as e:
            print(f'❌ Erreur scraping {url}: {e}')
            return []

    def extract_product_name(self, img_element, alt: str) -> str:
        """Extrait le nom du produit depuis le contexte et ajoute TERRA"""
        original_name = None

        # 1. Essayer l'alt text d'abord
        if alt and alt.strip():
            original_name = alt.strip()

        # 2. Chercher dans les éléments parents pour le nom du produit
        if not original_name:
            parent = img_element.parent
            for _ in range(5):  # Remonter plus de niveaux
                if parent is None:
                    break

                # Chercher différents types d'éléments de titre
                title_selectors = [
                    'h1', 'h2', 'h3', 'h4', 'h5',
                    '[class*="title"]', '[class*="name"]', '[class*="product"]',
                    'span', 'div', 'p'
                ]

                for selector in title_selectors:
                    title_elem = parent.find(selector)
                    if title_elem:
                        text = title_elem.get_text(strip=True)
                        if text and len(text) > 3 and not text.lower() in ['nobrand', 'new', 'sale']:
                            original_name = text
                            break

                if original_name:
                    break

                parent = parent.parent

        # 3. Nettoyer et formater le nom
        if original_name:
            # Nettoyer le nom
            cleaned_name = original_name.strip()

            # Supprimer "Nobrand" du début si présent
            if cleaned_name.lower().startswith('nobrand'):
                cleaned_name = cleaned_name[7:].strip()

            # Ajouter TERRA au début
            if not cleaned_name.upper().startswith('TERRA'):
                cleaned_name = f"TERRA {cleaned_name}"

            return cleaned_name

        # Fallback avec un nom générique
        return "TERRA Classic Shoe"

    def is_product_image(self, src: str, alt: str) -> bool:
        """Vérifie si une image est probablement un produit"""
        src_lower = src.lower()
        alt_lower = alt.lower()

        # Critères négatifs - exclure seulement les éléments évidents de navigation/UI
        negative_keywords = [
            'logo', 'icon', 'banner', 'header', 'footer', 'nav', 'menu',
            'arrow', 'button', 'cart', 'search', 'close', 'hamburger',
            'social', 'facebook', 'instagram', 'twitter', 'youtube',
            'favicon', 'sprite', 'background', 'pattern', 'texture'
        ]

        # Vérifier que c'est une image valide
        is_image = src_lower.endswith(('.jpg', '.jpeg', '.png', '.webp'))

        # Exclure seulement les éléments UI évidents
        has_negative = any(keyword in src_lower or keyword in alt_lower for keyword in negative_keywords)

        # Exclure les images trop petites (probablement des icônes)
        is_likely_icon = any(size in src_lower for size in ['16x16', '32x32', '64x64', '100x100'])

        # Accepter toutes les images qui ne sont pas des éléments UI
        return is_image and not has_negative and not is_likely_icon

    def download_image(self, image_url: str) -> Optional[bytes]:
        """Télécharge une image"""
        try:
            response = self.session.get(image_url, timeout=20)
            response.raise_for_status()

            # Vérifier que c'est bien une image
            content_type = response.headers.get('content-type', '').lower()
            if 'image' in content_type:
                return response.content
            else:
                print(f'⚠️  Pas une image: {content_type}')
                return None

        except Exception as e:
            print(f'❌ Erreur téléchargement {image_url}: {e}')
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
        print(f"❌ Erreur login: {r.status_code} - {r.text}")
        return False

    def get_products_needing_images(self, limit: int = 200) -> List[Dict]:
        """Récupère tous les produits pour remplacer leurs images"""
        r = self.session.get(f"{PAYLOAD_API_URL}/products", params={'limit': limit})
        if r.status_code == 200:
            return r.json().get('docs', [])
        return []

    def update_product_image(self, product_id: str, image_bytes: bytes, filename: str, alt: str) -> bool:
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

        # Update
        r = self.session.patch(f"{PAYLOAD_API_URL}/products/{product_id}",
                              json={'images': [{'image': int(media_id), 'alt': alt}]})
        return r.status_code == 200

    def update_product_with_nobrand_data(self, product_id: str, image_bytes: bytes, filename: str, alt: str, nobrand_name: str) -> bool:
        """Met à jour un produit avec l'image et le nom NOBRAND"""
        # 1. Upload de l'image
        files = {'file': (filename, io.BytesIO(image_bytes), 'image/jpeg')}
        data = {'alt': alt}
        r = self.session.post(f"{PAYLOAD_API_URL}/media", files=files, data=data)
        if r.status_code != 201:
            return False

        result = r.json()
        media_id = result.get('id') or (result.get('doc') or {}).get('id')
        if not media_id:
            return False

        # 2. Générer le slug depuis le nom NOBRAND
        slug = nobrand_name.lower().replace(' ', '-').replace('terra-', '').strip('-')

        # 3. Déterminer la collection depuis le nom
        collection = self.determine_collection_from_name(nobrand_name)

        # 4. Mettre à jour le produit avec image + nom + collection
        update_data = {
            'title': nobrand_name,
            'slug': slug,
            'shortDescription': f"{nobrand_name} - Chaussure éco-responsable au design authentique",
            'collection': collection,
            'images': [{'image': int(media_id), 'alt': alt}]
        }

        r = self.session.patch(f"{PAYLOAD_API_URL}/products/{product_id}", json=update_data)
        return r.status_code == 200

    def determine_collection_from_name(self, name: str) -> str:
        """Détermine la collection TERRA depuis le nom NOBRAND"""
        name_lower = name.lower()

        # Mots-clés pour Move (sportif)
        move_keywords = ['runner', 'sport', 'athletic', 'training', 'performance', 'active', 'dynamic']
        if any(keyword in name_lower for keyword in move_keywords):
            return 'move'

        # Mots-clés pour Limited (premium)
        limited_keywords = ['limited', 'premium', 'exclusive', 'signature', 'designer', 'artisan', 'master']
        if any(keyword in name_lower for keyword in limited_keywords):
            return 'limited'

        # Par défaut: Origin (classique)
        return 'origin'

def main():
    print('👟 NOBRAND Scraper - Images cohérentes de chaussures')
    print('🌐 Source: https://nobrand.pt/men (4 pages)')
    print('🎨 Style: Fond blanc, professionnel, cohérent')

    # Connexion Payload
    payload = PayloadClient()
    if not payload.login():
        print('❌ Authentification Payload échouée')
        sys.exit(1)

    # Initialiser le scraper
    scraper = NobrandScraper()

    # Scraper toutes les pages
    print('\n🔍 Début du scraping...')
    scraped_products = scraper.scrape_all_pages()

    if not scraped_products:
        print('❌ Aucune image trouvée sur le site')
        sys.exit(1)

    print(f'\n📸 {len(scraped_products)} images trouvées sur NOBRAND')

    # Mélanger les images pour éviter la répétition
    random.shuffle(scraped_products)

    # Récupérer nos produits
    our_products = payload.get_products_needing_images()
    print(f'📦 {len(our_products)} produits TERRA à mettre à jour')

    if not our_products:
        print('✅ Aucun produit à mettre à jour')
        return

    # Forcer le remplacement de toutes les images
    print('🔄 Remplacement automatique de TOUTES les images par celles de NOBRAND...')
    replace_all = True
    # Traiter tous les produits

    # Traitement
    print(f'\n🚀 Traitement de {len(our_products)} produits...')
    success = 0

    for i, product in enumerate(our_products):
        if i >= len(scraped_products):
            print(f'❌ Plus d\'images NOBRAND disponibles pour {product.get("title")}')
            continue

        title = product.get('title') or f'Produit {i+1}'
        nobrand_product = scraped_products[i]

        print(f'\n👟 {i+1}/{len(our_products)} - {title}')
        print(f'🔗 Source: {nobrand_product["name"]}')

        # Télécharger l'image NOBRAND
        print('⬇️  Téléchargement...', end=' ')
        img_bytes = scraper.download_image(nobrand_product['image_url'])

        if not img_bytes:
            print(f'❌ (URL: {nobrand_product["image_url"]})')
            continue

        # Upload vers Payload et mise à jour du nom
        filename = f"nobrand_{product.get('id', i)}.jpg"
        alt_text = f"{nobrand_product['name']} - Chaussure éco-responsable"

        # Mettre à jour l'image ET le nom du produit
        if payload.update_product_with_nobrand_data(
            str(product.get('id')),
            img_bytes,
            filename,
            alt_text,
            nobrand_product['name']
        ):
            success += 1
            print('✅')
        else:
            print('❌')

        # Pause pour être respectueux
        time.sleep(1)

    print(f'\n🎉 Terminé!')
    print(f'✅ Images NOBRAND appliquées: {success}/{len(our_products)}')
    print(f'📊 Taux de réussite: {success/len(our_products)*100:.1f}%')
    print('\n🎨 Style cohérent NOBRAND appliqué à tes produits TERRA!')
    print('📝 Crédits: Images inspirées de NOBRAND.pt')

if __name__ == '__main__':
    main()
