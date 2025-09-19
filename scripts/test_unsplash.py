#!/usr/bin/env python3
"""
Test rapide de l'API Unsplash pour vérifier la connectivité
"""

import os
import sys
import requests

UNSPLASH_ACCESS_KEY = os.environ.get('UNSPLASH_ACCESS_KEY')

def test_unsplash_api():
    if not UNSPLASH_ACCESS_KEY:
        print("❌ UNSPLASH_ACCESS_KEY non définie")
        print("Utilisez: export UNSPLASH_ACCESS_KEY=your_key")
        return False
    
    print("🔍 Test de l'API Unsplash...")
    
    headers = {
        'Authorization': f'Client-ID {UNSPLASH_ACCESS_KEY}',
        'Accept-Version': 'v1'
    }
    
    params = {
        'query': 'sneakers',
        'per_page': 3,
        'orientation': 'squarish'
    }
    
    try:
        r = requests.get('https://api.unsplash.com/search/photos', 
                        headers=headers, params=params, timeout=10)
        
        if r.status_code == 200:
            data = r.json()
            results = data.get('results', [])
            print(f"✅ API fonctionnelle - {len(results)} images trouvées")
            
            for i, photo in enumerate(results[:3], 1):
                print(f"  {i}. {photo.get('alt_description', 'Sans description')}")
                print(f"     Par: {photo['user']['name']}")
                print(f"     URL: {photo['urls']['small']}")
            
            return True
        else:
            print(f"❌ Erreur API: {r.status_code}")
            print(f"Réponse: {r.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        return False

if __name__ == '__main__':
    success = test_unsplash_api()
    sys.exit(0 if success else 1)
