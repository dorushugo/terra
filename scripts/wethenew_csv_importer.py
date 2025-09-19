#!/usr/bin/env python3
"""
WeTheNew CSV Importer for TERRA
Import sneakers from WeTheNew CSV file into Payload CMS
Compatible with TERRA's eco-friendly approach
"""

import os
import csv
import json
import requests
import random
import time
import re
from typing import List, Dict, Any
from urllib.parse import urlparse
import io
from PIL import Image

# Configuration
PAYLOAD_API_URL = "http://localhost:3000/api"
PAYLOAD_EMAIL = "hugodorus@gmail.com"
PAYLOAD_PASSWORD = "testMDP1234!#"
CSV_FILE_PATH = "../public/wethenew_sneakers_min3photos (1).csv"
OUTPUT_DIR = "imported_data"
IMAGES_DIR = f"{OUTPUT_DIR}/wethenew_images"

# Collections TERRA pour mapping automatique
COLLECTION_MAPPING = {
    # Basé sur les marques et modèles
    "air jordan": "limited",
    "travis scott": "limited",
    "nike": "move",
    "adidas": "origin",
    "new balance": "origin",
    "asics": "move",
    "yeezy": "limited",
    "puma": "move",
    "salomon": "move",
    "vans": "origin",
    # Par défaut
    "default": "origin"
}

# Couleurs TERRA pour mapping
TERRA_COLORS = [
    {"name": "Stone White", "value": "#F5F5F0"},
    {"name": "Urban Black", "value": "#1A1A1A"},
    {"name": "Terra Green", "value": "#2D5A27"},
    {"name": "Clay Orange", "value": "#D4725B"},
    {"name": "Sage Green", "value": "#9CAF88"},
    {"name": "Earth Brown", "value": "#8B4513"},
    {"name": "Ocean Blue", "value": "#4682B4"},
    {"name": "Desert Sand", "value": "#EDC9AF"},
    {"name": "Charcoal Grey", "value": "#36454F"},
    {"name": "Natural Beige", "value": "#F5E6D3"}
]

# Matériaux écoresponsables pour enrichissement
ECO_MATERIALS = [
    {"name": "Cuir Apple", "desc": "Cuir innovant fabriqué à partir de déchets de pommes", "impact": "95% moins d'eau"},
    {"name": "Ocean Plastic", "desc": "Plastique recyclé collecté dans les océans", "impact": "5 bouteilles recyclées/paire"},
    {"name": "Coton Bio", "desc": "Coton cultivé sans pesticides ni produits chimiques", "impact": "60% moins d'eau"},
    {"name": "Caoutchouc naturel", "desc": "Latex d'hévéa récolté de manière durable", "impact": "Biodégradable à 100%"},
    {"name": "Chanvre", "desc": "Fibre naturelle ultra-résistante et écologique", "impact": "Croissance sans irrigation"}
]

class WeTheNewImporter:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.setup_directories()

    def setup_directories(self):
        """Créer les dossiers nécessaires"""
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        os.makedirs(IMAGES_DIR, exist_ok=True)

    def authenticate_payload(self):
        """S'authentifier avec Payload CMS"""
        try:
            response = self.session.post(
                f"{PAYLOAD_API_URL}/users/login",
                json={"email": PAYLOAD_EMAIL, "password": PAYLOAD_PASSWORD}
            )
            if response.status_code == 200:
                self.auth_token = response.json().get("token")
                self.session.headers.update({
                    "Authorization": f"Bearer {self.auth_token}"
                })
                print("✅ Authentification Payload réussie")
                return True
            else:
                print(f"❌ Erreur authentification: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Erreur connexion: {e}")
            return False

    def clear_existing_products(self):
        """Supprimer tous les produits existants"""
        try:
            # Récupérer tous les produits
            response = self.session.get(f"{PAYLOAD_API_URL}/products?limit=1000")
            if response.status_code == 200:
                products = response.json().get("docs", [])
                print(f"🗑️ Suppression de {len(products)} produits existants...")

                deleted_count = 0
                for product in products:
                    try:
                        delete_response = self.session.delete(f"{PAYLOAD_API_URL}/products/{product['id']}")
                        if delete_response.status_code == 200:
                            deleted_count += 1
                        time.sleep(0.1)  # Rate limiting
                    except Exception as e:
                        print(f"   ⚠️ Erreur suppression produit {product['id']}: {e}")
                        continue

                print(f"✅ {deleted_count} produits supprimés")
                return True
            else:
                print(f"❌ Erreur récupération produits: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Erreur suppression: {e}")
            return False

    def parse_csv_file(self) -> List[Dict]:
        """Parser le fichier CSV WeTheNew"""
        products = []
        csv_path = os.path.join(os.path.dirname(__file__), CSV_FILE_PATH)

        try:
            with open(csv_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    # Parser le prix (enlever € et convertir)
                    price_str = row['prix'].replace('€', '').replace(',', '.').strip()
                    try:
                        price = float(price_str)
                    except ValueError:
                        price = 150.0  # Prix par défaut

                    # Parser les images (séparer par ;)
                    images_urls = [url.strip() for url in row['images'].split(';') if url.strip()]

                    products.append({
                        'nom': row['nom'].strip(),
                        'prix': price,
                        'images_urls': images_urls
                    })

            print(f"📊 {len(products)} produits parsés depuis le CSV")
            return products

        except Exception as e:
            print(f"❌ Erreur lecture CSV: {e}")
            return []

    def download_and_process_image(self, image_url: str, filename: str) -> str:
        """Télécharger et optimiser une image"""
        try:
            # Headers pour contourner les restrictions Shopify
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Referer': 'https://wethenew.com/',
                'Sec-Fetch-Dest': 'image',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Site': 'cross-site'
            }

            # Nettoyer l'URL (enlever les paramètres de taille Shopify)
            clean_url = image_url.split('?')[0]

            print(f"   🔗 URL: {clean_url[:50]}...")

            response = requests.get(clean_url, headers=headers, timeout=20, stream=True)

            if response.status_code == 200:
                # Vérifier que c'est bien une image
                content_type = response.headers.get('content-type', '')
                if not content_type.startswith('image/'):
                    print(f"   ⚠️ Pas une image: {content_type}")
                    return None

                # Lire le contenu
                image_data = response.content
                if len(image_data) < 1000:  # Image trop petite
                    print(f"   ⚠️ Image trop petite: {len(image_data)} bytes")
                    return None

                # Ouvrir l'image avec Pillow
                img = Image.open(io.BytesIO(image_data))

                # Redimensionner à 800x800 max en gardant les proportions
                img.thumbnail((800, 800), Image.Resampling.LANCZOS)

                # Convertir en RGB avec fond blanc si nécessaire
                if img.mode in ("RGBA", "P"):
                    # Créer une image blanche de la même taille
                    white_bg = Image.new("RGB", img.size, (255, 255, 255))
                    # Coller l'image avec transparence sur le fond blanc
                    if img.mode == "RGBA":
                        white_bg.paste(img, mask=img.split()[-1])  # Utiliser le canal alpha comme masque
                    else:
                        white_bg.paste(img)
                    img = white_bg

                # Sauvegarder en JPEG optimisé
                output_path = f"{IMAGES_DIR}/{filename}.jpg"
                img.save(output_path, "JPEG", quality=85, optimize=True)

                print(f"   ✅ Image sauvée: {os.path.basename(output_path)} ({len(image_data)} bytes)")
                return output_path
            else:
                print(f"   ⚠️ Erreur HTTP {response.status_code}: {image_url[:50]}...")
                return None

        except requests.exceptions.Timeout:
            print(f"   ⚠️ Timeout: {filename}")
            return None
        except requests.exceptions.RequestException as e:
            print(f"   ⚠️ Erreur réseau {filename}: {e}")
            return None
        except Exception as e:
            print(f"   ⚠️ Erreur traitement image {filename}: {e}")
            return None

    def upload_image_to_payload(self, image_path: str, alt_text: str) -> Dict:
        """Upload une image vers Payload CMS"""
        try:
            with open(image_path, 'rb') as f:
                files = {'file': (os.path.basename(image_path), f, 'image/jpeg')}
                data = {'alt': alt_text}

                response = self.session.post(
                    f"{PAYLOAD_API_URL}/media",
                    files=files,
                    data=data
                )

                if response.status_code == 201:
                    result = response.json()
                    print(f"   ✅ Upload réussi: ID {result.get('doc', {}).get('id', 'Unknown')}")
                    return result
                else:
                    print(f"   ❌ Erreur upload: {response.status_code}")
                    print(f"   📄 Réponse: {response.text[:200]}")
                    return None
        except Exception as e:
            print(f"   ❌ Erreur upload: {e}")
            return None

    def determine_collection(self, product_name: str) -> str:
        """Déterminer la collection TERRA basée sur le nom du produit"""
        name_lower = product_name.lower()

        for key, collection in COLLECTION_MAPPING.items():
            if key in name_lower:
                return collection

        return COLLECTION_MAPPING["default"]

    def extract_colors_from_name(self, product_name: str) -> List[Dict]:
        """Extraire les couleurs du nom du produit"""
        name_lower = product_name.lower()
        detected_colors = []

        # Mapping couleurs communes vers TERRA
        color_mapping = {
            'white': 'Stone White',
            'black': 'Urban Black',
            'green': 'Terra Green',
            'orange': 'Clay Orange',
            'brown': 'Earth Brown',
            'blue': 'Ocean Blue',
            'grey': 'Charcoal Grey',
            'gray': 'Charcoal Grey',
            'beige': 'Natural Beige',
            'sand': 'Desert Sand'
        }

        for color_key, terra_color_name in color_mapping.items():
            if color_key in name_lower:
                terra_color = next((c for c in TERRA_COLORS if c['name'] == terra_color_name), None)
                if terra_color and terra_color not in detected_colors:
                    detected_colors.append(terra_color)

        # Si aucune couleur détectée, utiliser Stone White par défaut
        if not detected_colors:
            detected_colors.append(next(c for c in TERRA_COLORS if c['name'] == 'Stone White'))

        return detected_colors[:2]  # Max 2 couleurs

    def generate_sizes_with_stock(self) -> List[Dict]:
        """Générer des tailles avec stock réaliste"""
        sizes = []
        available_sizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]

        # Sélectionner 6-8 tailles aléatoires
        selected_sizes = random.sample(available_sizes, random.randint(6, 8))

        for size in sorted(selected_sizes):
            stock = random.randint(0, 50)
            reserved = random.randint(0, min(3, stock)) if stock > 0 else 0

            sizes.append({
                "size": size,
                "stock": stock,
                "reservedStock": reserved,
                "availableStock": stock - reserved,
                "lowStockThreshold": 5,
                "isLowStock": stock <= 10,
                "isOutOfStock": stock == 0
            })

        return sizes

    def generate_rich_description(self, product_name: str, collection: str) -> List[Dict]:
        """Générer une description riche pour le produit"""
        # Matériau aléatoire pour enrichir
        material = random.choice(ECO_MATERIALS)

        # Description de base selon la collection
        base_descriptions = {
            "origin": f"La {product_name} incarne l'élégance minimaliste de TERRA Origin. Conçue avec des matériaux écoresponsables, cette sneaker allie style intemporel et conscience environnementale.",
            "move": f"Performance et style urbain se rencontrent dans cette {product_name} de la collection TERRA Move. Chaque détail technique vous accompagne dans vos mouvements quotidiens.",
            "limited": f"Édition exclusive TERRA Limited : la {product_name} est une création unique qui célèbre l'innovation durable et l'artisanat responsable."
        }

        base_desc = base_descriptions.get(collection, base_descriptions["origin"])

        return [
            {
                "children": [{"text": base_desc}]
            },
            {
                "children": [{"text": ""}]
            },
            {
                "children": [{"text": "🌱 Matériaux écoresponsables", "bold": True}]
            },
            {
                "children": [{"text": f"• {material['name']} : {material['desc']} ({material['impact']})"}]
            },
            {
                "children": [{"text": ""}]
            },
            {
                "children": [{"text": "🌍 Engagement TERRA", "bold": True}]
            },
            {
                "children": [{"text": "• 3 arbres plantés pour chaque paire vendue"}]
            },
            {
                "children": [{"text": "• Emballage 100% recyclé et recyclable"}]
            },
            {
                "children": [{"text": "• Programme de reprise et recyclage"}]
            }
        ]

    def transform_to_terra_product(self, csv_product: Dict, index: int) -> Dict:
        """Transformer un produit CSV en produit TERRA"""
        # Déterminer la collection
        collection = self.determine_collection(csv_product['nom'])

        # Générer slug unique
        slug_base = csv_product['nom'].lower()
        slug_base = re.sub(r'[^a-z0-9\s-]', '', slug_base)
        slug_base = re.sub(r'[\s-]+', '-', slug_base)
        slug = f"terra-{slug_base}-{index}"

        # Extraire couleurs
        colors_data = self.extract_colors_from_name(csv_product['nom'])
        colors = [{
            "name": color["name"],
            "value": color["value"],
            "images": []
        } for color in colors_data]

        # Générer tailles
        sizes = self.generate_sizes_with_stock()

        # Éco-score basé sur la collection
        eco_score_ranges = {
            "origin": (8.0, 9.5),
            "move": (7.5, 8.5),
            "limited": (8.5, 9.8)
        }
        eco_range = eco_score_ranges.get(collection, (7.0, 8.0))
        eco_score = round(random.uniform(*eco_range), 1)

        # Description riche
        rich_description = self.generate_rich_description(csv_product['nom'], collection)

        return {
            "title": csv_product['nom'],
            "slug": slug,
            "collection": collection,
            "price": int(csv_product['prix']),
            "shortDescription": f"Sneaker écoresponsable - Matériaux durables et style urbain",
            "description": rich_description,
            "colors": colors,
            "sizes": sizes,
            "ecoScore": eco_score,
            "isFeatured": random.random() < 0.15,  # 15% featured
            "isNewArrival": random.random() < 0.25,  # 25% nouveautés
            "_status": "published"
        }

    def create_product_with_images(self, terra_product: Dict, images_urls: List[str], index: int) -> Dict:
        """Créer un produit avec ses images dans Payload"""
        try:
            uploaded_images = []

            # Télécharger et uploader les images
            for i, image_url in enumerate(images_urls[:3]):  # Max 3 images
                print(f"   📸 Téléchargement image {i+1}/3...")

                filename = f"product_{index}_image_{i+1}"
                local_path = self.download_and_process_image(image_url, filename)

                if local_path:
                    alt_text = f"{terra_product['title']} - Vue {i+1}"
                    image_doc = self.upload_image_to_payload(local_path, alt_text)

                    if image_doc:
                        # Extraire l'ID depuis la structure Payload
                        media_id = image_doc.get('doc', {}).get('id') or image_doc.get('id')
                        if media_id:
                            uploaded_images.append({
                                "image": media_id,
                                "alt": alt_text
                            })
                        print(f"   ✅ Image {i+1} uploadée")
                    else:
                        print(f"   ❌ Échec upload image {i+1}")
                else:
                    print(f"   ❌ Échec téléchargement image {i+1}")

                time.sleep(0.3)  # Rate limiting

            # Ajouter les images au produit
            if uploaded_images:
                terra_product["images"] = uploaded_images

            # Créer le produit
            response = self.session.post(
                f"{PAYLOAD_API_URL}/products",
                json=terra_product
            )

            if response.status_code == 201:
                result = response.json()
                return result
            else:
                print(f"   ❌ Erreur création produit: {response.status_code}")
                print(f"   📄 Réponse: {response.text[:200]}")
                return None

        except Exception as e:
            print(f"   ❌ Exception création produit: {e}")
            return None

    def import_from_csv(self, limit: int = None, clear_existing: bool = True):
        """Import principal depuis le CSV WeTheNew"""
        print("🚀 TERRA WeTheNew CSV Importer")
        print("=" * 50)

        # Authentification
        if not self.authenticate_payload():
            return False

        # Supprimer produits existants si demandé
        if clear_existing:
            if not self.clear_existing_products():
                print("⚠️ Erreur suppression, continuation...")

        # Parser le CSV
        csv_products = self.parse_csv_file()
        if not csv_products:
            print("❌ Aucun produit trouvé dans le CSV")
            return False

        # Limiter si nécessaire
        if limit:
            csv_products = csv_products[:limit]

        print(f"📦 Import de {len(csv_products)} produits...")

        # Import des produits
        success_count = 0
        failed_count = 0

        for index, csv_product in enumerate(csv_products, 1):
            try:
                print(f"\n🔄 Produit {index}/{len(csv_products)}: {csv_product['nom']}")
                print(f"   💰 Prix: {csv_product['prix']}€")
                print(f"   📸 Images: {len(csv_product['images_urls'])}")

                # Transformer en produit TERRA
                terra_product = self.transform_to_terra_product(csv_product, index)
                print(f"   📦 Collection: {terra_product['collection'].title()}")
                print(f"   🌱 Éco-score: {terra_product['ecoScore']}")

                # Créer avec images
                result = self.create_product_with_images(
                    terra_product,
                    csv_product['images_urls'],
                    index
                )

                if result:
                    success_count += 1
                    print(f"   ✅ Créé avec succès (ID: {result.get('id', 'Unknown')})")
                else:
                    failed_count += 1
                    print(f"   ❌ Échec création")

                # Rate limiting entre produits
                time.sleep(1)

            except Exception as e:
                print(f"❌ Erreur produit {index}: {e}")
                failed_count += 1
                continue

        # Résumé final
        print(f"\n🎉 Import terminé!")
        print(f"✅ Succès: {success_count}")
        print(f"❌ Échecs: {failed_count}")
        print(f"📊 Taux: {(success_count/len(csv_products))*100:.1f}%")
        print(f"\n🌐 Voir les résultats: http://localhost:3000/admin/collections/products")

        return True

def main():
    """Point d'entrée principal"""
    print("🌱 TERRA WeTheNew CSV Importer")
    print("Import des sneakers WeTheNew vers Payload CMS")
    print("=" * 50)

    # Paramètres
    limit_input = input("Nombre de produits à importer (défaut: tous): ").strip()
    limit = int(limit_input) if limit_input.isdigit() else None

    clear_input = input("Supprimer les produits existants? (Y/n): ").strip().lower()
    clear_existing = clear_input != 'n'

    # Confirmation
    action_text = f"Importer {limit if limit else 'tous les'} produits"
    if clear_existing:
        action_text += " (après suppression des existants)"

    confirm = input(f"{action_text}? (y/N): ").strip().lower()
    if confirm != 'y':
        print("❌ Import annulé")
        return

    # Lancer l'import
    importer = WeTheNewImporter()
    success = importer.import_from_csv(limit=limit, clear_existing=clear_existing)

    if success:
        print("\n🎊 Import terminé avec succès!")
        print("Rendez-vous sur http://localhost:3000/admin pour voir les produits")
    else:
        print("\n💥 Erreur durant l'import")

if __name__ == "__main__":
    main()
