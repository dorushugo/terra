# Configuration Unsplash API

## Étapes pour obtenir une clé API Unsplash (GRATUIT)

### 1. Créer un compte développeur
- Allez sur https://unsplash.com/developers
- Connectez-vous ou créez un compte Unsplash
- Acceptez les conditions d'utilisation de l'API

### 2. Créer une nouvelle application
- Cliquez sur "New Application"
- Remplissez les informations :
  - **Application name** : "TERRA Sneakers Images"
  - **Description** : "E-commerce product images for TERRA sneakers website"
  - **Website** : http://localhost:3000 (ou votre domaine)
- Acceptez les conditions d'utilisation

### 3. Récupérer votre Access Key
- Une fois l'application créée, copiez votre **Access Key**
- C'est une chaîne qui ressemble à : `abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`

### 4. Configuration dans votre terminal

```bash
# Exporter la clé API dans votre terminal
export UNSPLASH_ACCESS_KEY=your_access_key_here

# Ou l'ajouter à votre fichier .bashrc/.zshrc pour la persistance
echo 'export UNSPLASH_ACCESS_KEY=your_access_key_here' >> ~/.zshrc
```

### 5. Utilisation du script

```bash
# Avec la clé exportée
python3 unsplash_images.py

# Ou directement en une ligne
UNSPLASH_ACCESS_KEY=your_key python3 unsplash_images.py
```

## Limites de l'API gratuite

- **50 requêtes par heure** pour les comptes démo
- **5000 requêtes par heure** une fois votre app approuvée
- Pas de limite sur le nombre d'images téléchargées
- Attribution recommandée (mais pas obligatoire pour usage personnel)

## Avantages d'Unsplash

✅ **Gratuit** - Pas de coût d'utilisation  
✅ **Haute qualité** - Photos professionnelles  
✅ **Variété** - Milliers d'images de chaussures  
✅ **Formats multiples** - Différentes résolutions disponibles  
✅ **Libre de droits** - Utilisation commerciale autorisée  
✅ **API stable** - Service fiable et bien documenté  

## Mots-clés utilisés par le script

Le script recherche automatiquement avec ces termes :
- `sneakers`, `running shoes`, `basketball shoes`
- `athletic shoes`, `trainers`, `sport shoes`
- `casual shoes`, `white sneakers`, `black sneakers`
- `leather shoes`, `canvas shoes`, `tennis shoes`

## Dépannage

**Erreur 401 Unauthorized** : Vérifiez votre clé API
**Erreur 403 Rate Limit** : Attendez 1 heure ou approuvez votre app
**Pas d'images trouvées** : Vérifiez votre connexion internet

## Attribution (optionnelle)

Si vous utilisez les images en production, vous pouvez ajouter :
```
Photo by [Photographer Name] on Unsplash
```
