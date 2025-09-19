#!/usr/bin/env python3
"""
Scraper NOBRAND avec Selenium pour capturer toutes les images (avec JavaScript)
Version améliorée pour maximiser le nombre d'images récupérées
"""

import os
import time
import requests
import io
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from typing import Dict, List, Optional
from urllib.parse import urljoin, urlparse

# Configuration
PAYLOAD_API_URL = 'http://localhost:3000/api'
ADMIN_EMAIL = 'admin@terra-sneakers.com'
ADMIN_PASSWORD = 'TerraAdmin2024!'

BASE_URL = 'https://nobrand.pt'
SECTIONS = [
    ('HOMMES', 'https://nobrand.pt/men'),
    ('FEMMES', 'https://nobrand.pt/women'),
    ('ENFANTS', 'https://nobrand.pt/kids')  # Ajout section enfants
]

class SeleniumNobrandScraper:
    def __init__(self):
        # Configuration Chrome
        chrome_options = Options()
        chrome_options.add_argument('--headless')  # Mode sans interface
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')

        self.driver = webdriver.Chrome(options=chrome_options)
        self.session = requests.Session()

    def __del__(self):
        if hasattr(self, 'driver'):
            self.driver.quit()

    def scrape_all_sections(self) -> List[Dict]:
        """Scrape toutes les sections avec Selenium"""
        all_products = []
        seen_urls = set()

        for section_name, base_url in SECTIONS:
            print(f'\\n👟 Section {section_name}:')
            section_products = self.scrape_section(base_url, section_name)

            # Filtrer les doublons
            unique_products = []
            for product in section_products:
                if product['image_url'] not in seen_urls:
                    seen_urls.add(product['image_url'])
                    unique_products.append(product)

            all_products.extend(unique_products)
            print(f'✅ Section {section_name}: {len(unique_products)} images uniques ajoutées')

        return all_products

    def scrape_section(self, base_url: str, section_name: str) -> List[Dict]:
        """Scrape une section complète (toutes les pages)"""
        section_products = []

        for page_num in range(1, 8):  # Pages 1 à 7
            print(f'🔍 Scraping {section_name.lower()} page {page_num}/7...', end=' ')

            if page_num == 1:
                url = base_url
            else:
                url = f"{base_url}?p={page_num}"

            try:
                page_products = self.scrape_page_selenium(url)
                if page_products:
                    section_products.extend(page_products)
                    print(f'✅ {len(page_products)} images trouvées')
                else:
                    print('❌ Aucune image')

            except Exception as e:
                print(f'❌ Erreur: {e}')

            time.sleep(2)  # Pause respectueuse

        return section_products

    def scrape_page_selenium(self, url: str) -> List[Dict]:
        """Scrape une page avec Selenium pour exécuter le JavaScript"""
        try:
            self.driver.get(url)

            # Attendre que la page se charge
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "img"))
            )

            # Scroll pour déclencher le lazy loading
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(3)

            # Scroll vers le haut et le bas plusieurs fois
            for _ in range(3):
                self.driver.execute_script("window.scrollTo(0, 0);")
                time.sleep(1)
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(1)

            # Récupérer toutes les images
            img_elements = self.driver.find_elements(By.TAG_NAME, "img")

            products = []
            for img in img_elements:
                try:
                    # Récupérer l'URL de l'image
                    src = img.get_attribute('src') or img.get_attribute('data-src')
                    alt = img.get_attribute('alt') or ''

                    if src and self.is_product_image(src, alt):
                        # Construire URL complète
                        if src.startswith('//'):
                            src = 'https:' + src
                        elif src.startswith('/'):
                            src = BASE_URL + src
                        elif not src.startswith('http'):
                            src = urljoin(BASE_URL, src)

                        # Extraire nom du produit
                        name = self.extract_product_name_selenium(img, alt)

                        product = {
                            'name': name,
                            'image_url': src,
                            'alt': alt or name
                        }
                        products.append(product)

                except Exception as e:
                    continue

            return products

        except Exception as e:
            print(f'❌ Erreur scraping {url}: {e}')
            return []

    def extract_product_name_selenium(self, img_element, alt: str) -> str:
        """Extrait le nom du produit avec Selenium"""
        try:
            # Essayer l'alt text d'abord
            if alt and alt.strip():
                cleaned_name = alt.strip()
                if not cleaned_name.upper().startswith('TERRA'):
                    cleaned_name = f"TERRA {cleaned_name}"
                return cleaned_name

            # Chercher dans les éléments parents
            parent = img_element.find_element(By.XPATH, "..")
            for _ in range(3):
                try:
                    # Chercher des éléments de titre
                    title_elements = parent.find_elements(By.XPATH, ".//h1 | .//h2 | .//h3 | .//h4 | .//span | .//div")
                    for elem in title_elements:
                        text = elem.text.strip()
                        if text and len(text) > 3:
                            if not text.upper().startswith('TERRA'):
                                text = f"TERRA {text}"
                            return text

                    parent = parent.find_element(By.XPATH, "..")
                except:
                    break

            return "TERRA Classic Shoe"

        except:
            return "TERRA Classic Shoe"

    def is_product_image(self, src: str, alt: str) -> bool:
        """Vérifie si une image est probablement un produit (version permissive)"""
        src_lower = src.lower()
        alt_lower = alt.lower()

        # Exclure seulement les éléments UI évidents
        negative_keywords = [
            'logo', 'icon', 'banner', 'header', 'footer', 'nav', 'menu',
            'arrow', 'button', 'cart', 'search', 'close', 'hamburger',
            'social', 'facebook', 'instagram', 'twitter', 'youtube',
            'favicon', 'sprite', 'background', 'pattern', 'texture',
            'placeholder', 'loading', 'spinner'
        ]

        # Vérifier que c'est une image valide
        is_image = any(ext in src_lower for ext in ['.jpg', '.jpeg', '.png', '.webp'])

        # Exclure les éléments UI
        has_negative = any(keyword in src_lower or keyword in alt_lower for keyword in negative_keywords)

        # Exclure les images trop petites
        is_likely_icon = any(size in src_lower for size in ['16x16', '32x32', '64x64'])

        # Favoriser les images de produits
        is_likely_product = any(keyword in src_lower for keyword in ['product', 'catalog', 'media', 'cache'])

        return is_image and not has_negative and not is_likely_icon


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

    def get_products_needing_images(self, limit: int = 200) -> List[Dict]:
        r = self.session.get(f"{PAYLOAD_API_URL}/products", params={'limit': limit})
        if r.status_code == 200:
            return r.json().get('docs', [])
        return []

    def update_product_with_nobrand_data(self, product_id: str, image_bytes: bytes, filename: str, alt: str, nobrand_name: str) -> bool:
        # Upload image
        files = {'file': (filename, io.BytesIO(image_bytes), 'image/jpeg')}
        data = {'alt': alt}
        r = self.session.post(f"{PAYLOAD_API_URL}/media", files=files, data=data)
        if r.status_code != 201:
            return False

        result = r.json()
        media_id = result.get('id') or (result.get('doc') or {}).get('id')
        if not media_id:
            return False

        # Update product
        slug = nobrand_name.lower().replace(' ', '-').replace('terra-', '').strip('-')
        update_data = {
            'title': nobrand_name,
            'slug': slug,
            'shortDescription': f"{nobrand_name} - Chaussure éco-responsable au design authentique",
            'images': [{'image': int(media_id), 'alt': alt}]
        }

        r = self.session.patch(f"{PAYLOAD_API_URL}/products/{product_id}", json=update_data)
        return r.status_code == 200

    def download_image(self, image_url: str) -> Optional[bytes]:
        try:
            response = self.session.get(image_url, timeout=20)
            response.raise_for_status()
            content_type = response.headers.get('content-type', '').lower()
            if 'image' in content_type:
                return response.content
            return None
        except:
            return None


def main():
    print('🚀 NOBRAND Selenium Scraper - Version améliorée')
    print('🎯 Objectif: Maximiser le nombre d\'images récupérées')
    print('🔧 Technologie: Selenium + JavaScript execution')

    # Scraping avec Selenium
    scraper = SeleniumNobrandScraper()
    scraped_products = scraper.scrape_all_sections()

    print(f'\\n📸 {len(scraped_products)} images NOBRAND trouvées au total!')

    if not scraped_products:
        print('❌ Aucune image trouvée')
        return

    # Connexion Payload
    payload = PayloadClient()
    if not payload.login():
        print('❌ Authentification Payload échouée')
        return

    # Récupérer produits TERRA
    our_products = payload.get_products_needing_images()
    print(f'📦 {len(our_products)} produits TERRA à mettre à jour')

    if not our_products:
        print('❌ Aucun produit trouvé dans Payload')
        return

    # Traitement
    print(f'\\n🚀 Traitement avec {len(scraped_products)} images NOBRAND...')
    success = 0

    for i, product in enumerate(our_products):
        if i >= len(scraped_products):
            # Réutiliser les images de façon cyclique
            nobrand_product = scraped_products[i % len(scraped_products)]
        else:
            nobrand_product = scraped_products[i]

        title = product.get('title', f'Produit {i+1}')
        print(f'\\n👟 {i+1}/{len(our_products)} - {title}')
        print(f'🔗 Source: {nobrand_product["name"]}')

        # Télécharger image
        print('⬇️  Téléchargement...', end=' ')
        img_bytes = payload.download_image(nobrand_product['image_url'])

        if not img_bytes:
            print('❌')
            continue

        # Upload et mise à jour
        filename = f"nobrand_{product.get('id', i)}.jpg"
        alt_text = f"{nobrand_product['name']} - Chaussure éco-responsable"

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

        time.sleep(1)

    print(f'\\n🎉 Terminé!')
    print(f'✅ Images NOBRAND appliquées: {success}/{len(our_products)}')
    print(f'📊 Taux de réussite: {success/len(our_products)*100:.1f}%')
    print(f'🎨 Style cohérent NOBRAND appliqué!')


if __name__ == '__main__':
    main()
