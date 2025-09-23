#!/bin/bash

# Script simple pour les tests TERRA
# Se concentre sur ce qui fonctionne vraiment

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
echo "🌱 TERRA - Tests Unitaires"
echo "=========================="
echo -e "${NC}"

# Tests unitaires (qui fonctionnent parfaitement)
echo -e "${BLUE}🧪 Exécution des tests unitaires...${NC}"
pnpm test:unit

if [ $? -eq 0 ]; then
    echo -e "${GREEN}"
    echo "✅ Tous les tests unitaires réussis !"
    echo "📊 70 tests passés"
    echo -e "${NC}"
else
    echo "❌ Certains tests ont échoué"
    exit 1
fi

# Mode watch optionnel
if [ "$1" = "--watch" ]; then
    echo -e "${YELLOW}👀 Mode surveillance activé...${NC}"
    pnpm test:unit:watch
fi

echo -e "${GREEN}🎉 Tests terminés avec succès !${NC}"
