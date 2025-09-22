# 🧪 Guide des Tests - Terra E-commerce

Ce guide explique comment utiliser et maintenir la suite de tests complète du projet Terra.

## 📋 Vue d'ensemble

Le projet Terra dispose d'une suite de tests complète couvrant :

- **Tests unitaires** : Composants React, hooks personnalisés, utilitaires
- **Tests d'intégration** : Routes API, collections Payload, logique métier
- **Tests end-to-end** : Parcours utilisateur complet avec Playwright

## 🚀 Démarrage rapide

### Lancer tous les tests

```bash
# Script principal - Lance tous les types de tests
pnpm run test:all

# Ou individuellement
pnpm run test:unit      # Tests unitaires
pnpm run test:int       # Tests d'intégration
pnpm run test:e2e       # Tests end-to-end
```

### Mode développement (watch)

```bash
# Interface interactive pour choisir les tests à surveiller
pnpm run test:watch

# Ou directement
pnpm run test:unit:watch
pnpm run test:int:watch
```

### Couverture de code

```bash
pnpm run test:coverage
```

## 📁 Structure des tests

```
tests/
├── setup/
│   ├── test-utils.ts      # Utilitaires et mocks partagés
│   └── test-data.ts       # Données de test réutilisables
├── unit/
│   ├── components/        # Tests des composants React
│   ├── hooks/            # Tests des hooks personnalisés
│   ├── utilities/        # Tests des fonctions utilitaires
│   ├── collections/      # Tests des collections Payload
│   └── business-logic/   # Tests de la logique métier
├── integration/
│   └── api/              # Tests des routes API
└── e2e/
    └── *.e2e.spec.ts     # Tests end-to-end
```

## 🧪 Types de tests

### Tests unitaires

Testent les composants et fonctions de manière isolée.

```typescript
// Exemple : tests/unit/components/ProductCard.test.tsx
import { render, screen } from '../../../setup/test-utils'
import { ProductCard } from '@/components/terra/ProductCard'
import { TEST_PRODUCTS } from '../../../setup/test-data'

describe('ProductCard', () => {
  it('displays product information correctly', () => {
    render(<ProductCard product={TEST_PRODUCTS.origin} />)

    expect(screen.getByText('TERRA Origin Stone White')).toBeInTheDocument()
    expect(screen.getByText('139 €')).toBeInTheDocument()
  })
})
```

### Tests d'intégration

Testent l'intégration entre les différents modules (API, base de données, etc.).

```typescript
// Exemple : tests/integration/api/auth.int.test.ts
import { NextRequest } from 'next/server'
import { GET as authHandler } from '@/app/api/auth/me/route'

describe('/api/auth/me', () => {
  it('returns user data when authenticated', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/me')
    const response = await authHandler(request)

    expect(response.status).toBe(200)
  })
})
```

### Tests end-to-end

Testent les parcours utilisateur complets dans un navigateur.

```typescript
// Exemple : tests/e2e/checkout.e2e.spec.ts
import { test, expect } from '@playwright/test'

test('complete checkout flow', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="add-to-cart"]')
  await page.click('[data-testid="checkout-button"]')

  await expect(page).toHaveURL('/checkout')
})
```

## 🛠️ Utilitaires de test

### test-utils.ts

Fournit des utilitaires pour simplifier les tests :

```typescript
import { render } from '../../../setup/test-utils'

// Render avec tous les providers nécessaires
const { container } = render(<MyComponent />)

// Données de test prêtes à l'emploi
import { TEST_PRODUCTS, TEST_USERS } from '../../../setup/test-data'
```

### Mocks disponibles

- **Router** : `mockRouter` pour Next.js navigation
- **LocalStorage** : Mock automatique du localStorage
- **Fetch** : `mockFetch()` et `mockFetchError()`
- **Providers** : Cart, Favorites, Account providers mockés

## 📊 Couverture de code

### Objectifs de couverture

- **Branches** : 70% minimum
- **Functions** : 70% minimum
- **Lines** : 70% minimum
- **Statements** : 70% minimum

### Exclusions

- Fichiers de configuration
- Code généré automatiquement
- Interface admin Payload
- Scripts de seed
- Dossier public

## 🔧 Configuration

### Variables d'environnement

```bash
# test.env ou .env.test
NODE_ENV=test
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://test:test@localhost:5432/terra_test
```

### Vitest

Configuration dans `vitest.config.mts` :

- Environment : jsdom pour les tests React
- Setup files : `vitest.setup.ts`
- Coverage : v8 provider
- Timeouts : 10s pour les tests longs

### Playwright

Configuration dans `playwright.config.ts` pour les tests e2e.

## 📝 Bonnes pratiques

### Écriture de tests

1. **Nommage descriptif** : `it('should display error when form is invalid')`
2. **Arrange-Act-Assert** : Structure claire des tests
3. **Isolation** : Chaque test doit être indépendant
4. **Données de test** : Utiliser les fixtures dans `test-data.ts`

### Mocks

1. **Mock au bon niveau** : Composant, module ou API
2. **Cleanup** : Nettoyer les mocks après chaque test
3. **Réalisme** : Les mocks doivent refléter le comportement réel

### Performance

1. **Tests parallèles** : Vitest lance les tests en parallèle
2. **Timeout approprié** : 10s par défaut, ajuster si nécessaire
3. **Setup minimal** : Ne charger que ce qui est nécessaire

## 🐛 Debugging

### Tests qui échouent

```bash
# Mode debug avec plus d'informations
pnpm run test:unit -- --reporter=verbose

# Test spécifique
pnpm run test:unit -- ProductCard

# Mode watch pour développement
pnpm run test:unit:watch
```

### Coverage insuffisante

```bash
# Rapport détaillé
pnpm run test:coverage

# Ouvrir le rapport HTML
open coverage/html/index.html
```

## 📚 Ressources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## 🎯 Checklist pour nouveaux tests

- [ ] Test unitaire pour les nouveaux composants
- [ ] Test d'intégration pour les nouvelles routes API
- [ ] Test e2e pour les nouveaux parcours utilisateur
- [ ] Vérification de la couverture de code
- [ ] Documentation des cas de test complexes
- [ ] Validation dans tous les environnements

## 🚀 CI/CD

Les tests sont automatiquement lancés :

1. **Pre-commit** : Tests unitaires rapides
2. **Pull Request** : Suite complète de tests
3. **Deployment** : Validation finale avant mise en production

---

Pour toute question sur les tests, consultez ce guide ou contactez l'équipe de développement.
