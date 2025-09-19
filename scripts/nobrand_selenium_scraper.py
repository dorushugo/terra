#!/usr/bin/env python3
"""
Scraper NOBRAND avec Selenium pour gérer le JavaScript et lazy loading
Plus lent mais plus fiable pour les sites dynamiques
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

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.common.exceptions import TimeoutException, NoSuchElementException
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False

PAYLOAD_API_URL = os.environ.get('PAYLOAD_API_URL', 'http://localhost:3000/api')
ADMIN_EMAIL = os.environ.get('PAYLOAD_EMAIL', 'admin@terra-sneakers.com')
ADMIN_PASSWORD = os.environ.get('PAYLOAD_PASSWORD', 'TerraAdmin2024!')

BASE_URL = 'https://nobrand.pt'
START_URL = 'https://nobrand.pt/men'

class SeleniumNobrandScraper:
    def __init__(self):
        if not SELENIUM_AVAILABLE:
            raise ImportError("Selenium requis: pip install selenium")

        self.driver = None
        self.setup_driver()

    def setup_driver(self):
        """Configure le driver Chrome"""
        chrome_options = Options()
        chrome_options.add_argument('--headless')  # Mode sans interface
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.implicitly_wait(10)
        except Exception as e:
            print(f'❌ Erreur configuration Chrome: {e}')
            print('💡 Installez ChromeDriver: brew install chromedriver')
            raise

    def scrape_all_pages(self) -> List[Dict]:
        """Scrape toutes les pages du site NOBRAND"""
        all_products = []

        try:
            for page_num in range(1, 5):  # Pages 1 à 4
                print(f'🔍 Scraping page {page_num}/4 avec Selenium...')

                if page_num == 1:
                    url = START_URL
                else:
                    url = f"{START_URL}?p={page_num}"

                products = self.scrape_page(url)
                if products:
                    all_products.extend(products)
                    print(f'✅ Page {page_num}: {len(products)} produits trouvés')
                else:
                    print(f'❌ Page {page_num}: Aucun produit trouvé')

                # Pause entre les pages
                time.sleep(3)

        finally:
            if self.driver:
                self.driver.quit()

        return all_products

    def scrape_page(self, url: str) -> List[Dict]:
        """Scrape une page avec Selenium"""
        try:
            print(f'📄 Chargement de {url}...')
            self.driver.get(url)

            # Attendre que la page se charge
            WebDriverWait(self.driver, 15).until(
                EC.presence_of_element_located((By.TAG_NAME, "img"))
            )

            # Scroll pour déclencher le lazy loading
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
            self.driver.execute_script("window.scrollTo(0, 0);")
            time.sleep(2)

            # Attendre un peu plus pour le lazy loading
            time.sleep(3)

            # Récupérer toutes les images
            img_elements = self.driver.find_elements(By.TAG_NAME, "img")
            products = []

            for img in img_elements:
                try:
                    # Récupérer les attributs
                    src = img.get_attribute('src')
                    alt = img.get_attribute('alt') or ''

                    # Vérifier si c'est une vraie image (pas un placeholder)
                    if src and not src.startswith('data:') and self.is_product_image(src, alt):
                        # Extraire le nom du produit
                        name = self.extract_product_name_selenium(img, alt)

                        product = {
                            'name': name,
                            'image_url': src,
                            'alt': alt or name
                        }
                        products.append(product)

                except Exception as e:
                    continue  # Ignorer les images problématiques

            return products

        except TimeoutException:
            print('⏰ Timeout lors du chargement de la page')
            return []
        except Exception as e:
            print(f'❌ Erreur scraping {url}: {e}')
            return []

    def extract_product_name_selenium(self, img_element, alt: str) -> str:
        """Extrait le nom du produit avec Selenium"""
        if alt and 'nobrand' in alt.lower():
            return alt

        try:
            # Chercher dans l'élément parent
            parent = img_element.find_element(By.XPATH, "..")

            # Chercher un titre de produit
            try:
                title = parent.find_element(By.XPATH, ".//h2 | .//h3 | .//span[contains(@class, 'name')] | .//*[contains(text(), 'Nobrand')]")
                name = title.text.strip()
                if name:
                    return name
            except NoSuchElementException:
                pass

        except Exception:
            pass

        return alt if alt else 'NOBRAND Shoe'

    def is_product_image(self, src: str, alt: str) -> bool:
        """Vérifie si une image est un produit"""
        src_lower = src.lower()
        alt_lower = alt.lower()

        # Critères positifs
        positive_keywords = ['product', 'shoe', 'nobrand', 'sneaker', 'boot', '.jpg', '.jpeg', '.png', '.webp']
        # Critères négatifs
        negative_keywords = ['logo', 'icon', 'banner', 'header', 'footer', 'nav', 'cookie']

        has_positive = any(keyword in src_lower or keyword in alt_lower for keyword in positive_keywords)
        has_negative = any(keyword in src_lower or keyword in alt_lower for keyword in negative_keywords)

        return has_positive and not has_negative

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

def download_image(image_url: str) -> Optional[bytes]:
    """Télécharge une image"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        response = requests.get(image_url, headers=headers, timeout=20)
        response.raise_for_status()

        content_type = response.headers.get('content-type', '').lower()
        if 'image' in content_type:
            return response.content
        else:
            print(f'⚠️  Pas une image: {content_type}')
            return None

    except Exception as e:
        print(f'❌ Erreur téléchargement {image_url}: {e}')
        return None

def main():
    print('🤖 NOBRAND Selenium Scraper - Images avec JavaScript')
    print('🌐 Source: https://nobrand.pt/men (4 pages)')
    print('⚡ Utilise Selenium pour le lazy loading')

    if not SELENIUM_AVAILABLE:
        print('❌ Selenium requis: pip install selenium')
        print('💡 ChromeDriver requis: brew install chromedriver')
        sys.exit(1)

    # Connexion Payload
    payload = PayloadClient()
    if not payload.login():
        print('❌ Authentification Payload échouée')
        sys.exit(1)

    # Scraping avec Selenium
    try:
        scraper = SeleniumNobrandScraper()
        scraped_products = scraper.scrape_all_pages()
    except Exception as e:
        print(f'❌ Erreur scraper: {e}')
        sys.exit(1)

    if not scraped_products:
        print('❌ Aucune image trouvée')
        sys.exit(1)

    print(f'\n📸 {len(scraped_products)} images trouvées avec Selenium')

    # Filtrer les images valides
    valid_products = [p for p in scraped_products if p['image_url'] and not p['image_url'].startswith('data:')]
    print(f'✅ {len(valid_products)} images valides')

    if not valid_products:
        print('❌ Aucune image valide trouvée')
        sys.exit(1)

    # Mélanger
    random.shuffle(valid_products)

    # Récupérer nos produits
    our_products = payload.get_products_needing_images()
    print(f'📦 {len(our_products)} produits TERRA à mettre à jour')

    # Paramètres
    replace_all = input('\nRemplacer TOUTES les images par NOBRAND ? (y/N): ').lower().strip() == 'y'
    if not replace_all:
        limit_str = input('Nombre de produits à traiter (défaut 30): ').strip()
        limit = int(limit_str) if limit_str.isdigit() else 30
        our_products = our_products[:limit]

    # Traitement
    print(f'\n🚀 Traitement de {len(our_products)} produits...')
    success = 0

    for i, product in enumerate(our_products):
        if i >= len(valid_products):
            print(f'❌ Plus d\'images NOBRAND pour {product.get("title")}')
            continue

        title = product.get('title') or f'Produit {i+1}'
        nobrand_product = valid_products[i]

        print(f'\n👟 {i+1}/{len(our_products)} - {title}')
        print(f'🔗 Source: {nobrand_product["name"]}')

        # Télécharger l'image
        print('⬇️  Téléchargement...', end=' ')
        img_bytes = download_image(nobrand_product['image_url'])

        if not img_bytes:
            print('❌')
            continue

        # Upload vers Payload
        filename = f"nobrand_{product.get('id', i)}.jpg"
        alt_text = f"{title} - Style NOBRAND"

        if payload.update_product_image(str(product.get('id')), img_bytes, filename, alt_text):
            success += 1
            print('✅')
        else:
            print('❌')

        time.sleep(1)

    print(f'\n🎉 Terminé!')
    print(f'✅ Images NOBRAND appliquées: {success}/{len(our_products)}')
    print(f'📊 Taux de réussite: {success/len(our_products)*100:.1f}%')

if __name__ == '__main__':
    main()
