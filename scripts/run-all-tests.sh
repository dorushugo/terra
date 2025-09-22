#!/bin/bash

# 🧪 Script de lancement de tous les tests Terra
# Ce script lance l'ensemble de la suite de tests : unitaires, intégration et e2e

set -e  # Arrêter le script en cas d'erreur

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
TEST_RESULTS_DIR="test-results"
COVERAGE_DIR="coverage"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo -e "${BLUE}🧪 TERRA - Suite de Tests Complète${NC}"
echo -e "${BLUE}====================================${NC}"
echo ""

# Fonction pour afficher le statut
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Fonction pour afficher les statistiques
print_stats() {
    echo -e "${BLUE}📊 Statistiques des tests:${NC}"
    if [ -f "$TEST_RESULTS_DIR/unit-results.json" ]; then
        echo -e "   ${YELLOW}Tests unitaires:${NC} $(jq '.numTotalTests' $TEST_RESULTS_DIR/unit-results.json 2>/dev/null || echo 'N/A') tests"
    fi
    if [ -f "$TEST_RESULTS_DIR/integration-results.json" ]; then
        echo -e "   ${YELLOW}Tests d'intégration:${NC} $(jq '.numTotalTests' $TEST_RESULTS_DIR/integration-results.json 2>/dev/null || echo 'N/A') tests"
    fi
    if [ -f "$TEST_RESULTS_DIR/e2e-results.json" ]; then
        echo -e "   ${YELLOW}Tests e2e:${NC} $(jq '.numTotalTests' $TEST_RESULTS_DIR/e2e-results.json 2>/dev/null || echo 'N/A') tests"
    fi
}

# Créer les dossiers de résultats
mkdir -p $TEST_RESULTS_DIR
mkdir -p $COVERAGE_DIR

# Variables pour tracker les résultats
UNIT_TESTS_PASSED=0
INTEGRATION_TESTS_PASSED=0
E2E_TESTS_PASSED=0
LINT_PASSED=0

echo -e "${YELLOW}🔧 Vérification de l'environnement...${NC}"

# Vérifier que les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
    pnpm install
fi

# Vérifier les variables d'environnement nécessaires
if [ ! -f ".env" ] && [ ! -f "test.env" ]; then
    echo -e "${YELLOW}⚠️  Aucun fichier .env trouvé. Utilisation des valeurs par défaut.${NC}"
fi

echo ""
echo -e "${BLUE}🧹 Nettoyage des anciens résultats...${NC}"
rm -rf $TEST_RESULTS_DIR/*
rm -rf $COVERAGE_DIR/*

echo ""
echo -e "${BLUE}📝 Linting et vérifications de code...${NC}"
if pnpm run lint; then
    LINT_PASSED=1
    print_status 0 "Linting"
else
    print_status 1 "Linting"
fi

echo ""
echo -e "${BLUE}🧪 Tests unitaires...${NC}"
echo -e "${YELLOW}Tests des composants, hooks et utilitaires${NC}"
if pnpm run test:unit --reporter=json --outputFile=$TEST_RESULTS_DIR/unit-results.json --coverage --coverage.reportsDirectory=$COVERAGE_DIR/unit; then
    UNIT_TESTS_PASSED=1
    print_status 0 "Tests unitaires"
else
    print_status 1 "Tests unitaires"
fi

echo ""
echo -e "${BLUE}🔗 Tests d'intégration...${NC}"
echo -e "${YELLOW}Tests des APIs et intégrations${NC}"
if pnpm run test:int --reporter=json --outputFile=$TEST_RESULTS_DIR/integration-results.json; then
    INTEGRATION_TESTS_PASSED=1
    print_status 0 "Tests d'intégration"
else
    print_status 1 "Tests d'intégration"
fi

echo ""
echo -e "${BLUE}🌐 Tests end-to-end...${NC}"
echo -e "${YELLOW}Tests du parcours utilisateur complet${NC}"

# Démarrer le serveur de développement en arrière-plan pour les tests e2e
echo -e "${YELLOW}🚀 Démarrage du serveur de test...${NC}"
pnpm run dev &
SERVER_PID=$!

# Attendre que le serveur soit prêt
echo -e "${YELLOW}⏳ Attente du démarrage du serveur...${NC}"
sleep 10

# Vérifier que le serveur est accessible
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Serveur prêt${NC}"

    if pnpm run test:e2e --reporter=json --outputFile=$TEST_RESULTS_DIR/e2e-results.json; then
        E2E_TESTS_PASSED=1
        print_status 0 "Tests e2e"
    else
        print_status 1 "Tests e2e"
    fi
else
    echo -e "${RED}❌ Impossible de démarrer le serveur${NC}"
    E2E_TESTS_PASSED=0
fi

# Arrêter le serveur
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true

echo ""
echo -e "${BLUE}📊 Génération du rapport de couverture...${NC}"
if command -v nyc &> /dev/null; then
    nyc merge $COVERAGE_DIR/unit $COVERAGE_DIR/merged.json
    nyc report --reporter=html --reporter=text-summary --report-dir=$COVERAGE_DIR/html
    echo -e "${GREEN}✅ Rapport de couverture généré dans $COVERAGE_DIR/html${NC}"
fi

echo ""
echo -e "${BLUE}📋 RÉSUMÉ DES TESTS${NC}"
echo -e "${BLUE}==================${NC}"
print_stats

echo ""
print_status $LINT_PASSED "Linting"
print_status $UNIT_TESTS_PASSED "Tests unitaires"
print_status $INTEGRATION_TESTS_PASSED "Tests d'intégration"
print_status $E2E_TESTS_PASSED "Tests end-to-end"

# Calculer le score global
TOTAL_SCORE=$((LINT_PASSED + UNIT_TESTS_PASSED + INTEGRATION_TESTS_PASSED + E2E_TESTS_PASSED))

echo ""
if [ $TOTAL_SCORE -eq 4 ]; then
    echo -e "${GREEN}🎉 TOUS LES TESTS SONT PASSÉS ! (4/4)${NC}"
    echo -e "${GREEN}🚀 Votre code est prêt pour la production !${NC}"
    exit 0
elif [ $TOTAL_SCORE -ge 2 ]; then
    echo -e "${YELLOW}⚠️  TESTS PARTIELLEMENT RÉUSSIS ($TOTAL_SCORE/4)${NC}"
    echo -e "${YELLOW}🔧 Veuillez corriger les tests en échec${NC}"
    exit 1
else
    echo -e "${RED}💥 ÉCHEC DES TESTS ($TOTAL_SCORE/4)${NC}"
    echo -e "${RED}🚨 Action requise pour corriger les problèmes${NC}"
    exit 1
fi
