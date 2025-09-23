# 🧪 Documentation des Tests - TERRA E-commerce

Cette documentation détaille la stratégie de test complète mise en place pour le projet TERRA, un site e-commerce de sneakers écoresponsables.

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Structure des tests](#structure-des-tests)
3. [Types de tests](#types-de-tests)
4. [Configuration et outils](#configuration-et-outils)
5. [Exécution des tests](#exécution-des-tests)
6. [Couverture de code](#couverture-de-code)
7. [Bonnes pratiques](#bonnes-pratiques)
8. [CI/CD](#cicd)
9. [Dépannage](#dépannage)

## 🎯 Vue d'ensemble

### Objectifs de la stratégie de test

- **Fiabilité** : Garantir le bon fonctionnement des fonctionnalités critiques
- **Régression** : Détecter rapidement les régressions lors des modifications
- **Qualité** : Maintenir un code de haute qualité
- **Confiance** : Permettre des déploiements sereins
- **Documentation** : Servir de documentation vivante du comportement attendu

### Fonctionnalités couvertes

#### ✅ Fonctionnalités e-commerce

- Gestion du panier (ajout, suppression, modification)
- Système de favoris
- Authentification utilisateur (inscription, connexion, profil)
- Commandes (création, suivi, historique)
- Catalogue produits (filtrage, recherche, détails)
- Processus de checkout

#### ✅ Fonctionnalités spécifiques TERRA

- Système d'éco-score
- Collections (Origin, Move, Limited)
- Gestion des tailles et couleurs
- Stock et disponibilité

#### ✅ Interface utilisateur

- Composants React
- Navigation responsive
- Accessibilité
- Performance

## 📁 Structure des tests

```
tests/
├── unit/                           # Tests unitaires
│   ├── hooks/                      # Tests des hooks React
│   │   ├── useCart.test.tsx
│   │   ├── useFavorites.test.tsx
│   │   └── useAccount.test.tsx
│   └── components/                 # Tests des composants
│       └── TerraProductCard.test.tsx
├── integration/                    # Tests d'intégration
│   └── api/                        # Tests des APIs
│       ├── auth.int.spec.ts
│       ├── products.int.spec.ts
│       └── orders.int.spec.ts
├── e2e/                           # Tests end-to-end
│   ├── frontend.e2e.spec.ts      # Tests existants
│   └── user-journey.e2e.spec.ts  # Nouveaux parcours utilisateur
└── fixtures/                      # Données de test
    └── (données de test réutilisables)
```

## 🔧 Types de tests

### 1. Tests unitaires (`tests/unit/`)

**Objectif** : Tester des unités de code isolées (fonctions, hooks, composants)

**Outils** : Vitest + Testing Library + jsdom

**Exemples couverts** :

- **Hooks personnalisés** : `useCart`, `useFavorites`, `useAccount`
- **Composants React** : `TerraProductCard`, providers
- **Fonctions utilitaires** : formatage, validation, calculs

**Caractéristiques** :

- Exécution rapide (< 1s par test)
- Isolation complète (mocks, stubs)
- Couverture de code détaillée
- Idéal pour TDD

### 2. Tests d'intégration (`tests/integration/`)

**Objectif** : Tester l'interaction entre plusieurs composants/services

**Outils** : Vitest + Payload CMS + Base de données de test

**Exemples couverts** :

- **APIs Payload** : Authentification, CRUD produits, commandes
- **Collections** : Validation des schémas, relations
- **Hooks Payload** : Triggers, validations automatiques
- **Endpoints custom** : Checkout, paiement, stock

**Caractéristiques** :

- Utilise une vraie base de données de test
- Tests séquentiels pour éviter les conflits
- Nettoyage automatique après chaque test
- Timeout plus élevé (30s)

### 3. Tests end-to-end (`tests/e2e/`)

**Objectif** : Tester les parcours utilisateur complets dans un navigateur réel

**Outils** : Playwright

**Exemples couverts** :

- **Parcours d'achat complet** : Produit → Panier → Checkout
- **Authentification** : Inscription, connexion, gestion profil
- **Navigation** : Menu, filtres, recherche
- **Responsive** : Mobile, tablette, desktop
- **Accessibilité** : Navigation clavier, lecteurs d'écran

**Caractéristiques** :

- Navigateur Chrome par défaut
- Tests en parallèle
- Screenshots et vidéos en cas d'échec
- Mode headed pour le debug

## ⚙️ Configuration et outils

### Vitest (Tests unitaires et intégration)

```typescript
// vitest.config.unit.mts
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    coverage: {
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
})
```

### Playwright (Tests E2E)

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
})
```

### Outils de test

- **@testing-library/react** : Utilitaires pour tester React
- **@testing-library/jest-dom** : Matchers personnalisés
- **vitest** : Runner de test rapide
- **playwright** : Tests E2E multi-navigateurs
- **jsdom** : Environnement DOM simulé

## 🚀 Exécution des tests

### Script principal

```bash
# Tous les tests
./scripts/run-all-tests.sh --all

# Tests spécifiques
./scripts/run-all-tests.sh --unit
./scripts/run-all-tests.sh --integration
./scripts/run-all-tests.sh --e2e

# Avec couverture
./scripts/run-all-tests.sh --all --coverage

# Mode watch (développement)
./scripts/run-all-tests.sh --unit --watch
```

### Scripts npm/pnpm

```bash
# Tests unitaires
pnpm test:unit                 # Exécution unique
pnpm test:unit:watch          # Mode watch
pnpm test:unit:coverage       # Avec couverture

# Tests d'intégration
pnpm test:integration         # Exécution unique
pnpm test:integration:watch   # Mode watch
pnpm test:integration:coverage # Avec couverture

# Tests E2E
pnpm test:e2e                 # Mode headless
pnpm test:e2e:headed          # Mode headed (debug)

# Tous les tests
pnpm test                     # Tous les tests
pnpm test:all:coverage        # Tous avec couverture
```

### Modes d'exécution

#### Mode développement (watch)

```bash
pnpm test:unit:watch
```

- Re-exécution automatique lors des modifications
- Idéal pendant le développement
- Interface interactive

#### Mode CI/CD

```bash
./scripts/run-all-tests.sh --all --ci --coverage
```

- Sortie JSON pour intégration
- Rapports de couverture
- Pas d'interaction

#### Mode debug

```bash
pnpm test:e2e:headed
```

- Navigateur visible
- Pas de parallélisation
- Idéal pour déboguer les tests E2E

## 📊 Couverture de code

### Objectifs de couverture

| Type         | Branches | Fonctions | Lignes | Statements |
| ------------ | -------- | --------- | ------ | ---------- |
| **Global**   | 70%      | 70%       | 70%    | 70%        |
| **Critique** | 90%      | 90%       | 90%    | 90%        |

### Zones critiques (couverture 90%+)

- Hooks de gestion d'état (`useCart`, `useFavorites`, `useAccount`)
- APIs de commande et paiement
- Calculs de prix et stock
- Validation des données utilisateur

### Zones exclues de la couverture

- Fichiers de configuration
- Types TypeScript
- Mocks et fixtures de test
- Répertoires `node_modules`, `.next`, `dist`

### Rapports de couverture

```bash
# Générer les rapports
pnpm test:unit:coverage

# Ouvrir le rapport HTML
open coverage/index.html
```

## 📝 Bonnes pratiques

### Tests unitaires

#### ✅ À faire

```typescript
// Noms de tests descriptifs
it('should add item to cart with correct quantity and price', () => {})

// Arrange, Act, Assert
it('should update cart total when quantity changes', () => {
  // Arrange
  const { result } = renderHook(() => useCart())

  // Act
  act(() => {
    result.current.addToCart(mockProduct, '42', 'White', 2)
  })

  // Assert
  expect(result.current.totalPrice).toBe(278)
})

// Tests des cas limites
it('should handle empty cart gracefully', () => {})
it('should prevent adding items with invalid data', () => {})
```

#### ❌ À éviter

```typescript
// Tests trop génériques
it('should work', () => {})

// Tests dépendants les uns des autres
it('should add item', () => {})
it('should have 1 item', () => {}) // ❌ Dépend du test précédent

// Tests sans assertions
it('should not throw', () => {
  someFunction() // ❌ Pas d'assertion
})
```

### Tests d'intégration

#### ✅ À faire

```typescript
// Nettoyage avant/après chaque test
beforeEach(async () => {
  await cleanupTestData()
})

// Tests avec vraies données
it('should create order with real product data', async () => {
  const product = await payload.create({
    collection: 'products',
    data: validProductData,
  })
  // Test avec le produit réel
})
```

#### ❌ À éviter

```typescript
// Tests qui modifient les données de production
// Tests sans nettoyage
// Tests avec des timeouts arbitraires
```

### Tests E2E

#### ✅ À faire

```typescript
// Page Object Model
class CheckoutPage {
  async fillShippingInfo(info: ShippingInfo) {
    await this.page.fill('[name="firstName"]', info.firstName)
    // ...
  }
}

// Attentes explicites
await expect(page.locator('[data-testid="success-message"]')).toBeVisible()

// Tests de parcours complets
test('complete purchase journey', async () => {
  await homePage.goto()
  await homePage.selectProduct()
  await productPage.addToCart()
  await cartPage.proceedToCheckout()
  await checkoutPage.completeOrder()
})
```

#### ❌ À éviter

```typescript
// Attentes avec setTimeout
await page.waitForTimeout(5000) // ❌

// Sélecteurs fragiles
await page.click('.btn-primary') // ❌ Utiliser data-testid

// Tests trop longs
test('test everything', async () => {
  // 500 lignes de test ❌
})
```

## 🔄 CI/CD

### GitHub Actions (exemple)

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run unit tests
        run: pnpm test:unit:coverage

      - name: Run integration tests
        run: pnpm test:integration:coverage
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Stratégie de branches

- **main** : Tous les tests doivent passer
- **develop** : Tests unitaires et intégration requis
- **feature** : Tests unitaires requis minimum

## 🔧 Dépannage

### Problèmes courants

#### Tests unitaires qui échouent

```bash
# Vérifier les mocks
console.log('Mock calls:', vi.mocked(mockFunction).mock.calls)

# Mode debug
pnpm test:unit:watch --reporter=verbose

# Tests spécifiques
pnpm vitest --config vitest.config.unit.mts "useCart"
```

#### Tests d'intégration lents

```bash
# Vérifier la base de données
# Augmenter les timeouts
# Optimiser les requêtes Payload
```

#### Tests E2E instables

```bash
# Mode headed pour voir ce qui se passe
pnpm test:e2e:headed

# Screenshots en cas d'échec
# Vérifier les sélecteurs
# Augmenter les timeouts
```

### Variables d'environnement

```bash
# .env.test
DATABASE_URL=postgresql://test:test@localhost:5432/terra_test
PAYLOAD_SECRET=test-secret-key
NODE_ENV=test
```

### Debugging

```typescript
// Tests unitaires
import { screen } from '@testing-library/react'
screen.debug() // Affiche le DOM actuel

// Tests E2E
await page.screenshot({ path: 'debug.png' })
await page.pause() // Mode debug interactif
```

## 📈 Métriques et monitoring

### Métriques de test

- **Temps d'exécution** : < 30s pour tous les tests
- **Taux de réussite** : > 99% en CI
- **Couverture** : > 70% global, > 90% critique
- **Flakiness** : < 1% des tests E2E

### Rapports

- **Couverture** : `coverage/index.html`
- **Tests E2E** : `playwright-report/index.html`
- **CI** : Intégration avec codecov/sonarqube

## 🎯 Prochaines étapes

### Améliorations prévues

1. **Tests de performance** : Lighthouse CI
2. **Tests de sécurité** : OWASP ZAP
3. **Tests de charge** : K6 ou Artillery
4. **Visual regression** : Percy ou Chromatic
5. **Tests d'accessibilité** : axe-core

### Maintenance

- **Révision mensuelle** des tests fragiles
- **Mise à jour** des outils et dépendances
- **Optimisation** des temps d'exécution
- **Formation** de l'équipe aux bonnes pratiques

---

## 🤝 Contribution

Pour contribuer aux tests :

1. Suivre les conventions de nommage
2. Ajouter des tests pour chaque nouvelle fonctionnalité
3. Maintenir la couverture de code
4. Documenter les cas de test complexes
5. Tester sur différents environnements

## 📞 Support

En cas de problème avec les tests :

1. Consulter cette documentation
2. Vérifier les issues GitHub existantes
3. Demander de l'aide à l'équipe
4. Documenter les nouvelles solutions trouvées

---

_Cette documentation est maintenue par l'équipe TERRA et mise à jour régulièrement._
