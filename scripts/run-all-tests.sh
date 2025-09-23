#!/bin/bash

# Script principal pour lancer tous les tests TERRA
# Usage: ./scripts/run-all-tests.sh [--unit|--integration|--e2e|--all] [--watch] [--coverage]

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
TEST_TYPE="all"
WATCH_MODE=false
COVERAGE=false
VERBOSE=false
CI_MODE=false

# Fonction d'aide
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --unit          Exécuter uniquement les tests unitaires"
    echo "  --integration   Exécuter uniquement les tests d'intégration"
    echo "  --e2e          Exécuter uniquement les tests E2E"
    echo "  --all          Exécuter tous les tests (défaut)"
    echo "  --watch        Mode watch pour les tests unitaires/intégration"
    echo "  --coverage     Générer un rapport de couverture"
    echo "  --verbose      Affichage détaillé"
    echo "  --ci           Mode CI (pas d'interaction)"
    echo "  --help         Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 --unit --watch          # Tests unitaires en mode watch"
    echo "  $0 --integration --coverage # Tests d'intégration avec couverture"
    echo "  $0 --e2e                   # Tests E2E uniquement"
    echo "  $0 --all --coverage        # Tous les tests avec couverture"
}

# Parser les arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --unit)
            TEST_TYPE="unit"
            shift
            ;;
        --integration)
            TEST_TYPE="integration"
            shift
            ;;
        --e2e)
            TEST_TYPE="e2e"
            shift
            ;;
        --all)
            TEST_TYPE="all"
            shift
            ;;
        --watch)
            WATCH_MODE=true
            shift
            ;;
        --coverage)
            COVERAGE=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --ci)
            CI_MODE=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            echo "Option inconnue: $1"
            show_help
            exit 1
            ;;
    esac
done

# Fonction de log
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Vérifier les prérequis
check_prerequisites() {
    log "Vérification des prérequis..."

    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé"
        exit 1
    fi

    # Vérifier pnpm
    if ! command -v pnpm &> /dev/null; then
        log_error "pnpm n'est pas installé"
        exit 1
    fi

    # Vérifier que nous sommes dans le bon répertoire
    if [ ! -f "package.json" ]; then
        log_error "Ce script doit être exécuté depuis la racine du projet"
        exit 1
    fi

    log_success "Prérequis vérifiés"
}

# Installer les dépendances si nécessaire
install_dependencies() {
    if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
        log "Installation des dépendances..."
        pnpm install
        log_success "Dépendances installées"
    fi
}

# Préparer l'environnement de test
setup_test_environment() {
    log "Préparation de l'environnement de test..."

    # Copier le fichier d'environnement de test s'il existe
    if [ -f "test.env" ]; then
        cp test.env .env.test
    fi

    # Créer le répertoire de résultats s'il n'existe pas
    mkdir -p test-results
    mkdir -p coverage

    log_success "Environnement de test préparé"
}

# Exécuter les tests unitaires
run_unit_tests() {
    log "🧪 Exécution des tests unitaires..."

    local cmd="pnpm vitest"
    local config_args="--config vitest.config.unit.mts"
    local pattern_args=""

    if [ "$WATCH_MODE" = true ]; then
        cmd="$cmd --watch"
    else
        cmd="$cmd run"
    fi

    if [ "$COVERAGE" = true ]; then
        cmd="$cmd --coverage"
    fi

    if [ "$VERBOSE" = true ]; then
        cmd="$cmd --verbose"
    fi

    if [ "$CI_MODE" = true ]; then
        cmd="$cmd --reporter=json --outputFile=test-results/unit-results.json"
    fi

    eval "$cmd $config_args $pattern_args"

    if [ $? -eq 0 ]; then
        log_success "Tests unitaires réussis"
        return 0
    else
        log_error "Tests unitaires échoués"
        return 1
    fi
}

# Exécuter les tests d'intégration
run_integration_tests() {
    log "🔗 Exécution des tests d'intégration..."

    local cmd="pnpm vitest"
    local config_args="--config vitest.config.integration.mts"
    local pattern_args=""

    if [ "$WATCH_MODE" = true ]; then
        cmd="$cmd --watch"
    else
        cmd="$cmd run"
    fi

    if [ "$COVERAGE" = true ]; then
        cmd="$cmd --coverage"
    fi

    if [ "$VERBOSE" = true ]; then
        cmd="$cmd --verbose"
    fi

    if [ "$CI_MODE" = true ]; then
        cmd="$cmd --reporter=json --outputFile=test-results/integration-results.json"
    fi

    eval "$cmd $config_args $pattern_args"

    if [ $? -eq 0 ]; then
        log_success "Tests d'intégration réussis"
        return 0
    else
        log_error "Tests d'intégration échoués"
        return 1
    fi
}

# Exécuter les tests E2E
run_e2e_tests() {
    log "🌐 Exécution des tests E2E..."

    # Vérifier si le serveur de dev est déjà en cours
    if ! curl -s http://localhost:3000 > /dev/null; then
        log "Démarrage du serveur de développement..."
        pnpm dev &
        DEV_SERVER_PID=$!

        # Attendre que le serveur soit prêt
        for i in {1..30}; do
            if curl -s http://localhost:3000 > /dev/null; then
                log_success "Serveur de développement prêt"
                break
            fi
            sleep 2
        done

        if [ $i -eq 30 ]; then
            log_error "Le serveur de développement n'a pas pu démarrer"
            return 1
        fi
    fi

    local cmd="pnpm playwright test"

    if [ "$VERBOSE" = true ]; then
        cmd="$cmd --verbose"
    fi

    if [ "$CI_MODE" = true ]; then
        cmd="$cmd --reporter=json"
    else
        cmd="$cmd --headed"
    fi

    eval "$cmd"
    local exit_code=$?

    # Arrêter le serveur de dev si on l'a démarré
    if [ ! -z "$DEV_SERVER_PID" ]; then
        kill $DEV_SERVER_PID
        wait $DEV_SERVER_PID 2>/dev/null
    fi

    if [ $exit_code -eq 0 ]; then
        log_success "Tests E2E réussis"
        return 0
    else
        log_error "Tests E2E échoués"
        return 1
    fi
}

# Générer le rapport de test
generate_report() {
    if [ "$CI_MODE" = false ]; then
        return 0
    fi

    log "📊 Génération du rapport de test..."

    # Créer un rapport HTML simple
    cat > test-results/report.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Rapport de Tests TERRA</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .success { color: green; }
        .error { color: red; }
        .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Rapport de Tests TERRA</h1>
    <p>Généré le $(date)</p>

    <div class="section">
        <h2>Résultats</h2>
        <p>Type de test exécuté: $TEST_TYPE</p>
        <p>Mode coverage: $COVERAGE</p>
    </div>
</body>
</html>
EOF

    log_success "Rapport généré dans test-results/report.html"
}

# Fonction principale
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    🌱 TERRA TEST SUITE 🌱                    ║"
    echo "║              Tests pour l'e-commerce écoresponsable          ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"

    check_prerequisites
    install_dependencies
    setup_test_environment

    local exit_code=0

    case $TEST_TYPE in
        "unit")
            run_unit_tests || exit_code=1
            ;;
        "integration")
            run_integration_tests || exit_code=1
            ;;
        "e2e")
            run_e2e_tests || exit_code=1
            ;;
        "all")
            log "🚀 Exécution de tous les tests..."

            run_unit_tests || exit_code=1

            if [ $exit_code -eq 0 ]; then
                run_integration_tests || exit_code=1
            fi

            if [ $exit_code -eq 0 ] && [ "$WATCH_MODE" = false ]; then
                run_e2e_tests || exit_code=1
            fi
            ;;
    esac

    generate_report

    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}"
        echo "╔══════════════════════════════════════════════════════════════╗"
        echo "║                   🎉 TOUS LES TESTS RÉUSSIS! 🎉              ║"
        echo "╚══════════════════════════════════════════════════════════════╝"
        echo -e "${NC}"
    else
        echo -e "${RED}"
        echo "╔══════════════════════════════════════════════════════════════╗"
        echo "║                   ❌ CERTAINS TESTS ONT ÉCHOUÉ               ║"
        echo "╚══════════════════════════════════════════════════════════════╝"
        echo -e "${NC}"
    fi

    exit $exit_code
}

# Piège pour nettoyer en cas d'interruption
trap 'echo -e "\n${YELLOW}Tests interrompus par l utilisateur${NC}"; exit 130' INT

# Exécuter le script principal
main "$@"
