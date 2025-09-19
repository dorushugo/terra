#!/usr/bin/env python3
"""
TERRA Sneakers Importer
Script pour importer ~200 sneakers depuis diverses sources dans Payload CMS
Compatible avec l'approche écoresponsable de TERRA
"""

import os
import json
import csv
import requests
import pandas as pd
import random
from typing import List, Dict, Any
from urllib.parse import urljoin
import time
from PIL import Image
import io

# Configuration
PAYLOAD_API_URL = "http://localhost:3000/api"
PAYLOAD_EMAIL = "admin@terra-sneakers.com"  # Utilisateur existant
PAYLOAD_PASSWORD = "TerraAdmin2024!"  # Mot de passe vu dans l'admin
OUTPUT_DIR = "imported_data"
IMAGES_DIR = f"{OUTPUT_DIR}/images"

# Collections TERRA pour mapping
TERRA_COLLECTIONS = {
    "sustainable": "origin",
    "performance": "move",
    "limited": "limited",
    "eco": "origin",
    "urban": "move",
    "classic": "origin"
}

# Matériaux écoresponsables pour mapping
ECO_MATERIALS = [
    "Cuir Apple", "Ocean Plastic", "Matériaux recyclés",
    "Coton bio", "Caoutchouc naturel", "Chanvre",
    "Liège", "Algues marines", "Déchets plastiques"
]

# Couleurs TERRA
TERRA_COLORS = [
    {"name": "Stone White", "value": "#F5F5F0"},
    {"name": "Urban Black", "value": "#1A1A1A"},
    {"name": "Terra Green", "value": "#2D5A27"},
    {"name": "Clay Orange", "value": "#D4725B"},
    {"name": "Sage Green", "value": "#9CAF88"},
    {"name": "Earth Brown", "value": "#8B4513"},
    {"name": "Ocean Blue", "value": "#4682B4"},
    {"name": "Desert Sand", "value": "#EDC9AF"}
]

class TerraImporter:
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
                json={
                    "email": PAYLOAD_EMAIL,
                    "password": PAYLOAD_PASSWORD
                }
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
            print(f"❌ Erreur connexion Payload: {e}")
            return False

    def download_kaggle_dataset(self):
        """Télécharger le dataset Kaggle des sneakers"""
        print("📥 Téléchargement du dataset Kaggle...")

        # Simuler des données Kaggle (remplacer par vraie API Kaggle)
        sample_data = [
            {
                "brand": "Nike",
                "name": "Air Max 90 Sustainable",
                "price": 140,
                "category": "lifestyle",
                "colors": "White/Green",
                "image_url": "https://via.placeholder.com/400x400/F5F5F0/2D5A27?text=Nike+Sustainable",
                "description": "Sneaker lifestyle avec matériaux recyclés",
                "materials": "Matériaux recyclés, Cuir synthétique"
            },
            {
                "brand": "Adidas",
                "name": "Ultraboost 22 Ocean",
                "price": 180,
                "category": "performance",
                "colors": "Blue/White",
                "image_url": "https://via.placeholder.com/400x400/4682B4/FFFFFF?text=Adidas+Ocean",
                "description": "Chaussure de running avec plastique océanique",
                "materials": "Ocean Plastic, Caoutchouc recyclé"
            },
            {
                "brand": "Allbirds",
                "name": "Tree Runners",
                "price": 98,
                "category": "sustainable",
                "colors": "Natural/Brown",
                "image_url": "https://via.placeholder.com/400x400/8B4513/F5F5F0?text=Allbirds+Tree",
                "description": "Sneakers en fibres d'eucalyptus",
                "materials": "Fibre d'eucalyptus, Laine mérinos"
            }
        ]

        # Générer plus de données variées
        brands = ["Nike", "Adidas", "Puma", "New Balance", "Vans", "Converse", "Allbirds", "Veja", "Reebok"]
        categories = ["sustainable", "performance", "lifestyle", "limited"]

        generated_data = []
        for i in range(200):
            brand = random.choice(brands)
            category = random.choice(categories)
            price = random.randint(80, 250)

            # Générer des noms cohérents
            model_names = {
                "Nike": ["Air Max", "Air Force", "Dunk", "Blazer", "React"],
                "Adidas": ["Ultraboost", "Stan Smith", "Gazelle", "Superstar", "NMD"],
                "Puma": ["Suede", "RS-X", "Clyde", "Future Rider", "Thunder"],
                "New Balance": ["574", "990", "997", "327", "2002R"],
                "Vans": ["Old Skool", "Authentic", "Era", "Sk8-Hi", "Slip-On"]
            }

            base_name = random.choice(model_names.get(brand, ["Classic", "Runner", "Court"]))
            eco_suffix = random.choice(["Eco", "Sustainable", "Recycled", "Ocean", "Natural", "Bio"])
            name = f"{base_name} {eco_suffix}"

            color_combo = random.choice(TERRA_COLORS)
            second_color = random.choice(TERRA_COLORS)

            generated_data.append({
                "brand": brand,
                "name": name,
                "price": price,
                "category": category,
                "colors": f"{color_combo['name']}/{second_color['name']}",
                "image_url": f"https://via.placeholder.com/400x400/{color_combo['value'][1:]}/{second_color['value'][1:]}?text={brand}+{base_name}",
                "description": f"Sneaker {category} avec approche écoresponsable",
                "materials": random.choice(ECO_MATERIALS) + ", " + random.choice(ECO_MATERIALS)
            })

        # Sauvegarder en CSV
        df = pd.DataFrame(sample_data + generated_data)
        csv_path = f"{OUTPUT_DIR}/sneakers_dataset.csv"
        df.to_csv(csv_path, index=False)
        print(f"✅ Dataset sauvegardé: {csv_path}")

        return df

    def download_and_process_image(self, image_url: str, filename: str) -> str:
        """Télécharger et optimiser une image"""
        try:
            response = requests.get(image_url, timeout=10)
            if response.status_code == 200:
                # Ouvrir l'image avec Pillow
                img = Image.open(io.BytesIO(response.content))

                # Redimensionner à 800x800 max
                img.thumbnail((800, 800), Image.Resampling.LANCZOS)

                # Convertir en RGB si nécessaire
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")

                # Sauvegarder en JPEG optimisé
                output_path = f"{IMAGES_DIR}/{filename}.jpg"
                img.save(output_path, "JPEG", quality=85, optimize=True)

                return output_path
            else:
                print(f"⚠️ Erreur téléchargement image: {response.status_code}")
                return None
        except Exception as e:
            print(f"⚠️ Erreur traitement image {filename}: {e}")
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
                    return response.json()
                else:
                    print(f"❌ Erreur upload image: {response.status_code}")
                    return None
        except Exception as e:
            print(f"❌ Erreur upload {image_path}: {e}")
            return None

    def transform_to_terra_product(self, row: Dict) -> Dict:
        """Transformer les données source en produit TERRA"""
        # Mapping collection
        collection = TERRA_COLLECTIONS.get(row['category'], 'origin')

        # Génération slug
        slug = f"terra-{row['name'].lower().replace(' ', '-').replace('/', '-')}-{random.randint(1000, 9999)}"

        # Génération éco-score
        eco_score = round(random.uniform(7.0, 9.5), 1)

        # Parsing couleurs
        colors = []
        if '/' in row['colors']:
            color_names = row['colors'].split('/')
            for color_name in color_names[:2]:  # Max 2 couleurs
                terra_color = next((c for c in TERRA_COLORS if c['name'].lower() in color_name.lower()), None)
                if terra_color:
                    colors.append({
                        "name": terra_color['name'],
                        "value": terra_color['value'],
                        "images": []
                    })

        if not colors:  # Couleur par défaut
            colors.append({
                "name": "Stone White",
                "value": "#F5F5F0",
                "images": []
            })

        # Génération tailles avec stock
        sizes = []
        available_sizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]
        for size in random.sample(available_sizes, random.randint(6, 8)):
            stock = random.randint(5, 50)
            reserved = random.randint(0, 3)
            sizes.append({
                "size": size,
                "stock": stock,
                "reservedStock": reserved,
                "availableStock": stock - reserved,
                "lowStockThreshold": 5,
                "isLowStock": stock <= 10,
                "isOutOfStock": stock == 0
            })

        return {
            "title": f"TERRA {row['name']}",
            "slug": slug,
            "collection": collection,
            "price": int(row['price']),
            "shortDescription": row['description'][:100] + "..." if len(row['description']) > 100 else row['description'],
            "description": [
                {
                    "children": [
                        {
                            "text": f"La {row['name']} incarne l'engagement TERRA pour un style urbain écoresponsable. {row['description']}"
                        }
                    ]
                }
            ],
            "colors": colors,
            "sizes": sizes,
            "ecoScore": eco_score,
            "isFeatured": random.choice([True, False]),
            "isNewArrival": random.choice([True, False]),
            "_status": "published"
        }

    def create_product_in_payload(self, product_data: Dict, image_path: str = None) -> Dict:
        """Créer un produit dans Payload CMS"""
        try:
            # Upload image si disponible
            if image_path and os.path.exists(image_path):
                alt_text = f"{product_data['title']} - Vue principale"
                image_doc = self.upload_image_to_payload(image_path, alt_text)
                if image_doc:
                    product_data["images"] = [{"image": image_doc["id"], "alt": alt_text}]

            # Créer le produit
            response = self.session.post(
                f"{PAYLOAD_API_URL}/products",
                json=product_data
            )

            if response.status_code == 201:
                return response.json()
            else:
                print(f"❌ Erreur création produit: {response.status_code} - {response.text}")
                return None

        except Exception as e:
            print(f"❌ Erreur création produit {product_data.get('title', 'Unknown')}: {e}")
            return None

    def import_sneakers(self, limit: int = 200):
        """Processus principal d'import"""
        print("🚀 Démarrage import TERRA Sneakers")

        # 1. Authentification
        if not self.authenticate_payload():
            return False

        # 2. Téléchargement dataset
        df = self.download_kaggle_dataset()
        print(f"📊 {len(df)} sneakers dans le dataset")

        # 3. Import avec limite
        imported_count = 0
        failed_count = 0

        for index, row in df.head(limit).iterrows():
            try:
                print(f"\n📦 Import {index + 1}/{limit}: {row['brand']} {row['name']}")

                # Télécharger image
                image_filename = f"sneaker_{index + 1}_{row['brand'].lower()}_{row['name'].replace(' ', '_').lower()}"
                image_path = self.download_and_process_image(row['image_url'], image_filename)

                # Transformer en produit TERRA
                terra_product = self.transform_to_terra_product(row)

                # Créer dans Payload
                result = self.create_product_in_payload(terra_product, image_path)

                if result:
                    imported_count += 1
                    print(f"✅ Produit créé: {result.get('id', 'Unknown ID')}")
                else:
                    failed_count += 1

                # Rate limiting
                time.sleep(0.5)

            except Exception as e:
                print(f"❌ Erreur import ligne {index}: {e}")
                failed_count += 1
                continue

        print(f"\n🎉 Import terminé!")
        print(f"✅ Importés: {imported_count}")
        print(f"❌ Échecs: {failed_count}")
        print(f"📊 Taux de réussite: {(imported_count / limit) * 100:.1f}%")

        return True

def main():
    """Point d'entrée principal"""
    importer = TerraImporter()

    print("🌱 TERRA Sneakers Importer v1.0")
    print("=" * 50)

    # Demander confirmation
    limit = input("Nombre de sneakers à importer (défaut: 50): ").strip()
    limit = int(limit) if limit.isdigit() else 50

    confirm = input(f"Importer {limit} sneakers dans Payload CMS? (y/N): ").strip().lower()
    if confirm != 'y':
        print("❌ Import annulé")
        return

    # Lancer import
    success = importer.import_sneakers(limit)

    if success:
        print("\n🎊 Import terminé avec succès!")
        print("Rendez-vous sur http://localhost:3000/admin pour voir les produits")
    else:
        print("\n💥 Erreur durant l'import")

if __name__ == "__main__":
    main()
