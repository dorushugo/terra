#!/usr/bin/env python3
"""
Test du système de gestion des stocks TERRA
"""

import requests
import json
import time

# Configuration
PAYLOAD_API_URL = "http://localhost:3000/api"
PAYLOAD_EMAIL = "admin@terra-sneakers.com"
PAYLOAD_PASSWORD = "TerraAdmin2024!"

class StockSystemTester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None

    def authenticate(self):
        """S'authentifier avec Payload"""
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
                print("✅ Authentification réussie")
                return True
            else:
                print(f"❌ Erreur authentification: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Erreur connexion: {e}")
            return False

    def create_test_product(self):
        """Créer un produit de test avec stock"""
        product_data = {
            "title": "TERRA Test Stock Product",
            "slug": "terra-test-stock-product",
            "collection": "origin",
            "price": 120,
            "shortDescription": "Produit de test pour le système de stock",
            "description": [
                {
                    "children": [
                        {"text": "Produit de test pour valider le système de gestion des stocks TERRA."}
                    ]
                }
            ],
            "colors": [{
                "name": "Test White",
                "value": "#FFFFFF",
                "images": []
            }],
            "sizes": [
                {
                    "size": "42",
                    "stock": 10,
                    "reservedStock": 0,
                    "lowStockThreshold": 3,
                },
                {
                    "size": "43",
                    "stock": 2,
                    "reservedStock": 0,
                    "lowStockThreshold": 5,
                },
                {
                    "size": "44",
                    "stock": 0,
                    "reservedStock": 0,
                    "lowStockThreshold": 3,
                }
            ],
            "ecoScore": 8.5,
            "isFeatured": False,
            "isNewArrival": True,
            "_status": "published"
        }

        try:
            response = self.session.post(f"{PAYLOAD_API_URL}/products", json=product_data)
            if response.status_code == 201:
                result = response.json()
                print(f"✅ Produit de test créé: {result.get('id')}")
                return result.get('id')
            else:
                print(f"❌ Erreur création produit: {response.status_code}")
                print(response.text[:300])
                return None
        except Exception as e:
            print(f"❌ Exception: {e}")
            return None

    def check_stock_alerts(self):
        """Vérifier la création automatique d'alertes"""
        try:
            response = self.session.get(f"{PAYLOAD_API_URL}/stock-alerts?where[isResolved][equals]=false")
            if response.status_code == 200:
                alerts = response.json().get('docs', [])
                print(f"📋 Alertes actives trouvées: {len(alerts)}")
                for alert in alerts[:3]:  # Afficher les 3 premières
                    print(f"   • {alert.get('alertType')} - {alert.get('message')}")
                return len(alerts)
            else:
                print(f"❌ Erreur récupération alertes: {response.status_code}")
                return 0
        except Exception as e:
            print(f"❌ Erreur: {e}")
            return 0

    def create_stock_movement(self, product_id):
        """Créer un mouvement de stock"""
        movement_data = {
            "type": "restock",
            "product": product_id,
            "size": "44",
            "quantity": 15,
            "reason": "Test de réapprovisionnement",
            "supplierReference": "TEST-REF-001",
            "unitCost": 45.00,
            "notes": "Test du système de mouvements de stock"
        }

        try:
            response = self.session.post(f"{PAYLOAD_API_URL}/stock-movements", json=movement_data)
            if response.status_code == 201:
                result = response.json()
                print(f"✅ Mouvement de stock créé: {result.get('reference')}")
                return result.get('id')
            else:
                print(f"❌ Erreur création mouvement: {response.status_code}")
                print(response.text[:300])
                return None
        except Exception as e:
            print(f"❌ Exception: {e}")
            return None

    def check_stock_stats(self):
        """Vérifier les statistiques de stock"""
        try:
            response = self.session.get(f"{PAYLOAD_API_URL}/admin/stock-stats")
            if response.status_code == 200:
                stats = response.json()
                print("📊 Statistiques de stock:")
                print(f"   • Produits total: {stats.get('totalProducts')}")
                print(f"   • Stock faible: {stats.get('lowStockProducts')}")
                print(f"   • Ruptures: {stats.get('outOfStockProducts')}")
                print(f"   • Valeur stock: {stats.get('stockValue')}€")
                print(f"   • Alertes: {stats.get('pendingAlerts')}")
                return True
            else:
                print(f"❌ Erreur stats: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Erreur: {e}")
            return False

    def test_bulk_restock(self, product_id):
        """Tester le réapprovisionnement en masse"""
        restock_data = {
            "items": [
                {
                    "productId": product_id,
                    "size": "42",
                    "quantity": 20,
                    "unitCost": 50.00,
                    "supplierReference": "BULK-TEST-001",
                    "reason": "Test réapprovisionnement en masse"
                },
                {
                    "productId": product_id,
                    "size": "43",
                    "quantity": 10,
                    "unitCost": 50.00,
                    "supplierReference": "BULK-TEST-002",
                    "reason": "Test réapprovisionnement en masse"
                }
            ],
            "reason": "Test du système de réapprovisionnement en masse"
        }

        try:
            response = self.session.post(f"{PAYLOAD_API_URL}/admin/bulk-restock", json=restock_data)
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Réapprovisionnement en masse réussi:")
                print(f"   • Total: {result['summary']['total']}")
                print(f"   • Succès: {result['summary']['success']}")
                print(f"   • Erreurs: {result['summary']['errors']}")
                return True
            else:
                print(f"❌ Erreur réapprovisionnement: {response.status_code}")
                print(response.text[:300])
                return False
        except Exception as e:
            print(f"❌ Exception: {e}")
            return False

    def run_complete_test(self):
        """Exécuter le test complet du système"""
        print("🧪 Test du système de gestion des stocks TERRA")
        print("=" * 60)

        if not self.authenticate():
            return False

        # 1. Créer un produit de test
        print("\n📦 Étape 1: Création d'un produit de test")
        product_id = self.create_test_product()
        if not product_id:
            return False

        # Attendre un peu pour que les hooks se déclenchent
        print("⏳ Attente pour les hooks automatiques...")
        time.sleep(2)

        # 2. Vérifier les alertes automatiques
        print("\n🚨 Étape 2: Vérification des alertes automatiques")
        alerts_count = self.check_stock_alerts()

        # 3. Créer un mouvement de stock
        print("\n📋 Étape 3: Création d'un mouvement de stock")
        movement_id = self.create_stock_movement(product_id)

        # 4. Tester le réapprovisionnement en masse
        print("\n📦 Étape 4: Test du réapprovisionnement en masse")
        bulk_success = self.test_bulk_restock(product_id)

        # 5. Vérifier les statistiques
        print("\n📊 Étape 5: Vérification des statistiques")
        stats_success = self.check_stock_stats()

        # Résumé
        print("\n🎉 Résumé du test:")
        print("=" * 40)
        results = [
            ("Produit créé", product_id is not None),
            ("Alertes générées", alerts_count > 0),
            ("Mouvement créé", movement_id is not None),
            ("Réappro en masse", bulk_success),
            ("Statistiques", stats_success)
        ]

        for test_name, success in results:
            status = "✅" if success else "❌"
            print(f"{status} {test_name}")

        success_rate = sum(1 for _, success in results if success) / len(results)
        print(f"\n📊 Taux de réussite: {success_rate*100:.0f}%")

        if success_rate >= 0.8:
            print("🎉 Système de stock fonctionnel !")
        else:
            print("⚠️ Certains problèmes détectés")

        return success_rate >= 0.8

def main():
    tester = StockSystemTester()
    success = tester.run_complete_test()

    if success:
        print("\n🌐 Accès admin: http://localhost:3000/admin")
        print("📊 Dashboard stock: http://localhost:3000/admin/stock-dashboard")

    return success

if __name__ == "__main__":
    main()
