# 🌱 TERRA Sneakers Importer

Script Python pour importer automatiquement ~200 sneakers dans votre CMS Payload avec images optimisées.

## 🚀 Installation rapide

### 1. Installer Python et dépendances

```bash
# Depuis le dossier terra/
cd scripts/
pip install -r requirements.txt
```

### 2. Démarrer le serveur Payload

```bash
# Terminal 1 - Depuis terra/
pnpm dev
```

### 3. Configurer l'admin (première fois seulement)

```bash
# Terminal 2 - Depuis terra/scripts/
python setup_admin.py
```

### 4. Lancer l'import

```bash
python sneakers_importer.py
```

## 📊 Ce que fait le script

### ✅ **Sources de données**

- **Dataset simulé** : 200+ sneakers avec métadonnées cohérentes
- **Images placeholder** : Générées automatiquement avec couleurs TERRA
- **Marques variées** : Nike, Adidas, Puma, New Balance, Vans, etc.
- **Focus écoresponsable** : Matériaux durables, collections alignées

### ✅ **Traitement automatique**

- **Téléchargement images** : Redimensionnement 800x800, optimisation JPEG
- **Mapping collections** : Sustainable → Origin, Performance → Move, etc.
- **Génération données** : Stocks, tailles, couleurs, éco-scores
- **Upload Payload** : Création produits + images via API

### ✅ **Données générées**

- **Titre** : Format "TERRA [Nom Original]"
- **Collections** : Origin (minimaliste), Move (performance), Limited (exclusif)
- **Prix** : 80-250€ réalistes
- **Couleurs** : Palette TERRA (Stone White, Urban Black, Terra Green, etc.)
- **Tailles** : 36-45 avec stocks variables
- **Éco-score** : 7.0-9.5 pour cohérence durable

## 🎯 Résultat attendu

Après l'import, vous aurez :

- **~200 produits** dans Payload CMS
- **Images optimisées** stockées et liées
- **Données cohérentes** avec l'identité TERRA
- **Frontend fonctionnel** avec vrais produits

## 🔧 Configuration avancée

### Personnaliser les sources

```python
# Dans sneakers_importer.py, modifier :
TERRA_COLLECTIONS = {
    "sustainable": "origin",  # Vos mappings
    "performance": "move",
    # ...
}

ECO_MATERIALS = [
    "Cuir Apple",  # Vos matériaux
    "Ocean Plastic",
    # ...
]
```

### Ajouter de vraies sources

```python
def download_real_kaggle_dataset(self):
    """Utiliser la vraie API Kaggle"""
    import kaggle
    kaggle.api.dataset_download_files(
        'datafiniti/womens-shoes-prices',
        path=OUTPUT_DIR,
        unzip=True
    )
```

## 🔍 Monitoring

Le script affiche en temps réel :

- ✅ Produits importés avec succès
- ❌ Erreurs et échecs
- 📊 Taux de réussite final
- 🖼️ Statut téléchargement images

## 🚨 Troubleshooting

### Erreur "Authentification failed"

```bash
# Recréer l'admin
python setup_admin.py
```

### Erreur "Connection refused"

```bash
# Vérifier que Payload tourne
curl http://localhost:3000/api/users
```

### Images ne se chargent pas

```bash
# Vérifier les permissions
chmod +x scripts/imported_data/images/
```

## 📈 Améliorations possibles

1. **Sources réelles** : Intégrer vraie API Kaggle/StockX
2. **Web scraping** : Ajouter sites écoresponsables (Veja, Allbirds)
3. **IA génération** : Descriptions uniques avec GPT
4. **Optimisation** : Parallélisation téléchargements
5. **Validation** : Vérification qualité données

## 🎓 Pour votre projet école

Ce script vous donne **200 produits professionnels** en quelques minutes, parfait pour :

- **Démonstrations** complètes de votre e-commerce
- **Tests** de performance avec vraies données
- **Présentation** avec catalogue réaliste
- **Développement** sans perte de temps sur le contenu

---

**🌱 Bon import avec TERRA !**
