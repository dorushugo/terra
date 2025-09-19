#!/usr/bin/env python3
"""
Script pour rebrander les produits avec des noms cohérents
Adapte les noms aux images NOBRAND récupérées
"""

import os
import sys
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

PAYLOAD_API_URL = os.environ.get('PAYLOAD_API_URL', 'http://localhost:3000/api')
ADMIN_EMAIL = os.environ.get('PAYLOAD_EMAIL', 'admin@terra-sneakers.com')
ADMIN_PASSWORD = os.environ.get('PAYLOAD_PASSWORD', 'TerraAdmin2024!')

# Noms de produits cohérents avec le style NOBRAND/TERRA
TERRA_PRODUCT_NAMES = [
    # Collection Origin (classique, intemporel)
    "TERRA Origin Classic White",
    "TERRA Origin Pure Beige",
    "TERRA Origin Stone Grey",
    "TERRA Origin Natural Brown",
    "TERRA Origin Minimal Black",
    "TERRA Origin Clean Taupe",
    "TERRA Origin Essential White",
    "TERRA Origin Timeless Grey",
    "TERRA Origin Heritage Brown",
    "TERRA Origin Signature Beige",

    # Collection Move (sport, performance)
    "TERRA Move Runner White",
    "TERRA Move Athletic Grey",
    "TERRA Move Performance Black",
    "TERRA Move Sport Beige",
    "TERRA Move Active Brown",
    "TERRA Move Dynamic White",
    "TERRA Move Training Grey",
    "TERRA Move Fitness Black",
    "TERRA Move Energy Beige",
    "TERRA Move Power Brown",

    # Collection Limited (premium, exclusif)
    "TERRA Limited Edition White",
    "TERRA Limited Artisan Grey",
    "TERRA Limited Craft Black",
    "TERRA Limited Studio Beige",
    "TERRA Limited Designer Brown",
    "TERRA Limited Premium White",
    "TERRA Limited Exclusive Grey",
    "TERRA Limited Signature Black",
    "TERRA Limited Master Beige",
    "TERRA Limited Elite Brown",

    # Variations supplémentaires
    "TERRA Classic Court White",
    "TERRA Classic Street Grey",
    "TERRA Classic Urban Black",
    "TERRA Classic Minimal Beige",
    "TERRA Classic Essential Brown",
    "TERRA Sustainable Runner White",
    "TERRA Sustainable Court Grey",
    "TERRA Sustainable Urban Black",
    "TERRA Sustainable Pure Beige",
    "TERRA Sustainable Clean Brown",
    "TERRA Eco Runner White",
    "TERRA Eco Court Grey",
    "TERRA Eco Urban Black",
    "TERRA Eco Natural Beige",
    "TERRA Eco Minimal Brown",
    "TERRA Bio Classic White",
    "TERRA Bio Pure Grey",
    "TERRA Bio Clean Black",
    "TERRA Bio Natural Beige",
    "TERRA Bio Essential Brown",
    "TERRA Recycled Runner White",
    "TERRA Recycled Court Grey",
    "TERRA Recycled Urban Black",
    "TERRA Recycled Pure Beige",
    "TERRA Recycled Clean Brown",
    "TERRA Organic Classic White",
    "TERRA Organic Pure Grey",
    "TERRA Organic Natural Black",
    "TERRA Organic Clean Beige",
    "TERRA Organic Essential Brown",
]

# Descriptions courtes cohérentes
TERRA_DESCRIPTIONS = [
    "Chaussure éco-responsable au design intemporel",
    "Sneaker durable fabriquée avec des matériaux recyclés",
    "Modèle classique alliant style et durabilité",
    "Chaussure minimaliste pour un quotidien conscient",
    "Design épuré respectueux de l'environnement",
    "Sneaker premium aux finitions artisanales",
    "Modèle polyvalent pour toutes les occasions",
    "Chaussure urbaine au confort optimal",
    "Design moderne avec impact environnemental réduit",
    "Sneaker élégante aux matériaux naturels",
    "Modèle iconique revisité de façon durable",
    "Chaussure performante et respectueuse",
    "Design authentique aux lignes épurées",
    "Sneaker confortable pour un style décontracté",
    "Modèle signature de la collection TERRA",
]

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

    def get_all_products(self) -> List[Dict]:
        r = self.session.get(f"{PAYLOAD_API_URL}/products", params={'limit': 200})
        if r.status_code == 200:
            return r.json().get('docs', [])
        return []

    def update_product_names(self, product_id: str, new_data: Dict) -> bool:
        r = self.session.patch(f"{PAYLOAD_API_URL}/products/{product_id}", json=new_data)
        if r.status_code == 200:
            return True
        print(f'❌ Erreur mise à jour produit {product_id}: {r.status_code} {r.text[:200]}')
        return False

def generate_slug(title: str) -> str:
    """Génère un slug URL-friendly"""
    return title.lower().replace(' ', '-').replace('terra-', '').strip('-')

def assign_collection_from_name(name: str) -> str:
    """Détermine la collection depuis le nom"""
    name_lower = name.lower()
    if 'origin' in name_lower or 'classic' in name_lower or 'heritage' in name_lower:
        return 'origin'
    elif 'move' in name_lower or 'runner' in name_lower or 'athletic' in name_lower or 'sport' in name_lower:
        return 'move'
    elif 'limited' in name_lower or 'premium' in name_lower or 'exclusive' in name_lower:
        return 'limited'
    else:
        return 'origin'  # Par défaut

def main():
    print('🏷️  TERRA Product Rebranding - Noms cohérents')
    print('✨ Adaptation des noms pour correspondre au style des images')

    # Connexion
    payload = PayloadClient()
    if not payload.login():
        print('❌ Authentification échouée')
        sys.exit(1)

    # Récupérer tous les produits
    products = payload.get_all_products()
    print(f'📦 {len(products)} produits trouvés')

    if not products:
        print('❌ Aucun produit à traiter')
        return

    # Options de rebranding
    print('\nOptions de rebranding :')
    print('1. Renommer TOUS les produits avec des noms TERRA cohérents')
    print('2. Nettoyer seulement les noms existants (garder la structure)')
    print('3. Renommer seulement les produits avec images NOBRAND')

    choice = input('\nChoix (1-3, défaut 1): ').strip() or '1'

    import random
    random.shuffle(TERRA_PRODUCT_NAMES)
    random.shuffle(TERRA_DESCRIPTIONS)

    success = 0

    for i, product in enumerate(products):
        old_title = product.get('title', '')
        product_id = product.get('id')

        print(f'\n🏷️  {i+1}/{len(products)} - {old_title}')

        if choice == '1':
            # Renommer complètement
            if i < len(TERRA_PRODUCT_NAMES):
                new_title = TERRA_PRODUCT_NAMES[i]
                new_description = TERRA_DESCRIPTIONS[i % len(TERRA_DESCRIPTIONS)]
                new_collection = assign_collection_from_name(new_title)

                new_data = {
                    'title': new_title,
                    'slug': generate_slug(new_title),
                    'shortDescription': new_description,
                    'collection': new_collection
                }

        elif choice == '2':
            # Nettoyer les noms existants
            # Supprimer les marques tierces et garder TERRA
            cleaned_title = old_title
            brands_to_remove = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Veja', 'Allbirds',
                              'Reebok', 'Salomon', 'Vans', 'ASICS', 'On Running', 'Converse']

            for brand in brands_to_remove:
                cleaned_title = cleaned_title.replace(f'TERRA {brand}', 'TERRA')
                cleaned_title = cleaned_title.replace(brand, '')

            # Nettoyer les espaces multiples
            cleaned_title = ' '.join(cleaned_title.split())

            if cleaned_title != old_title:
                new_data = {
                    'title': cleaned_title,
                    'slug': generate_slug(cleaned_title)
                }
            else:
                continue

        elif choice == '3':
            # Renommer seulement si le produit a une image (présumé NOBRAND)
            images = product.get('images', [])
            if not images or len(images) == 0:
                continue

            if i < len(TERRA_PRODUCT_NAMES):
                new_title = TERRA_PRODUCT_NAMES[i]
                new_description = TERRA_DESCRIPTIONS[i % len(TERRA_DESCRIPTIONS)]
                new_collection = assign_collection_from_name(new_title)

                new_data = {
                    'title': new_title,
                    'slug': generate_slug(new_title),
                    'shortDescription': new_description,
                    'collection': new_collection
                }

        # Appliquer les changements
        if 'new_data' in locals() and new_data:
            if payload.update_product_names(str(product_id), new_data):
                success += 1
                print(f'✅ Renommé: {new_data.get("title", "Mis à jour")}')
            else:
                print('❌ Échec')
        else:
            print('⏭️  Ignoré')

        # Reset pour le prochain produit
        if 'new_data' in locals():
            del new_data

    print(f'\n🎉 Terminé!')
    print(f'✅ Produits renommés: {success}/{len(products)}')
    print(f'📊 Taux de réussite: {success/len(products)*100:.1f}%')
    print('\n🏷️  Noms maintenant cohérents avec le style TERRA!')

if __name__ == '__main__':
    main()
