#!/bin/bash

# 👀 Script de surveillance des tests en mode watch
# Lance les tests en mode watch pour le développement

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}👀 TERRA - Mode Watch des Tests${NC}"
echo -e "${BLUE}===============================${NC}"
echo ""

# Fonction pour afficher les options
show_menu() {
    echo -e "${YELLOW}Choisissez le type de tests à surveiller:${NC}"
    echo "1) Tests unitaires (composants, hooks, utilitaires)"
    echo "2) Tests d'intégration (APIs)"
    echo "3) Tous les tests (unitaires + intégration)"
    echo "4) Tests spécifiques (par pattern)"
    echo "5) Quitter"
    echo ""
}

# Fonction pour lancer les tests unitaires en watch
run_unit_watch() {
    echo -e "${GREEN}🧪 Surveillance des tests unitaires...${NC}"
    echo -e "${YELLOW}Fichiers surveillés: tests/unit/**/*.test.{ts,tsx}${NC}"
    echo ""
    pnpm run test:unit --watch
}

# Fonction pour lancer les tests d'intégration en watch
run_integration_watch() {
    echo -e "${GREEN}🔗 Surveillance des tests d'intégration...${NC}"
    echo -e "${YELLOW}Fichiers surveillés: tests/integration/**/*.int.test.ts${NC}"
    echo ""
    pnpm run test:int --watch
}

# Fonction pour lancer tous les tests en watch
run_all_watch() {
    echo -e "${GREEN}🎯 Surveillance de tous les tests...${NC}"
    echo -e "${YELLOW}Fichiers surveillés: tests/**/*.{test,int.test}.{ts,tsx}${NC}"
    echo ""
    pnpm run test:unit --watch &
    UNIT_PID=$!

    pnpm run test:int --watch &
    INT_PID=$!

    # Gérer l'arrêt propre
    trap 'kill $UNIT_PID $INT_PID 2>/dev/null; exit 0' SIGINT SIGTERM

    wait
}

# Fonction pour lancer des tests spécifiques
run_specific_watch() {
    echo -e "${YELLOW}Entrez le pattern de fichiers à surveiller (ex: ProductCard, auth, stock):${NC}"
    read -r pattern

    if [ -n "$pattern" ]; then
        echo -e "${GREEN}🎯 Surveillance des tests correspondant à '$pattern'...${NC}"
        pnpm run test:unit --watch --testNamePattern="$pattern"
    else
        echo -e "${YELLOW}Pattern vide, retour au menu...${NC}"
    fi
}

# Boucle principale
while true; do
    show_menu
    read -p "Votre choix (1-5): " choice
    echo ""

    case $choice in
        1)
            run_unit_watch
            ;;
        2)
            run_integration_watch
            ;;
        3)
            run_all_watch
            ;;
        4)
            run_specific_watch
            ;;
        5)
            echo -e "${GREEN}👋 Au revoir !${NC}"
            exit 0
            ;;
        *)
            echo -e "${YELLOW}⚠️  Choix invalide. Veuillez choisir entre 1 et 5.${NC}"
            echo ""
            ;;
    esac

    echo ""
    echo -e "${BLUE}Appuyez sur Entrée pour revenir au menu...${NC}"
    read -r
    clear
done
