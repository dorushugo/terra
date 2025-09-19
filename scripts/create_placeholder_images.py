#!/usr/bin/env python3
"""
Créer des images placeholder stylées pour les sneakers TERRA
"""

import os
import requests
from PIL import Image, ImageDraw, ImageFont
import random

# Configuration
IMAGES_DIR = "placeholder_images"
TERRA_COLORS = {
    "Stone White": "#F5F5F0",
    "Urban Black": "#1A1A1A",
    "Terra Green": "#2D5A27",
    "Clay Orange": "#D4725B",
    "Sage Green": "#9CAF88"
}

def create_styled_placeholder(brand: str, model: str, color_name: str, filename: str):
    """Créer un placeholder stylé pour une sneaker"""

    # Taille standard
    width, height = 800, 600

    # Couleurs
    bg_color = TERRA_COLORS.get(color_name, "#F5F5F0")

    # Créer l'image
    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    # Couleur du texte (contraste avec le fond)
    if color_name in ["Urban Black", "Terra Green"]:
        text_color = "#FFFFFF"
        accent_color = "#F5F5F0"
    else:
        text_color = "#1A1A1A"
        accent_color = "#2D5A27"

    # Dessiner une forme de sneaker stylisée
    # Semelle
    sole_points = [
        (150, 450), (650, 450), (680, 470), (650, 490), (150, 490), (120, 470)
    ]
    draw.polygon(sole_points, fill=accent_color, outline=text_color, width=3)

    # Corps de la chaussure
    shoe_points = [
        (200, 300), (600, 300), (650, 350), (600, 450), (200, 450), (150, 350)
    ]
    draw.polygon(shoe_points, fill=text_color, outline=accent_color, width=4)

    # Détails
    # Lacets
    for i in range(5):
        x = 300 + i * 40
        y = 320 + i * 10
        draw.ellipse([x-5, y-5, x+5, y+5], fill=accent_color)

    # Logo TERRA
    try:
        # Essayer de charger une police
        font_large = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 48)
        font_medium = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 24)
        font_small = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 18)
    except:
        # Fallback sur la police par défaut
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # Texte principal
    draw.text((width//2, 150), "TERRA", font=font_large, anchor="mm", fill=text_color)
    draw.text((width//2, 200), f"{brand} {model}", font=font_medium, anchor="mm", fill=text_color)
    draw.text((width//2, 240), color_name, font=font_small, anchor="mm", fill=accent_color)

    # Badge éco
    draw.ellipse([50, 50, 150, 150], fill=accent_color, outline=text_color, width=3)
    draw.text((100, 100), "ECO", font=font_medium, anchor="mm", fill=text_color)

    # Sauvegarder
    output_path = f"{IMAGES_DIR}/{filename}.jpg"
    img.save(output_path, "JPEG", quality=85)
    return output_path

def create_placeholder_set():
    """Créer un set de placeholders pour différentes combinaisons"""

    os.makedirs(IMAGES_DIR, exist_ok=True)

    brands = ["Nike", "Adidas", "Veja", "Allbirds", "Puma"]
    models = ["Court", "Runner", "Classic", "Urban", "Move"]

    created_images = []

    for i, brand in enumerate(brands):
        for j, model in enumerate(models):
            color_name = list(TERRA_COLORS.keys())[j % len(TERRA_COLORS)]
            filename = f"terra_{brand.lower()}_{model.lower()}_{color_name.lower().replace(' ', '_')}"

            print(f"🎨 Création: {brand} {model} - {color_name}")

            image_path = create_styled_placeholder(brand, model, color_name, filename)
            created_images.append({
                "path": image_path,
                "filename": filename,
                "brand": brand,
                "model": model,
                "color": color_name
            })

    print(f"\n✅ {len(created_images)} images créées dans {IMAGES_DIR}/")
    return created_images

if __name__ == "__main__":
    print("🎨 TERRA Placeholder Generator")
    print("=" * 40)

    images = create_placeholder_set()

    print("\n📋 Images créées:")
    for img in images[:5]:  # Afficher les 5 premières
        print(f"  • {img['filename']}.jpg")

    print(f"\n🎉 Total: {len(images)} images stylées prêtes!")
