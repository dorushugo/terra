#!/usr/bin/env python3
"""
Test des descriptions riches sans images
"""

import requests
import json
import random

# Configuration
PAYLOAD_API_URL = "http://localhost:3000/api"
PAYLOAD_EMAIL = "admin@terra-sneakers.com"
PAYLOAD_PASSWORD = "TerraAdmin2024!"

# Templates de descriptions
DESCRIPTION_TEMPLATES = {
    "origin": [
        "Incarnation parfaite de l'élégance minimaliste, cette sneaker TERRA Origin allie design intemporel et conscience environnementale. Chaque détail a été pensé pour créer une chaussure qui traverse les saisons sans jamais se démoder.",
    ],
    "move": [
        "Conçue pour l'action, cette sneaker TERRA Move combine performance technique et style urbain. Chaque innovation intégrée vous accompagne dans vos mouvements quotidiens avec fluidité et conscience.",
    ],
    "limited": [
        "Édition exclusive qui raconte une histoire unique. Cette TERRA Limited est le fruit d'une collaboration artistique et d'innovations matériaux, créant une pièce d'exception pour les connaisseurs.",
    ]
}

ECO_MATERIALS = [
    {"name": "Cuir Apple", "desc": "Cuir innovant fabriqué à partir de déchets de pommes", "impact": "95% moins d'eau"},
    {"name": "Ocean Plastic", "desc": "Plastique recyclé collecté dans les océans", "impact": "5 bouteilles recyclées/paire"},
    {"name": "Coton Bio", "desc": "Coton cultivé sans pesticides ni produits chimiques", "impact": "60% moins d'eau"},
]

def authenticate():
    session = requests.Session()
    response = session.post(
        f"{PAYLOAD_API_URL}/users/login",
        json={"email": PAYLOAD_EMAIL, "password": PAYLOAD_PASSWORD}
    )

    if response.status_code == 200:
        token = response.json().get("token")
        session.headers.update({"Authorization": f"Bearer {token}"})
        print("✅ Authentification réussie")
        return session
    else:
        print(f"❌ Erreur: {response.status_code}")
        return None

def generate_rich_description(product_name: str, collection: str, materials: list) -> list:
    """Générer une description riche"""

    templates = DESCRIPTION_TEMPLATES.get(collection, DESCRIPTION_TEMPLATES["origin"])
    base_desc = random.choice(templates)

    # Description structurée pour Payload
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

    # Ajouter matériaux
    for mat in materials[:2]:
        description.append({
            "children": [
                {"text": f"• **{mat['name']}** : {mat['desc']} ({mat['impact']})"}
            ]
        })

    # Section technique
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
        }
    ])

    return description

def create_test_product(session, index):
    """Créer un produit de test avec description riche"""

    collection = random.choice(["origin", "move", "limited"])
    materials = random.sample(ECO_MATERIALS, 2)

    product_data = {
        "title": f"TERRA Test Description #{index}",
        "slug": f"terra-test-description-{index}",
        "collection": collection,
        "price": random.randint(90, 180),
        "shortDescription": f"Test avec {materials[0]['name']} - Description riche",
        "description": generate_rich_description(f"Test #{index}", collection, materials),
        "colors": [{
            "name": "Stone White",
            "value": "#F5F5F0",
            "images": []
        }],
        "sizes": [{
            "size": "42",
            "stock": 10,
            "reservedStock": 0,
            "availableStock": 10,
            "lowStockThreshold": 5,
            "isLowStock": False,
            "isOutOfStock": False
        }],
        "ecoScore": round(random.uniform(7.0, 9.0), 1),
        "isFeatured": False,
        "isNewArrival": True,
        "_status": "published"
    }

    try:
        response = session.post(f"{PAYLOAD_API_URL}/products", json=product_data)

        if response.status_code == 201:
            result = response.json()
            print(f"✅ Produit créé: {product_data['title']}")
            return True
        else:
            print(f"❌ Erreur: {response.status_code}")
            print(response.text[:300])
            return False

    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def main():
    print("🧪 Test des descriptions riches")
    print("=" * 40)

    session = authenticate()
    if not session:
        return

    # Créer 3 produits de test
    success = 0
    for i in range(1, 4):
        print(f"\n📦 Test {i}/3")
        if create_test_product(session, i):
            success += 1

    print(f"\n🎉 Résultats: {success}/3 réussis")

if __name__ == "__main__":
    main()
