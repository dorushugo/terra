#!/usr/bin/env python3
"""
Crée des images template uniformes avec PIL
Solution rapide pour une cohérence visuelle immédiate
"""

import os
import io
import sys
from PIL import Image, ImageDraw, ImageFont
from typing import Dict, List
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

import requests

PAYLOAD_API_URL = os.environ.get('PAYLOAD_API_URL', 'http://localhost:3000/api')
ADMIN_EMAIL = os.environ.get('PAYLOAD_EMAIL', 'admin@terra-sneakers.com')
ADMIN_PASSWORD = os.environ.get('PAYLOAD_PASSWORD', 'TerraAdmin2024!')

# Couleurs TERRA
TERRA_COLORS = {
    'background': '#FFFFFF',      # Blanc pur
    'primary': '#22C55E',         # Vert TERRA
    'secondary': '#F5F5F0',       # Stone white
    'text': '#1F2937',            # Gris foncé
    'accent': '#F97316'           # Clay orange
}

class TemplateImageGenerator:
    def __init__(self):
        self.size = (800, 800)  # Format carré

    def create_product_template(self, product_title: str, collection: str = 'origin') -> bytes:
        """Crée une image template cohérente pour un produit"""

        # Créer l'image de base
        img = Image.new('RGB', self.size, TERRA_COLORS['background'])
        draw = ImageDraw.Draw(img)

        # Fond avec dégradé subtil
        self._draw_gradient_background(draw, img)

        # Forme de chaussure stylisée
        self._draw_shoe_silhouette(draw, collection)

        # Logo TERRA en filigrane
        self._draw_terra_logo(draw, img)

        # Nom du produit
        self._draw_product_name(draw, img, product_title)

        # Collection badge
        self._draw_collection_badge(draw, img, collection)

        # Convertir en bytes
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=95)
        return buffer.getvalue()

    def _draw_gradient_background(self, draw, img):
        """Dessine un fond avec dégradé subtil"""
        width, height = self.size

        # Dégradé vertical léger
        for y in range(height):
            # De blanc pur à stone white très subtil
            alpha = int(255 * (1 - y / height * 0.05))
            color = (255, 255, min(255, 240 + alpha // 10))
            draw.line([(0, y), (width, y)], fill=color)

    def _draw_shoe_silhouette(self, draw, collection):
        """Dessine une silhouette de chaussure stylisée"""
        cx, cy = self.size[0] // 2, self.size[1] // 2

        # Couleur selon la collection
        color_map = {
            'origin': TERRA_COLORS['primary'],
            'move': TERRA_COLORS['accent'],
            'limited': TERRA_COLORS['text']
        }
        color = color_map.get(collection.lower(), TERRA_COLORS['primary'])

        # Silhouette simple de sneaker
        # Semelle
        draw.ellipse([cx-120, cy+20, cx+120, cy+60],
                    fill=(*self._hex_to_rgb(color), 40))  # Semi-transparent

        # Corps de la chaussure
        draw.rounded_rectangle([cx-100, cy-40, cx+80, cy+30],
                             radius=20, fill=(*self._hex_to_rgb(color), 60))

        # Détails
        draw.arc([cx-80, cy-20, cx+60, cy+10], 0, 180,
                fill=(*self._hex_to_rgb(color), 80), width=3)

    def _draw_terra_logo(self, draw, img):
        """Dessine le logo TERRA en filigrane"""
        try:
            # Essayer de charger une police
            font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 60)
        except:
            font = ImageFont.load_default()

        # Position en bas à droite
        text = "TERRA"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        x = self.size[0] - text_width - 30
        y = self.size[1] - text_height - 30

        # Texte en filigrane
        draw.text((x, y), text, fill=(*self._hex_to_rgb(TERRA_COLORS['primary']), 30), font=font)

    def _draw_product_name(self, draw, img, title):
        """Dessine le nom du produit"""
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 24)
        except:
            font = ImageFont.load_default()

        # Nettoyer le titre
        clean_title = title.replace('TERRA ', '').upper()
        if len(clean_title) > 30:
            clean_title = clean_title[:30] + '...'

        # Centrer en haut
        bbox = draw.textbbox((0, 0), clean_title, font=font)
        text_width = bbox[2] - bbox[0]

        x = (self.size[0] - text_width) // 2
        y = 50

        draw.text((x, y), clean_title, fill=self._hex_to_rgb(TERRA_COLORS['text']), font=font)

    def _draw_collection_badge(self, draw, img, collection):
        """Dessine le badge de collection"""
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 16)
        except:
            font = ImageFont.load_default()

        # Badge en haut à gauche
        badge_text = collection.upper()
        bbox = draw.textbbox((0, 0), badge_text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        # Background du badge
        padding = 8
        draw.rounded_rectangle([20, 20, 20 + text_width + padding*2, 20 + text_height + padding*2],
                             radius=8, fill=self._hex_to_rgb(TERRA_COLORS['primary']))

        # Texte du badge
        draw.text((20 + padding, 20 + padding), badge_text,
                 fill=self._hex_to_rgb(TERRA_COLORS['background']), font=font)

    def _hex_to_rgb(self, hex_color):
        """Convertit hex en RGB"""
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

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

    def get_products(self, limit: int = 50) -> List[Dict]:
        r = self.session.get(f"{PAYLOAD_API_URL}/products", params={'limit': limit})
        if r.status_code == 200:
            return r.json().get('docs', [])
        return []

    def update_product_image(self, product_id: str, image_bytes: bytes, filename: str, alt: str) -> bool:
        # Upload
        files = {'file': (filename, io.BytesIO(image_bytes), 'image/jpeg')}
        data = {'alt': alt}
        r = self.session.post(f"{PAYLOAD_API_URL}/media", files=files, data=data)
        if r.status_code != 201:
            return False

        result = r.json()
        media_id = result.get('id') or (result.get('doc') or {}).get('id')
        if not media_id:
            return False

        # Update
        r = self.session.patch(f"{PAYLOAD_API_URL}/products/{product_id}",
                              json={'images': [{'image': int(media_id), 'alt': alt}]})
        return r.status_code == 200

def main():
    print('🎨 Template Images - Cohérence visuelle instantanée')
    print('📐 Style: Fond blanc, silhouettes, branding TERRA')

    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        print('❌ Pillow requis: pip install Pillow')
        sys.exit(1)

    # Connexion
    payload = PayloadClient()
    if not payload.login():
        print('❌ Authentification échouée')
        sys.exit(1)

    generator = TemplateImageGenerator()

    # Paramètres
    limit_str = input('Nombre de produits (défaut 30): ').strip()
    limit = int(limit_str) if limit_str.isdigit() else 30

    # Récupérer les produits
    products = payload.get_products(limit)
    print(f'📦 {len(products)} produits à traiter')

    # Traitement
    success = 0
    for i, product in enumerate(products, 1):
        title = product.get('title') or f'Produit {i}'
        collection = product.get('collection', 'origin')

        print(f'🎨 {i}/{len(products)} - {title}')

        # Générer l'image template
        img_bytes = generator.create_product_template(title, collection)

        # Upload
        filename = f"template_{product.get('id', i)}.jpg"
        alt_text = f"{title} - Image template TERRA"

        if payload.update_product_image(str(product.get('id')), img_bytes, filename, alt_text):
            success += 1
            print('✅ Template appliqué')
        else:
            print('❌ Échec')

    print(f'\n🎉 Terminé!')
    print(f'✅ Templates créés: {success}/{len(products)}')
    print(f'🎨 Cohérence visuelle: 100% (style uniforme TERRA)')

if __name__ == '__main__':
    main()
