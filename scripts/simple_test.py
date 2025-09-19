#!/usr/bin/env python3
"""
Test simple pour créer quelques produits TERRA sans images
"""

import requests
import json
import random

# Configuration
PAYLOAD_API_URL = "http://localhost:3000/api"
PAYLOAD_EMAIL = "admin@terra-sneakers.com"
PAYLOAD_PASSWORD = "TerraAdmin2024!"

# Couleurs TERRA
TERRA_COLORS = [
    {"name": "Stone White", "value": "#F5F5F0"},
    {"name": "Urban Black", "value": "#1A1A1A"},
    {"name": "Terra Green", "value": "#2D5A27"},
    {"name": "Clay Orange", "value": "#D4725B"},
    {"name": "Sage Green", "value": "#9CAF88"},
]

def authenticate():
    """S'authentifier avec Payload"""
    session = requests.Session()

    response = session.post(
        f"{PAYLOAD_API_URL}/users/login",
        json={
            "email": PAYLOAD_EMAIL,
            "password": PAYLOAD_PASSWORD
        }
    )

    if response.status_code == 200:
        token = response.json().get("token")
        session.headers.update({
            "Authorization": f"Bearer {token}"
        })
        print("✅ Authentification réussie")
        return session
    else:
        print(f"❌ Erreur authentification: {response.status_code}")
        print(response.text)
        return None

def create_test_product(session, index):
    """Créer un produit de test"""

    # Données de base
    brands = ["Nike", "Adidas", "Veja", "Allbirds"]
    models = ["Sustainable Runner", "Eco Court", "Bio Classic", "Ocean Walker"]
    collections = ["origin", "move", "limited"]

    brand = random.choice(brands)
    model = random.choice(models)
    collection = random.choice(collections)
    price = random.randint(90, 220)
    eco_score = round(random.uniform(7.0, 9.5), 1)

    # Génération tailles avec stock
    sizes = []
    available_sizes = ["38", "39", "40", "41", "42", "43"]
    for size in random.sample(available_sizes, 4):
        stock = random.randint(10, 50)
        sizes.append({
            "size": size,
            "stock": stock,
            "reservedStock": 0,
            "availableStock": stock,
            "lowStockThreshold": 5,
            "isLowStock": stock <= 10,
            "isOutOfStock": False
        })

    # Couleurs
    color = random.choice(TERRA_COLORS)
    colors = [{
        "name": color["name"],
        "value": color["value"],
        "images": []
    }]

    product_data = {
        "title": f"TERRA {brand} {model} #{index}",
        "slug": f"terra-{brand.lower()}-{model.lower().replace(' ', '-')}-{index}",
        "collection": collection,
        "price": price,
        "shortDescription": f"Sneaker écoresponsable {brand} avec matériaux durables",
        "description": [
            {
                "children": [
                    {
                        "text": f"La {brand} {model} incarne l'engagement TERRA pour un style urbain écoresponsable. Conçue avec des matériaux innovants et durables."
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

    try:
        response = session.post(
            f"{PAYLOAD_API_URL}/products",
            json=product_data
        )

        if response.status_code == 201:
            result = response.json()
            print(f"✅ Produit créé: {result.get('title', 'Unknown')} (ID: {result.get('id', 'Unknown')})")
            return True
        else:
            print(f"❌ Erreur création: {response.status_code}")
            print(response.text[:200])
            return False

    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def main():
    print("🧪 Test création produits TERRA")
    print("=" * 40)

    # Authentification
    session = authenticate()
    if not session:
        return

    # Créer quelques produits de test
    success_count = 0
    total = 5

    for i in range(1, total + 1):
        print(f"\n📦 Test {i}/{total}")
        if create_test_product(session, i):
            success_count += 1

    print(f"\n🎉 Résultats:")
    print(f"✅ Réussis: {success_count}/{total}")
    print(f"📊 Taux: {(success_count/total)*100:.1f}%")

if __name__ == "__main__":
    main()
