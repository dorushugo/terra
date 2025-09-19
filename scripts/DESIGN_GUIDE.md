# Guide d'Identité Visuelle TERRA

## 🎨 Problème actuel

Les images sont trop variées : différents styles, arrière-plans, éclairages, angles...
Cela nuit à la cohérence visuelle de la marque TERRA.

## ✨ Solutions proposées

### 1. Images Curées avec Critères Stricts

**Script**: `curated_images.py`

**Critères visuels appliqués**:

- ✅ **Fond blanc/neutre** uniquement
- ✅ **Photographie de produit** professionnelle
- ✅ **Éclairage studio** uniforme
- ✅ **Format carré** (squarish) pour la cohérence
- ✅ **Style minimal/clean**
- ❌ **Éviter**: personnes, pieds, lifestyle, street style

### 2. Génération d'Images IA (Recommandé)

**Avantages**:

- Contrôle total du style visuel
- Cohérence parfaite entre tous les produits
- Personnalisation selon les couleurs TERRA
- Pas de droits d'auteur

**APIs suggérées**:

- **Midjourney API** (meilleure qualité)
- **DALL-E 3** (OpenAI)
- **Stable Diffusion** (open source)

### 3. Photographie Professionnelle

**Setup recommandé**:

- Fond blanc uni
- Éclairage softbox 2-3 points
- Angle 45° standardisé
- Format 1:1 (carré)
- Résolution 1200x1200px minimum

## 🚀 Prompt IA pour images cohérentes

```
"Professional product photography of [SHOE_TYPE],
clean white background, studio lighting, minimal style,
square format, commercial photography, high resolution,
no people, isolated product, TERRA brand aesthetic"
```

## 🎯 Mise en œuvre

### Option A: Images Curées Unsplash

```bash
python3 curated_images.py
```

### Option B: Génération IA (recommandé)

1. Configurer API Midjourney/DALL-E
2. Utiliser prompts standardisés
3. Générer par lots avec variations

### Option C: Mix des deux

1. Images IA pour produits principaux
2. Images curées pour compléter

## 📊 Résultats attendus

**Avant**: Images disparates, styles variés
**Après**:

- ✅ Cohérence visuelle parfaite
- ✅ Identité de marque renforcée
- ✅ Aspect professionnel
- ✅ Expérience utilisateur améliorée

## 🎨 Palette Visuelle TERRA

- **Couleurs dominantes**: Blanc, gris clair, beige naturel
- **Accent**: Vert TERRA (#22C55E)
- **Style**: Minimal, clean, éco-responsable
- **Éclairage**: Doux, naturel, uniforme
