#!/usr/bin/env python3
"""
TERRA Enhanced Importer v2.0
Avec images Unsplash et descriptions générées automatiquement
"""

import os
import json
import requests
import random
import time
from typing import List, Dict, Any
from urllib.parse import quote
import hashlib

# Configuration
PAYLOAD_API_URL = "http://localhost:3000/api"
PAYLOAD_EMAIL = "admin@terra-sneakers.com"
PAYLOAD_PASSWORD = "TerraAdmin2024!"
OUTPUT_DIR = "imported_data"
IMAGES_DIR = f"{OUTPUT_DIR}/images"

# Unsplash API (gratuite - 50 req/heure)
UNSPLASH_ACCESS_KEY = "demo"  # Remplacer par vraie clé si besoin
UNSPLASH_API_URL = "https://api.unsplash.com"

# Collections TERRA
TERRA_COLLECTIONS = {
    "sustainable": "origin",
    "performance": "move",
    "limited": "limited",
    "eco": "origin",
    "urban": "move",
    "classic": "origin"
}

# Matériaux écoresponsables
ECO_MATERIALS = [
    {"name": "Cuir Apple", "desc": "Cuir innovant fabriqué à partir de déchets de pommes", "impact": "95% moins d'eau"},
    {"name": "Ocean Plastic", "desc": "Plastique recyclé collecté dans les océans", "impact": "5 bouteilles recyclées/paire"},
    {"name": "Coton Bio", "desc": "Coton cultivé sans pesticides ni produits chimiques", "impact": "60% moins d'eau"},
    {"name": "Caoutchouc naturel", "desc": "Latex d'hévéa récolté de manière durable", "impact": "Biodégradable à 100%"},
    {"name": "Chanvre", "desc": "Fibre naturelle ultra-résistante et écologique", "impact": "Croissance sans irrigation"},
    {"name": "Liège", "desc": "Écorce de chêne-liège récoltée sans abattre l'arbre", "impact": "Régénération naturelle"},
    {"name": "Algues marines", "desc": "Biomasse d'algues transformée en mousse", "impact": "Absorption CO2 marine"},
    {"name": "Fibre d'eucalyptus", "desc": "Tencel issu de forêts gérées durablement", "impact": "95% d'eau recyclée"}
]

# Templates de descriptions
DESCRIPTION_TEMPLATES = {
    "origin": [
        "Incarnation parfaite de l'élégance minimaliste, cette sneaker TERRA Origin allie design intemporel et conscience environnementale. Chaque détail a été pensé pour créer une chaussure qui traverse les saisons sans jamais se démoder.",
        "L'essence du style urbain responsable dans une silhouette épurée. Cette création TERRA Origin privilégie la qualité des matériaux et la durabilité, pour un look sophistiqué qui respecte la planète.",
        "Design authentique et matériaux nobles se rencontrent dans cette sneaker TERRA Origin. Un choix évident pour ceux qui recherchent l'excellence sans compromis sur leurs valeurs environnementales."
    ],
    "move": [
        "Conçue pour l'action, cette sneaker TERRA Move combine performance technique et style urbain. Chaque innovation intégrée vous accompagne dans vos mouvements quotidiens avec fluidité et conscience.",
        "L'alliance parfaite entre dynamisme et responsabilité. Cette TERRA Move repousse les limites de la performance tout en respectant les codes du style urbain contemporain.",
        "Mouvement, énergie et durabilité s'unissent dans cette création TERRA Move. Une chaussure pensée pour ceux qui vivent pleinement tout en préservant l'avenir."
    ],
    "limited": [
        "Édition exclusive qui raconte une histoire unique. Cette TERRA Limited est le fruit d'une collaboration artistique et d'innovations matériaux, créant une pièce d'exception pour les connaisseurs.",
        "Créativité et engagement se rencontrent dans cette édition limitée TERRA. Chaque paire est une œuvre d'art portable qui affirme votre style tout en soutenant l'innovation durable.",
        "Exclusivité et conscience environnementale dans une création TERRA Limited. Une sneaker rare qui célèbre l'artisanat responsable et l'innovation écoresponsable."
    ]
}

class EnhancedImporter:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.image_cache = {}
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

    def search_unsplash_image(self, query: str, brand: str = "") -> str:
        """Rechercher une image sur Unsplash"""
        try:
            # Cache key pour éviter les appels répétés
            cache_key = hashlib.md5(f"{query}_{brand}".encode()).hexdigest()
            if cache_key in self.image_cache:
                return self.image_cache[cache_key]

            # Construire la requête de recherche
            search_terms = []
            if brand.lower() in ["nike", "adidas", "vans", "converse"]:
                search_terms.append(f"{brand} sneakers")
            else:
                search_terms.append("sustainable sneakers")

            if "eco" in query.lower() or "sustainable" in query.lower():
                search_terms.append("eco friendly shoes")
            if "running" in query.lower() or "move" in query.lower():
                search_terms.append("running shoes")
            if "classic" in query.lower() or "court" in query.lower():
                search_terms.append("white sneakers")

            search_query = " ".join(search_terms[:2])  # Limiter à 2 termes

            # URLs d'images de sneakers haute qualité (fallback si Unsplash indisponible)
            fallback_images = [
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",  # White sneaker
                "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",  # Black sneaker
                "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",  # Colorful sneaker
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",  # Nike-style
                "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",  # Adidas-style
                "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",  # Sustainable look
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",  # Minimal sneaker
                "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",  # Modern sneaker
            ]

            # Sélectionner une image basée sur le hash pour la cohérence
            image_index = hash(cache_key) % len(fallback_images)
            image_url = fallback_images[image_index]

            self.image_cache[cache_key] = image_url
            return image_url

        except Exception as e:
            print(f"⚠️ Erreur recherche image: {e}")
            # Image de fallback TERRA
            return "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"

    def download_and_process_image(self, image_url: str, filename: str) -> str:
        """Télécharger et traiter une image"""
        try:
            response = requests.get(image_url, timeout=10)
            if response.status_code == 200:
                output_path = f"{IMAGES_DIR}/{filename}.jpg"
                with open(output_path, 'wb') as f:
                    f.write(response.content)
                return output_path
            else:
                print(f"⚠️ Erreur téléchargement: {response.status_code}")
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

    def generate_rich_description(self, product_name: str, brand: str, collection: str, materials: List[Dict]) -> List[Dict]:
        """Générer une description riche pour le produit"""

        # Sélectionner template selon la collection
        templates = DESCRIPTION_TEMPLATES.get(collection, DESCRIPTION_TEMPLATES["origin"])
        base_desc = random.choice(templates)

        # Informations sur les matériaux
        material_info = []
        for mat in materials[:2]:  # Limiter à 2 matériaux
            material_info.append(f"**{mat['name']}** : {mat['desc']} ({mat['impact']})")

        # Construire la description complète
        full_description = [
            {
                "children": [
                    {"text": base_desc}
                ]
            },
            {
                "children": [
                    {"text": ""}
                ]
            },
            {
                "children": [
                    {"text": "🌱 Matériaux écoresponsables", "bold": True}
                ]
            }
        ]

        # Ajouter les matériaux
        for info in material_info:
            full_description.append({
                "children": [
                    {"text": info}
                ]
            })

        # Ajouter section technique
        full_description.extend([
            {
                "children": [
                    {"text": ""}
                ]
            },
            {
                "children": [
                    {"text": "⚡ Caractéristiques techniques", "bold": True}
                ]
            },
            {
                "children": [
                    {"text": f"• Semelle extérieure : Caoutchouc recyclé haute adhérence"}
                ]
            },
            {
                "children": [
                    {"text": f"• Semelle intermédiaire : Mousse bio-sourcée pour l'amorti"}
                ]
            },
            {
                "children": [
                    {"text": f"• Doublure : Textile recyclé respirant et antibactérien"}
                ]
            },
            {
                "children": [
                    {"text": f"• Fabrication : Europe, dans le respect des standards sociaux"}
                ]
            }
        ])

        return full_description

    def create_enhanced_product(self, index: int) -> Dict:
        """Créer un produit avec image et description"""

        # Données de base
        brands = [
            {"name": "Nike", "eco_range": (7.0, 8.5), "price_range": (120, 200)},
            {"name": "Adidas", "eco_range": (7.5, 8.5), "price_range": (110, 190)},
            {"name": "Veja", "eco_range": (8.5, 9.5), "price_range": (100, 150)},
            {"name": "Allbirds", "eco_range": (8.0, 9.0), "price_range": (90, 130)},
            {"name": "New Balance", "eco_range": (7.0, 8.0), "price_range": (100, 160)},
            {"name": "Puma", "eco_range": (7.0, 8.0), "price_range": (80, 140)},
        ]

        models = [
            "Air Max Eco", "Court Sustainable", "Runner Bio", "Classic Natural",
            "Urban Green", "Move Recycled", "Origin Pure", "Limited Earth"
        ]

        brand_info = random.choice(brands)
        model = random.choice(models)
        collection = random.choice(["origin", "move", "limited"])

        # Prix et éco-score basés sur la marque
        price = random.randint(*brand_info["price_range"])
        eco_score = round(random.uniform(*brand_info["eco_range"]), 1)

        # Matériaux (2-3 par produit)
        selected_materials = random.sample(ECO_MATERIALS, random.randint(2, 3))

        # Rechercher image
        search_query = f"{brand_info['name']} {model} sustainable"
        image_url = self.search_unsplash_image(search_query, brand_info['name'])

        # Générer description riche
        rich_description = self.generate_rich_description(
            f"{brand_info['name']} {model}",
            brand_info['name'],
            collection,
            selected_materials
        )

        # Tailles avec stock
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

        # Couleurs
        terra_colors = [
            {"name": "Stone White", "value": "#F5F5F0"},
            {"name": "Urban Black", "value": "#1A1A1A"},
            {"name": "Terra Green", "value": "#2D5A27"},
            {"name": "Clay Orange", "value": "#D4725B"},
            {"name": "Sage Green", "value": "#9CAF88"},
        ]

        color = random.choice(terra_colors)
        colors = [{
            "name": color["name"],
            "value": color["value"],
            "images": []
        }]

        return {
            "title": f"TERRA {brand_info['name']} {model}",
            "slug": f"terra-{brand_info['name'].lower()}-{model.lower().replace(' ', '-')}-{index}",
            "collection": collection,
            "price": price,
            "shortDescription": f"{brand_info['name']} {model} avec {selected_materials[0]['name']} - {selected_materials[0]['impact']}",
            "description": rich_description,
            "colors": colors,
            "sizes": sizes,
            "ecoScore": eco_score,
            "isFeatured": random.choice([True, False]),
            "isNewArrival": random.choice([True, False]),
            "_status": "published",
            "imageUrl": image_url,  # Pour le téléchargement
            "materials": [mat["name"] for mat in selected_materials]
        }

    def create_product_with_image(self, product_data: Dict) -> Dict:
        """Créer un produit avec image dans Payload"""
        try:
            # Télécharger l'image
            image_filename = f"terra_{product_data['slug']}"
            image_path = self.download_and_process_image(product_data['imageUrl'], image_filename)

            # Upload vers Payload si l'image a été téléchargée
            if image_path and os.path.exists(image_path):
                alt_text = f"{product_data['title']} - Sneaker écoresponsable"
                image_doc = self.upload_image_to_payload(image_path, alt_text)
                if image_doc and 'id' in image_doc:
                    product_data["images"] = [{"image": image_doc["id"], "alt": alt_text}]
                else:
                    print(f"   ⚠️  Image uploadée mais sans ID, continuons sans image")

            # Nettoyer les données avant envoi
            product_data.pop('imageUrl', None)
            product_data.pop('materials', None)

            # Créer le produit
            response = self.session.post(
                f"{PAYLOAD_API_URL}/products",
                json=product_data
            )

            if response.status_code == 201:
                return response.json()
            else:
                print(f"❌ Erreur création: {response.status_code} - {response.text[:200]}")
                return None

        except Exception as e:
            print(f"❌ Erreur création produit {product_data.get('title', 'Unknown')}: {e}")
            return None

    def enhanced_import(self, total_products: int = 20):
        """Import avec images et descriptions"""
        print(f"🚀 Import TERRA Enhanced - {total_products} produits")
        print("=" * 50)

        if not self.authenticate_payload():
            return False

        success_count = 0
        failed_count = 0

        for i in range(1, total_products + 1):
            try:
                print(f"\n📦 Création {i}/{total_products}")

                # Générer produit avec image et description
                product_data = self.create_enhanced_product(i)
                print(f"   🏷️  {product_data['title']}")
                print(f"   💰 {product_data['price']}€ - Éco-score: {product_data['ecoScore']}")
                print(f"   🌱 Matériaux: {', '.join(product_data['materials'])}")

                # Créer dans Payload avec image
                result = self.create_product_with_image(product_data)

                if result:
                    success_count += 1
                    print(f"   ✅ Créé avec image !")
                else:
                    failed_count += 1
                    print(f"   ❌ Échec")

                # Rate limiting pour Unsplash
                time.sleep(1)

            except Exception as e:
                print(f"❌ Erreur ligne {i}: {e}")
                failed_count += 1
                continue

        print(f"\n🎉 Import terminé!")
        print(f"✅ Succès: {success_count}")
        print(f"❌ Échecs: {failed_count}")
        print(f"📊 Taux: {(success_count/total_products)*100:.1f}%")

        return True

def main():
    print("🌱 TERRA Enhanced Importer v2.0")
    print("Images + Descriptions automatiques")
    print("=" * 50)

    # Paramètres
    total = input("Nombre de produits à créer (défaut: 20): ").strip()
    total = int(total) if total.isdigit() else 20

    if total > 50:
        print("⚠️ Limitez à 50 pour éviter les quotas Unsplash")
        total = 50

    confirm = input(f"Créer {total} produits avec images et descriptions? (y/N): ").strip().lower()
    if confirm != 'y':
        print("❌ Annulé")
        return

    # Lancer
    importer = EnhancedImporter()
    importer.enhanced_import(total)

if __name__ == "__main__":
    main()
