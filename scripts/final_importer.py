#!/usr/bin/env python3
"""
TERRA Final Importer v3.0
Avec images locales stylées et descriptions riches
"""

import os
import json
import requests
import random
import time
from typing import List, Dict, Any
import glob

# Configuration
PAYLOAD_API_URL = "http://localhost:3000/api"
PAYLOAD_EMAIL = "admin@terra-sneakers.com"
PAYLOAD_PASSWORD = "TerraAdmin2024!"
PLACEHOLDER_DIR = "placeholder_images"

# Matériaux écoresponsables avec détails
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

# Templates de descriptions par collection
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

class FinalImporter:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.available_images = self.scan_placeholder_images()

    def scan_placeholder_images(self) -> List[str]:
        """Scanner les images placeholder disponibles"""
        if not os.path.exists(PLACEHOLDER_DIR):
            print(f"⚠️ Dossier {PLACEHOLDER_DIR} non trouvé. Créez d'abord les placeholders.")
            return []

        images = glob.glob(f"{PLACEHOLDER_DIR}/*.jpg")
        print(f"📁 {len(images)} images placeholder trouvées")
        return images

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
                    print(f"   📸 Image uploadée: {result.get('filename', 'unknown')}")
                    return result
                else:
                    print(f"   ❌ Erreur upload: {response.status_code}")
                    return None
        except Exception as e:
            print(f"   ❌ Erreur upload: {e}")
            return None

    def generate_rich_description(self, product_name: str, collection: str, materials: List[Dict]) -> List[Dict]:
        """Générer une description riche et détaillée"""

        # Template de base selon la collection
        templates = DESCRIPTION_TEMPLATES.get(collection, DESCRIPTION_TEMPLATES["origin"])
        base_desc = random.choice(templates)

        # Construire la description structurée
        description = [
            {
                "children": [
                    {"text": base_desc}
                ]
            },
            {
                "children": [
                    {"text": ""}  # Ligne vide
                ]
            },
            {
                "children": [
                    {"text": "🌱 Matériaux écoresponsables", "bold": True}
                ]
            }
        ]

        # Ajouter les matériaux avec détails
        for mat in materials[:2]:  # Limiter à 2 pour la lisibilité
            description.append({
                "children": [
                    {"text": f"• {mat['name']} : {mat['desc']} ({mat['impact']})"}
                ]
            })

        # Section caractéristiques techniques
        description.extend([
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
                    {"text": "• Semelle extérieure : Caoutchouc recyclé haute adhérence"}
                ]
            },
            {
                "children": [
                    {"text": "• Semelle intermédiaire : Mousse bio-sourcée pour l'amorti"}
                ]
            },
            {
                "children": [
                    {"text": "• Doublure : Textile recyclé respirant et antibactérien"}
                ]
            },
            {
                "children": [
                    {"text": "• Fabrication : Europe, dans le respect des standards sociaux"}
                ]
            }
        ])

        # Section engagement TERRA
        description.extend([
            {
                "children": [
                    {"text": ""}
                ]
            },
            {
                "children": [
                    {"text": "🌍 Engagement TERRA", "bold": True}
                ]
            },
            {
                "children": [
                    {"text": "• 3 arbres plantés pour chaque paire vendue"}
                ]
            },
            {
                "children": [
                    {"text": "• Emballage 100% recyclé et recyclable"}
                ]
            },
            {
                "children": [
                    {"text": "• Programme de reprise et recyclage des anciennes paires"}
                ]
            }
        ])

        return description

    def create_complete_product(self, index: int) -> Dict:
        """Créer un produit complet avec image et description"""

        # Données de marques avec caractéristiques réalistes
        brands = [
            {"name": "Nike", "eco_range": (7.0, 8.5), "price_range": (120, 200)},
            {"name": "Adidas", "eco_range": (7.5, 8.5), "price_range": (110, 190)},
            {"name": "Veja", "eco_range": (8.5, 9.5), "price_range": (100, 150)},
            {"name": "Allbirds", "eco_range": (8.0, 9.0), "price_range": (90, 130)},
            {"name": "New Balance", "eco_range": (7.0, 8.0), "price_range": (100, 160)},
            {"name": "Puma", "eco_range": (7.0, 8.0), "price_range": (80, 140)},
        ]

        models = [
            "Court Sustainable", "Runner Bio", "Classic Natural", "Urban Green",
            "Move Recycled", "Origin Pure", "Limited Earth", "Air Max Eco"
        ]

        # Sélections aléatoires
        brand_info = random.choice(brands)
        model = random.choice(models)
        collection = random.choice(["origin", "move", "limited"])

        # Prix et éco-score cohérents avec la marque
        price = random.randint(*brand_info["price_range"])
        eco_score = round(random.uniform(*brand_info["eco_range"]), 1)

        # Matériaux (2-3 par produit)
        selected_materials = random.sample(ECO_MATERIALS, random.randint(2, 3))

        # Couleurs TERRA
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

        # Tailles avec stock réaliste
        sizes = []
        available_sizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]
        for size in random.sample(available_sizes, random.randint(6, 8)):
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

        # Description riche
        rich_description = self.generate_rich_description(
            f"{brand_info['name']} {model}",
            collection,
            selected_materials
        )

        # Sélectionner une image placeholder
        placeholder_image = None
        if self.available_images:
            placeholder_image = random.choice(self.available_images)

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
            "isFeatured": random.random() < 0.15,  # 15% featured
            "isNewArrival": random.random() < 0.20,  # 20% nouveautés
            "_status": "published",
            "placeholder_image": placeholder_image,
            "materials": [mat["name"] for mat in selected_materials]
        }

    def create_product_with_everything(self, product_data: Dict) -> Dict:
        """Créer un produit avec image et description dans Payload"""
        try:
            # Upload de l'image placeholder si disponible
            if product_data.get('placeholder_image'):
                alt_text = f"{product_data['title']} - Sneaker écoresponsable TERRA"
                image_doc = self.upload_image_to_payload(product_data['placeholder_image'], alt_text)
                if image_doc and 'id' in image_doc:
                    product_data["images"] = [{"image": image_doc["id"], "alt": alt_text}]

            # Nettoyer les données avant envoi
            product_data.pop('placeholder_image', None)
            product_data.pop('materials', None)

            # Créer le produit
            response = self.session.post(
                f"{PAYLOAD_API_URL}/products",
                json=product_data
            )

            if response.status_code == 201:
                result = response.json()
                return result
            else:
                print(f"   ❌ Erreur API: {response.status_code}")
                print(f"   📄 Réponse: {response.text[:200]}")
                return None

        except Exception as e:
            print(f"   ❌ Exception: {e}")
            return None

    def final_import(self, total_products: int = 30):
        """Import final avec tout : images + descriptions"""
        print(f"🚀 TERRA Final Import - {total_products} produits complets")
        print("=" * 60)

        if not self.available_images:
            print("❌ Aucune image placeholder trouvée. Lancez d'abord create_placeholder_images.py")
            return False

        if not self.authenticate_payload():
            return False

        success_count = 0
        failed_count = 0

        for i in range(1, total_products + 1):
            try:
                print(f"\n📦 Produit {i}/{total_products}")

                # Générer produit complet
                product_data = self.create_complete_product(i)
                print(f"   🏷️  {product_data['title']}")
                print(f"   💰 {product_data['price']}€ - Éco-score: {product_data['ecoScore']}")
                print(f"   🌱 Matériaux: {', '.join(product_data['materials'])}")
                print(f"   📦 Collection: {product_data['collection'].title()}")

                # Créer dans Payload
                result = self.create_product_with_everything(product_data)

                if result:
                    success_count += 1
                    print(f"   ✅ Créé avec succès !")
                else:
                    failed_count += 1
                    print(f"   ❌ Échec")

                # Rate limiting
                time.sleep(0.5)

            except Exception as e:
                print(f"❌ Erreur produit {i}: {e}")
                failed_count += 1
                continue

        print(f"\n🎉 Import terminé!")
        print(f"✅ Succès: {success_count}")
        print(f"❌ Échecs: {failed_count}")
        print(f"📊 Taux: {(success_count/total_products)*100:.1f}%")
        print(f"\n🌐 Voir les résultats: http://localhost:3000/admin/collections/products")

        return True

def main():
    print("🌱 TERRA Final Importer v3.0")
    print("Images stylées + Descriptions riches")
    print("=" * 50)

    # Paramètres
    total = input("Nombre de produits complets (défaut: 30): ").strip()
    total = int(total) if total.isdigit() else 30

    if total > 100:
        print("⚠️ Limitez à 100 pour éviter la surcharge")
        total = 100

    confirm = input(f"Créer {total} produits avec images et descriptions? (y/N): ").strip().lower()
    if confirm != 'y':
        print("❌ Annulé")
        return

    # Lancer l'import final
    importer = FinalImporter()
    importer.final_import(total)

if __name__ == "__main__":
    main()
