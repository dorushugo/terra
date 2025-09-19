#!/bin/bash

# Script pour démarrer le serveur de développement avec les optimisations
# pour éviter les rechargements constants du schema

echo "🚀 Démarrage du serveur Terra en mode développement optimisé..."

# Nettoyer le cache Next.js
echo "🧹 Nettoyage du cache..."
rm -rf .next

# Charger les variables d'environnement optimisées
export NODE_ENV=development
export PAYLOAD_DROP_DATABASE=false
export PAYLOAD_DISABLE_ADMIN_HOT_RELOAD=true
export PAYLOAD_LOG_LEVEL=warn
export NODE_OPTIONS="--no-deprecation"

echo "✅ Variables d'environnement configurées:"
echo "   - PAYLOAD_DROP_DATABASE: $PAYLOAD_DROP_DATABASE"
echo "   - PAYLOAD_DISABLE_ADMIN_HOT_RELOAD: $PAYLOAD_DISABLE_ADMIN_HOT_RELOAD"
echo "   - PAYLOAD_LOG_LEVEL: $PAYLOAD_LOG_LEVEL"

echo "🔥 Lancement du serveur..."
pnpm dev
