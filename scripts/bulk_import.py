#!/usr/bin/env python3
"""
Import en masse de 200+ sneakers TERRA pour projet école
Version optimisée sans images pour rapidité
"""

import requests
import json
import random
from concurrent.futures import ThreadPoolExecutor
import time

# Configuration
PAYLOAD_API_URL = "http://localhost:3000/api"
PAYLOAD_EMAIL = "admin@terra-sneakers.com"
PAYLOAD_PASSWORD = "TerraAdmin2024!"

# Données réalistes pour génération
BRANDS = [
    "Nike", "Adidas", "Puma", "New Balance", "Vans", "Converse",
    "Veja", "Allbirds", "Reebok", "ASICS", "Salomon", "On Running"
]

MODELS = [
    "Air Max", "Air Force", "Ultraboost", "Stan Smith", "Suede", "574",
    "Old Skool", "Chuck Taylor", "V-10", "Tree Runner", "Club C", "Gel-Lyte",
    "Speedcross", "Cloudstratus", "React", "Gazelle", "RS-X", "990v5",
    "Authentic", "One Star", "Esplar", "Dasher", "Classic", "Nimbus"
]

SUFFIXES = [
    "Sustainable", "Eco", "Recycled", "Bio", "Natural", "Ocean",
    "Earth", "Green", "Pure", "Organic", "Clean", "Fresh"
]

COLLECTIONS = ["origin", "move", "limited"]

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

ECO_MATERIALS = [
    "Cuir Apple", "Ocean Plastic", "Matériaux recyclés", "Coton bio",
    "Caoutchouc naturel", "Chanvre", "Liège", "Algues marines",
    "Déchets plastiques", "Fibre d'eucalyptus", "Laine mérinos", "Lin bio"
]

class BulkImporter:
    def __init__(self):
        self.session = None

    def authenticate(self):
        """S'authentifier avec Payload"""
        self.session = requests.Session()

        response = self.session.post(
            f"{PAYLOAD_API_URL}/users/login",
            json={
                "email": PAYLOAD_EMAIL,
                "password": PAYLOAD_PASSWORD
            }
        )

        if response.status_code == 200:
            token = response.json().get("token")
            self.session.headers.update({
                "Authorization": f"Bearer {token}"
            })
            print("✅ Authentification réussie")
            return True
        else:
            print(f"❌ Erreur authentification: {response.status_code}")
            return False

    def generate_product(self, index):
        """Générer un produit TERRA réaliste"""
        brand = random.choice(BRANDS)
        model = random.choice(MODELS)
        suffix = random.choice(SUFFIXES)
        collection = random.choice(COLLECTIONS)

        # Prix réalistes selon la marque
        price_ranges = {
            "Nike": (120, 200), "Adidas": (110, 190), "Veja": (100, 150),
            "Allbirds": (90, 130), "New Balance": (100, 160), "Vans": (70, 120),
            "Converse": (60, 100), "Puma": (80, 140), "Reebok": (80, 130),
            "ASICS": (100, 180), "Salomon": (140, 220), "On Running": (150, 200)
        }

        min_price, max_price = price_ranges.get(brand, (90, 160))
        price = random.randint(min_price, max_price)

        # Éco-score basé sur la marque (plus réaliste)
        eco_ranges = {
            "Veja": (8.5, 9.5), "Allbirds": (8.0, 9.0), "Nike": (7.0, 8.5),
            "Adidas": (7.5, 8.5), "New Balance": (7.0, 8.0), "Vans": (6.5, 7.5),
            "Converse": (6.0, 7.0), "Puma": (7.0, 8.0), "Reebok": (6.5, 7.5),
            "ASICS": (7.0, 8.0), "Salomon": (7.5, 8.5), "On Running": (8.0, 9.0)
        }

        min_eco, max_eco = eco_ranges.get(brand, (7.0, 8.5))
        eco_score = round(random.uniform(min_eco, max_eco), 1)

        # Tailles avec stock réaliste
        sizes = []
        all_sizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]
        available_sizes = random.sample(all_sizes, random.randint(6, 9))

        for size in sorted(available_sizes):
            stock = random.randint(0, 80)
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

        # Couleurs (1-2 par produit)
        num_colors = random.randint(1, 2)
        colors = []
        selected_colors = random.sample(TERRA_COLORS, num_colors)

        for color in selected_colors:
            colors.append({
                "name": color["name"],
                "value": color["value"],
                "images": []
            })

        # Description générée
        material1 = random.choice(ECO_MATERIALS)
        material2 = random.choice(ECO_MATERIALS)

        descriptions = [
            f"Sneaker écoresponsable alliant style urbain et conscience environnementale.",
            f"Conçue avec {material1} et {material2} pour un impact réduit.",
            f"Design intemporel pensé pour accompagner votre quotidien durable.",
            f"Innovation technique et matériaux recyclés dans un style moderne.",
            f"L'engagement TERRA pour un futur plus responsable à chaque pas."
        ]

        title = f"TERRA {brand} {model} {suffix}"
        slug = f"terra-{brand.lower()}-{model.lower().replace(' ', '-')}-{suffix.lower()}-{index}"

        return {
            "title": title,
            "slug": slug,
            "collection": collection,
            "price": price,
            "shortDescription": f"{brand} {model} avec matériaux durables - {material1}",
            "description": [
                {
                    "children": [
                        {
                            "text": f"La {title} incarne l'engagement TERRA. {random.choice(descriptions)}"
                        }
                    ]
                }
            ],
            "colors": colors,
            "sizes": sizes,
            "ecoScore": eco_score,
            "isFeatured": random.random() < 0.1,  # 10% featured
            "isNewArrival": random.random() < 0.15,  # 15% new arrivals
            "_status": "published"
        }

    def create_product(self, product_data):
        """Créer un produit dans Payload"""
        try:
            response = self.session.post(
                f"{PAYLOAD_API_URL}/products",
                json=product_data,
                timeout=30
            )

            if response.status_code == 201:
                return {
                    "success": True,
                    "title": product_data["title"],
                    "id": response.json().get("id")
                }
            else:
                return {
                    "success": False,
                    "title": product_data["title"],
                    "error": f"HTTP {response.status_code}"
                }

        except Exception as e:
            return {
                "success": False,
                "title": product_data["title"],
                "error": str(e)
            }

    def bulk_import(self, total_products=200):
        """Import en masse"""
        print(f"🚀 Import en masse de {total_products} produits TERRA")
        print("=" * 50)

        if not self.authenticate():
            return

        print("📦 Génération des produits...")
        products = []
        for i in range(1, total_products + 1):
            products.append(self.generate_product(i))

        print(f"✅ {len(products)} produits générés")
        print("\n🔄 Import en cours...")

        # Import séquentiel pour éviter de surcharger l'API
        success_count = 0
        failed_count = 0

        for i, product in enumerate(products, 1):
            print(f"📦 {i}/{total_products}: {product['title'][:50]}...")

            result = self.create_product(product)

            if result["success"]:
                success_count += 1
                print(f"  ✅ Créé (ID: {result['id']})")
            else:
                failed_count += 1
                print(f"  ❌ Erreur: {result['error']}")

            # Rate limiting léger
            time.sleep(0.1)

            # Affichage progression
            if i % 10 == 0:
                print(f"\n📊 Progression: {i}/{total_products} ({(i/total_products)*100:.1f}%)")
                print(f"✅ Réussis: {success_count} | ❌ Échecs: {failed_count}")
                print()

        print(f"\n🎉 Import terminé!")
        print(f"✅ Produits créés: {success_count}")
        print(f"❌ Échecs: {failed_count}")
        print(f"📊 Taux de réussite: {(success_count/total_products)*100:.1f}%")
        print(f"\n🌐 Voir les résultats: http://localhost:3000/admin/collections/products")

def main():
    print("🌱 TERRA Bulk Importer v2.0")
    print("Optimisé pour projets école")
    print("=" * 40)

    # Demander confirmation
    total = input("Nombre de produits à importer (défaut: 200): ").strip()
    total = int(total) if total.isdigit() else 200

    if total > 500:
        print("⚠️ Maximum recommandé: 500 produits")
        total = 500

    confirm = input(f"\n🚀 Importer {total} produits TERRA? (y/N): ").strip().lower()
    if confirm != 'y':
        print("❌ Import annulé")
        return

    # Lancer l'import
    importer = BulkImporter()
    importer.bulk_import(total)

if __name__ == "__main__":
    main()
