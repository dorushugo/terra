# 🧪 Tests TERRA

## Tests Unitaires (70 tests - ✅ 100% réussite)

### 🚀 Lancer les tests

```bash
# Commande principale
pnpm test

# Tests unitaires seulement
pnpm test:unit

# Mode surveillance (développement)
pnpm test:unit:watch
./scripts/test-simple.sh --watch

# Avec couverture
pnpm test:unit:coverage
```

### 📊 Ce qui est testé

#### ✅ Hooks React (30 tests)

- **useCart** (12 tests) : Gestion du panier e-commerce
- **useFavorites** (12 tests) : Système de favoris
- **useAccount** (6 tests) : Authentification utilisateur

#### ✅ Utilitaires (33 tests)

- **Validation** (18 tests) : Emails, téléphones, codes postaux, mots de passe
- **Formatage** (15 tests) : Prix, éco-scores, slugs, frais de port

#### ✅ Composants (7 tests)

- **ProductCard** : Affichage produits, badges, boutons

### 🎯 Fonctionnalités validées

**E-commerce Core :**

- ✅ Ajout/suppression produits panier
- ✅ Calcul totaux et quantités
- ✅ Persistance localStorage
- ✅ Gestion favoris avec anti-spam
- ✅ Validation données utilisateur
- ✅ Formatage prix européens

**Qualité :**

- ✅ Gestion des erreurs
- ✅ Tests des cas limites
- ✅ Mocks appropriés
- ✅ Isolation complète

### ⚡ Performance

- **Temps d'exécution** : ~2.5s pour 70 tests
- **Environnement** : jsdom + Jest-DOM
- **Framework** : Vitest + Testing Library

### 📁 Structure

```
tests/
└── unit/
    ├── hooks/
    │   ├── useCart.test.tsx
    │   ├── useFavorites.test.tsx
    │   └── useAccount.simple.test.tsx
    ├── components/
    │   └── ProductCard.simple.test.tsx
    └── utils/
        ├── validation.test.ts
        └── formatters.test.ts
```

### 🛠️ Configuration

- `vitest.config.unit.mts` : Configuration Vitest
- `vitest.setup.unit.ts` : Setup Jest-DOM
- `scripts/test-simple.sh` : Script d'exécution

---

**🎉 Tests prêts pour la production !**
_Tous les tests passent à 100% et valident les fonctionnalités critiques de l'e-commerce._
