# Documentation Technique - TERRA E-commerce

## Table des Matières

1. [Vue d'ensemble du projet](#vue-densemble-du-projet)
2. [Architecture technique](#architecture-technique)
3. [Stack technologique](#stack-technologique)
4. [Structure du projet](#structure-du-projet)
5. [Configuration Payload CMS](#configuration-payload-cms)
6. [Modèles de données](#modèles-de-données)
7. [Architecture Next.js](#architecture-nextjs)
8. [Système d'authentification](#système-dauthentification)
9. [Logique métier](#logique-métier)
10. [Composants UI](#composants-ui)
11. [Tests](#tests)
12. [Déploiement](#déploiement)
13. [Scripts et automatisation](#scripts-et-automatisation)

## Vue d'ensemble du projet

TERRA est une plateforme e-commerce écoresponsable spécialisée dans la vente de sneakers durables. Le projet combine un CMS headless (Payload) avec un frontend Next.js pour créer une expérience d'achat moderne et performante.

### Objectifs principaux

- Plateforme e-commerce complète avec gestion des produits, commandes et clients
- Interface d'administration robuste pour la gestion du contenu
- Expérience utilisateur optimisée avec panier, favoris et compte client
- Système de gestion de stock avancé
- Conformité RGPD avec gestion des cookies

## Architecture technique

### Architecture globale

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Base de       │
│   Next.js       │◄──►│   Payload CMS   │◄──►│   données       │
│   (App Router)  │    │   + API Routes  │    │   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Principe de fonctionnement

- **Frontend Next.js** : Interface utilisateur, pages statiques/dynamiques, SSR
- **Payload CMS** : API REST/GraphQL, interface d'administration, gestion des contenus
- **PostgreSQL** : Stockage des données avec migrations gérées
- **Vercel Blob** : Stockage des médias (temporairement désactivé)

## Stack technologique

### Technologies principales

- **Next.js 15.4.4** : Framework React avec App Router
- **Payload CMS 3.55.1** : CMS headless avec interface d'administration
- **TypeScript 5.7.3** : Typage statique
- **PostgreSQL** : Base de données relationnelle
- **Tailwind CSS** : Framework CSS utilitaire
- **React 19.1.0** : Bibliothèque UI

### Dépendances clés

- **@payloadcms/db-postgres** : Adaptateur PostgreSQL pour Payload
- **@payloadcms/richtext-lexical** : Éditeur de texte riche
- **@radix-ui/react-\*** : Composants UI primitifs
- **class-variance-authority** : Gestion des variantes CSS
- **framer-motion** : Animations
- **stripe** : Paiements en ligne
- **sonner** : Notifications toast

### Outils de développement

- **Vitest** : Tests unitaires et d'intégration
- **Playwright** : Tests end-to-end
- **ESLint** : Linting JavaScript/TypeScript
- **Prettier** : Formatage de code

## Structure du projet

```
terra/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── (frontend)/        # Pages publiques
│   │   ├── (payload)/         # Interface d'administration
│   │   └── api/               # API Routes Next.js
│   ├── collections/           # Collections Payload CMS
│   ├── components/            # Composants React
│   │   ├── terra/            # Composants métier TERRA
│   │   └── ui/               # Composants UI génériques
│   ├── hooks/                # Hooks React personnalisés
│   ├── providers/            # Context providers
│   ├── utilities/            # Fonctions utilitaires
│   └── payload.config.ts     # Configuration Payload
├── public/                   # Assets statiques
├── tests/                   # Tests
├── scripts/                 # Scripts de développement
└── docs et configs
```

## Configuration Payload CMS

### Configuration principale (`src/payload.config.ts`)

```typescript
export default buildConfig({
  // Base de données PostgreSQL
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      max: 2, // Limite pour Supabase Session Mode
      min: 0,
      idleTimeoutMillis: 5000,
      connectionTimeoutMillis: 10000,
      allowExitOnIdle: true,
    },
    migrationDir: './src/migrations',
    push: process.env.NODE_ENV === 'development' ? false : true,
  }),

  // Collections définies
  collections: [
    Pages, Posts, Media, Categories, Users,
    Products, TerraCollections, Orders,
    Customers, Addresses, StockMovements, StockAlerts
  ],

  // Globals (Header, Footer)
  globals: [Header, Footer],

  // Plugins activés
  plugins: [...plugins],

  // Configuration admin
  admin: {
    user: Users.slug,
    livePreview: process.env.NODE_ENV === 'production' ? {...} : undefined,
  }
})
```

### Optimisations configurées

- **Pool de connexions limité** : Adapté à Supabase Session Mode
- **Live Preview désactivé en développement** : Réduit les rechargements
- **Push migrations conditionnelles** : Sécurité en production
- **Webpack optimisé** : Réduction des rechargements de fichiers

## Modèles de données

### 1. Products (Produits)

```typescript
{
  title: string,              // Nom du produit
  slug: string,              // URL unique (auto-généré)
  collection: 'origin' | 'move' | 'limited',
  price: number,             // Prix en euros
  description: richText,     // Description Lexical
  shortDescription: string,  // Description courte
  images: Media[],          // Images du produit
  colors: Array<{           // Couleurs disponibles
    name: string,
    hex: string,
    images: Media[]
  }>,
  sizes: Array<{            // Tailles et stock
    size: string,
    stock: number,
    preorderStock?: number
  }>,
  ecoScore: number,         // Score écologique (1-100)
  materials: Array<{        // Matériaux utilisés
    name: string,
    percentage: number,
    sustainability: string
  }>,
  // ... autres champs métier
}
```

### 2. Orders (Commandes)

```typescript
{
  orderNumber: string,      // Numéro unique auto-généré
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled',
  user?: User,             // Utilisateur connecté (optionnel)
  customer: {              // Informations client
    email: string,
    firstName: string,
    lastName: string,
    phone?: string
  },
  items: Array<{           // Articles commandés
    product: Product,
    quantity: number,
    size: string,
    color: string,
    unitPrice: number
  }>,
  shipping: {              // Adresse de livraison
    method: 'standard' | 'express' | 'pickup',
    address: Address,
    cost: number
  },
  payment: {               // Informations de paiement
    method: 'card' | 'paypal' | 'transfer',
    status: 'pending' | 'paid' | 'failed' | 'refunded',
    stripePaymentIntentId?: string,
    amount: number
  },
  totals: {                // Totaux calculés
    subtotal: number,
    shipping: number,
    tax: number,
    total: number
  }
}
```

### 3. TerraCollections (Collections TERRA)

```typescript
{
  name: string,            // Nom de la collection
  slug: string,           // URL unique
  tagline: string,        // Slogan
  description: richText,  // Description détaillée
  priceRange: {           // Fourchette de prix
    from: number,
    to?: number
  },
  heroImage: Media,       // Image principale
  lifestyleImage: Media,  // Image lifestyle
  keyFeatures: string[],  // Caractéristiques clés
  materials: Array<{      // Matériaux de la collection
    name: string,
    description: string,
    sustainabilityBenefit: string,
    image: Media
  }>,
  craftsmanship: {        // Savoir-faire
    story: richText,
    techniques: string[],
    certifications: string[]
  }
}
```

### 4. Autres collections importantes

- **Users** : Comptes utilisateurs avec authentification
- **Customers** : Profils clients avec historique
- **Addresses** : Adresses de livraison/facturation
- **StockMovements** : Mouvements de stock pour traçabilité
- **StockAlerts** : Alertes de stock faible
- **Media** : Gestion centralisée des médias

## Architecture Next.js

### Structure App Router

```
app/
├── (frontend)/              # Groupe de routes publiques
│   ├── page.tsx            # Page d'accueil
│   ├── products/           # Catalogue produits
│   ├── collections/        # Pages collections
│   ├── cart/              # Panier
│   ├── checkout/          # Tunnel de commande
│   ├── account/           # Espace client
│   └── [slug]/            # Pages dynamiques CMS
├── (payload)/              # Interface d'administration
│   ├── admin/             # Dashboard Payload
│   └── api/               # API Payload générée
└── api/                   # API Routes personnalisées
    ├── auth/              # Authentification
    ├── checkout/          # Paiement Stripe
    ├── orders/            # Gestion commandes
    └── products/          # API produits
```

### Pages principales

#### Page d'accueil (`app/(frontend)/page.tsx`)

- Rendu statique avec données dynamiques
- Hero sections configurables via CMS
- Produits mis en avant
- Collections TERRA

#### Pages produits (`app/(frontend)/products/[slug]/page.tsx`)

- Génération statique des paramètres
- Métadonnées SEO dynamiques
- Galerie d'images interactive
- Sélection taille/couleur
- Ajout au panier avec gestion d'état

#### Tunnel de commande (`app/(frontend)/checkout/page.tsx`)

- Formulaire multi-étapes
- Validation côté client et serveur
- Intégration Stripe Payment Intent
- Gestion des erreurs de paiement

### API Routes personnalisées

#### Authentification (`app/api/auth/`)

- **POST /api/auth/login** : Connexion utilisateur
- **POST /api/auth/register** : Inscription
- **GET /api/auth/me** : Profil utilisateur actuel
- **POST /api/auth/logout** : Déconnexion

#### Commandes (`app/api/orders/`)

- **POST /api/orders/create** : Création de commande
- **GET /api/account/orders** : Commandes de l'utilisateur

#### Paiement (`app/api/checkout/`)

- **POST /api/checkout/create-payment-intent** : Stripe Payment Intent
- **POST /api/checkout/webhook** : Webhooks Stripe

## Système d'authentification

### Architecture

- **Authentification basée sur JWT** via Payload CMS
- **Cookies HTTP-only** pour la sécurité
- **Sessions de 2 heures** avec renouvellement automatique
- **Gestion des rôles** : admin, user

### Implémentation

#### Connexion (`app/api/auth/login/route.ts`)

```typescript
export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const result = await payload.login({
    collection: 'users',
    data: { email, password },
  })

  if (result.token) {
    const response = NextResponse.json({ success: true, user: result.user })

    response.cookies.set('payload-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7200, // 2 heures
      path: '/',
    })

    return response
  }
}
```

#### Vérification d'authentification (`app/api/auth/me/route.ts`)

- Récupération du token depuis les cookies
- Validation via `payload.auth()`
- Enrichissement avec données utilisateur complètes
- Gestion des erreurs de token expiré

### Contrôle d'accès Payload

```typescript
// Collections avec accès contrôlé
access: {
  create: authenticated,      // Seuls les admins peuvent créer
  read: anyone,              // Lecture publique
  update: authenticated,     // Modification admin uniquement
  delete: authenticated      // Suppression admin uniquement
}
```

## Logique métier

### Gestion du panier (`src/providers/CartProvider.tsx`)

#### Structure de données

```typescript
interface CartItem {
  id: string // Clé unique: `${productId}-${size}-${color}`
  product: Product
  size: string
  color: string
  quantity: number
  addedAt: Date
}
```

#### Fonctionnalités

- **Persistance localStorage** : Sauvegarde automatique
- **Protection contre les doublons** : Système de déduplication
- **Calculs automatiques** : Total articles et prix
- **Gestion des quantités** : Mise à jour et suppression
- **Notifications toast** : Feedback utilisateur

#### Actions principales

```typescript
const {
  addToCart, // Ajouter un produit
  removeFromCart, // Supprimer un article
  updateQuantity, // Modifier la quantité
  clearCart, // Vider le panier
  totalItems, // Nombre total d'articles
  totalPrice, // Prix total
  isInCart, // Vérifier présence
  getItemQuantity, // Obtenir quantité spécifique
} = useCart()
```

### Gestion des comptes (`src/providers/AccountProvider.tsx`)

#### Fonctionnalités

- **Authentification automatique** : Vérification au chargement
- **Gestion des adresses** : CRUD adresses de livraison
- **Historique des commandes** : Suivi des achats
- **Profil utilisateur** : Modification des informations
- **Déconnexion automatique** : Token expiré

### Gestion du stock (`src/hooks/stockManagement.ts`)

#### Système de stock

- **Stock réel** : Quantité disponible immédiatement
- **Stock précommande** : Quantité en précommande
- **Mouvements de stock** : Traçabilité complète
- **Alertes automatiques** : Notifications stock faible
- **Suggestions de réapprovisionnement** : Calculs automatiques

#### Hooks de gestion

```typescript
// Après création de commande
afterChange: [updateStockAfterOrder]

// Calcul automatique des alertes
afterChange: [createStockAlerts]
```

## Composants UI

### Architecture des composants

#### Composants de base (`src/components/ui/`)

- **Design system** basé sur Radix UI primitives
- **Variantes CSS** avec class-variance-authority
- **Theming** via CSS custom properties
- **Accessibilité** intégrée

```typescript
// Exemple: Button component
const buttonVariants = cva('inline-flex items-center justify-center...', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
      outline: 'border border-border bg-background',
      ghost: 'hover:bg-card',
      terra: '', // Variante personnalisée TERRA
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded px-3',
      lg: 'h-11 rounded px-8',
      icon: 'h-10 w-10',
    },
  },
})
```

#### Composants métier (`src/components/terra/`)

- **TerraHeader** : Header avec navigation et panier
- **TerraFilters** : Filtres de recherche produits
- **TerraProductCard** : Carte produit avec favoris
- **CookieBanner** : Gestion RGPD des cookies
- **TerraFooter** : Footer avec liens et informations

### Système de design

#### Couleurs

- **Palette TERRA** : Couleurs naturelles et durables
- **Mode sombre/clair** : Thème adaptatif
- **Contraste accessible** : WCAG 2.1 AA compliant

#### Typographie

- **Font primaire** : Geist (moderne et lisible)
- **Font display** : Nectarine (identité TERRA)
- **Échelle modulaire** : Tailles cohérentes

#### Animations

- **Framer Motion** : Animations fluides
- **Transitions CSS** : Micro-interactions
- **Performance** : Animations optimisées

## Tests

### Architecture de test

#### Tests unitaires (Vitest)

- **Configuration** : `vitest.config.unit.mts`
- **Environnement** : jsdom pour composants React
- **Pattern** : `tests/unit/**/*.test.{ts,tsx}`
- **Coverage** : Seuil minimum 70%

```typescript
// Exemple de test de hook
describe('useCart', () => {
  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addToCart(mockProduct, '42', 'white', 1)
    })

    expect(result.current.totalItems).toBe(1)
    expect(result.current.totalPrice).toBe(mockProduct.price)
  })
})
```

#### Tests d'intégration (Vitest)

- **Configuration** : `vitest.config.integration.mts`
- **Environnement** : Node.js pour API
- **Pattern** : `tests/integration/**/*.int.spec.ts`
- **Base de données** : Tests avec vraie DB
- **Séquentiel** : maxConcurrency: 1

```typescript
// Exemple de test d'API
describe('POST /api/auth/login', () => {
  it('should login user with valid credentials', async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'password' }),
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.user.email).toBe('test@test.com')
  })
})
```

#### Tests E2E (Playwright)

- **Configuration** : `playwright.config.ts`
- **Navigateur** : Chromium
- **Pattern** : `tests/e2e/**/*.e2e.spec.ts`
- **Serveur automatique** : Démarrage/arrêt du dev server

```typescript
// Exemple de test E2E
test('should complete purchase flow', async ({ page }) => {
  await page.goto('/products/terra-origin-white')
  await page.click('[data-testid="add-to-cart"]')
  await page.click('[data-testid="cart-button"]')
  await page.click('[data-testid="checkout-button"]')

  // Remplir formulaire de checkout
  await page.fill('[name="email"]', 'customer@test.com')
  // ... autres champs

  await page.click('[data-testid="place-order"]')
  await expect(page.locator('[data-testid="order-success"]')).toBeVisible()
})
```

### Script de test unifié (`scripts/run-all-tests.sh`)

- **Interface unifiée** : Un script pour tous les tests
- **Options flexibles** : --unit, --integration, --e2e, --all
- **Mode watch** : Développement en continu
- **Couverture de code** : Rapports détaillés
- **CI/CD ready** : Support des environnements automatisés

## Déploiement

### Configuration Vercel

#### Build optimisé (`next.config.js`)

```javascript
const nextConfig = {
  output: 'standalone',           // Build optimisé
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [...],        // Domaines d'images autorisés
  },
  webpack: (config) => {
    // Optimisations webpack
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: ['**/node_modules', '**/.next', '**/migrations']
    }
    return config
  }
}
```

#### Variables d'environnement

```bash
# Base de données
DATABASE_URI=postgresql://...
PAYLOAD_SECRET=your-secret-key

# Stripe
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Vercel Blob (optionnel)
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# URLs
NEXT_PUBLIC_SERVER_URL=https://your-domain.com
```

#### Script de build (`scripts/build-vercel.sh`)

- **Migrations automatiques** : `payload migrate`
- **Build Next.js** : `next build`
- **Génération de types** : `payload generate:types`

### Environnements

#### Développement

- **Base de données locale** : PostgreSQL ou Supabase
- **Hot reload** : Optimisé pour réduire les rechargements
- **Debug tools** : Logs détaillés, sourcemaps

#### Production

- **Base de données** : Supabase ou PostgreSQL managé
- **CDN** : Vercel Edge Network
- **Monitoring** : Vercel Analytics
- **Sécurité** : Headers de sécurité, HTTPS

## Scripts et automatisation

### Scripts package.json

```json
{
  "scripts": {
    "dev": "next dev", // Développement
    "build": "next build", // Build production
    "start": "next start", // Serveur production
    "test": "./scripts/run-all-tests.sh --all", // Tous les tests
    "test:unit": "vitest run --config ./vitest.config.unit.mts",
    "test:integration": "vitest run --config ./vitest.config.integration.mts",
    "test:e2e": "playwright test",
    "lint": "next lint", // Linting
    "payload": "payload", // CLI Payload
    "generate:types": "payload generate:types" // Génération types
  }
}
```

### Scripts utilitaires (`scripts/`)

#### `run-all-tests.sh`

Script principal pour tous les tests avec options avancées :

- **Types de tests** : --unit, --integration, --e2e, --all
- **Mode watch** : --watch pour développement
- **Couverture** : --coverage pour rapports détaillés
- **Mode CI** : --ci pour intégration continue
- **Gestion des erreurs** : Nettoyage automatique en cas d'interruption

#### Scripts d'import de données

- **`bulk_import.py`** : Import en masse de produits
- **`sneakers_importer.py`** : Import spécialisé sneakers
- **`create-admin.js`** : Création d'utilisateur admin
- **`setup_admin.py`** : Configuration initiale

#### Scripts d'images

- **`ai_image_generator.py`** : Génération d'images par IA
- **`fetch_real_shoe_images.py`** : Récupération d'images produits
- **`mass_image_fill.py`** : Attribution d'images en masse

---

Cette documentation technique couvre l'ensemble de l'architecture et de l'implémentation du projet TERRA. Elle est conçue pour permettre à un développeur professionnel de comprendre rapidement le projet et de pouvoir le reprendre ou le maintenir efficacement.

Pour toute question technique ou besoin de clarification sur un aspect spécifique, n'hésitez pas à consulter le code source qui est entièrement commenté et organisé de manière cohérente.
