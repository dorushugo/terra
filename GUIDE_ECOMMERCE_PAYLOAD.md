# 🛍️ Guide : Créer un E-commerce avec Payload CMS

Ce guide explique comment transformer un template Payload basique en e-commerce complet avec catalogue de produits, système de panier, favoris et import automatique de données.

## 📋 Table des matières

1. [Installation du template Payload](#1-installation-du-template-payload)
2. [Configuration de la base de données](#2-configuration-de-la-base-de-données)
3. [Création des collections e-commerce](#3-création-des-collections-e-commerce)
4. [Développement du frontend](#4-développement-du-frontend)
5. [Import automatique de produits](#5-import-automatique-de-produits)
6. [Styling et branding](#6-styling-et-branding)
7. [Déploiement](#7-déploiement)

---

## 1. Installation du template Payload

### 🚀 Démarrage rapide

```bash
# 1. Cloner le template Payload Website
npx create-payload-app@latest mon-ecommerce --template website

# 2. Naviguer dans le dossier
cd mon-ecommerce

# 3. Installer les dépendances
pnpm install

# 4. Démarrer en mode dev
pnpm dev
```

### 📁 Structure du template de base

```
mon-ecommerce/
├── src/
│   ├── collections/          # Collections CMS
│   │   ├── Pages.ts         # Pages statiques
│   │   ├── Posts.ts         # Articles blog
│   │   ├── Media.ts         # Images/fichiers
│   │   └── Users.ts         # Utilisateurs
│   ├── app/(frontend)/      # Frontend Next.js
│   │   ├── layout.tsx       # Layout principal
│   │   └── page.tsx         # Homepage
│   ├── components/          # Composants réutilisables
│   └── payload.config.ts    # Configuration Payload
├── package.json
└── tailwind.config.mjs
```

---

## 2. Configuration de la base de données

### 🐘 Option A : PostgreSQL local avec Docker

```bash
# 1. Créer docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ecommerce
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
EOF

# 2. Démarrer PostgreSQL
docker-compose up -d

# 3. Configurer .env
cat > .env << EOF
DATABASE_URI=postgresql://postgres:password@localhost:5432/ecommerce
PAYLOAD_SECRET=your-secret-key-here
EOF
```

### ☁️ Option B : Supabase (recommandé)

```bash
# 1. Créer un projet sur supabase.com
# 2. Récupérer la connection string
# 3. Configurer .env
cat > .env << EOF
DATABASE_URI=postgresql://[user]:[password]@[host]/[db]?pgbouncer=true
PAYLOAD_SECRET=your-secret-key-here
EOF
```

---

## 3. Création des collections e-commerce

### 📦 Collection Products

Créer `src/collections/Products/index.ts` :

```typescript
import { CollectionConfig } from 'payload/types'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'category', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Électronique', value: 'electronics' },
        { label: 'Vêtements', value: 'clothing' },
        { label: 'Maison', value: 'home' },
        { label: 'Sport', value: 'sports' },
      ],
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      maxLength: 200,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'stock',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
        },
      ],
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isNewArrival',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
    },
    {
      name: 'reviewCount',
      type: 'number',
      min: 0,
      defaultValue: 0,
    },
  ],
}
```

### 🛒 Collection Orders

Créer `src/collections/Orders/index.ts` :

```typescript
import { CollectionConfig } from 'payload/types'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerEmail', 'total', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      unique: true,
      required: true,
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          min: 1,
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
    },
    {
      name: 'shipping',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'tax',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Confirmée', value: 'confirmed' },
        { label: 'Expédiée', value: 'shipped' },
        { label: 'Livrée', value: 'delivered' },
        { label: 'Annulée', value: 'cancelled' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'firstName', type: 'text', required: true },
        { name: 'lastName', type: 'text', required: true },
        { name: 'address', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
      ],
    },
  ],
}
```

### 👥 Collection Customers

Créer `src/collections/Customers/index.ts` :

```typescript
import { CollectionConfig } from 'payload/types'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'totalSpent', 'updatedAt'],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      unique: true,
      required: true,
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'addresses',
      type: 'array',
      fields: [
        { name: 'type', type: 'select', options: ['billing', 'shipping'] },
        { name: 'address', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
      ],
    },
    {
      name: 'totalSpent',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'orderCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'lastOrderDate',
      type: 'date',
    },
  ],
}
```

### ⚙️ Mise à jour de payload.config.ts

```typescript
import { buildConfig } from 'payload/config'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

// Collections existantes
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Users } from './collections/Users'

// Nouvelles collections e-commerce
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { Customers } from './collections/Customers'

// Globals
import { Header } from './Header/config'
import { Footer } from './Footer/config'

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Users,
    // Collections e-commerce
    Products,
    Orders,
    Customers,
  ],
  globals: [Header, Footer],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
})
```

---

## 4. Développement du frontend

### 🏠 Page produits

Créer `src/app/(frontend)/products/page.tsx` :

```typescript
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ProductsClient } from './page.client'
import type { Product } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Tous nos produits',
  description: 'Découvrez notre catalogue complet',
}

export default async function ProductsPage() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 50,
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: '-createdAt',
  })

  return <ProductsClient initialProducts={products.docs as Product[]} />
}
```

Créer `src/app/(frontend)/products/page.client.tsx` :

```typescript
'use client'

import { useState, useMemo } from 'react'
import type { Product } from '@/payload-types'
import { ProductCard } from '@/components/ProductCard'
import { ProductFilters } from '@/components/ProductFilters'

interface ProductsClientProps {
  initialProducts: Product[]
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 1000] as [number, number],
    featured: false,
    newArrivals: false,
  })

  const [sortBy, setSortBy] = useState('newest')

  const filteredProducts = useMemo(() => {
    let filtered = [...initialProducts]

    // Appliquer les filtres
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    filtered = filtered.filter(
      product => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    )

    if (filters.featured) {
      filtered = filtered.filter(product => product.isFeatured)
    }

    if (filters.newArrivals) {
      filtered = filtered.filter(product => product.isNewArrival)
    }

    // Appliquer le tri
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return filtered
  }, [initialProducts, filters, sortBy])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filtres */}
        <aside className="lg:w-64">
          <ProductFilters
            filters={filters}
            onFiltersChange={setFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </aside>

        {/* Grille de produits */}
        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Nos produits</h1>
            <p className="text-gray-600">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
```

### 🛒 Hooks pour panier et favoris

Créer `src/hooks/useCart.ts` :

```typescript
'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@/payload-types'

interface CartItem {
  product: Product
  quantity: number
  variant?: string
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  // Charger depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      setItems(JSON.parse(saved))
    }
  }, [])

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, quantity = 1, variant?: string) => {
    setItems((current) => {
      const existingIndex = current.findIndex(
        (item) => item.product.id === product.id && item.variant === variant,
      )

      if (existingIndex >= 0) {
        const updated = [...current]
        updated[existingIndex].quantity += quantity
        return updated
      }

      return [...current, { product, quantity, variant }]
    })
  }

  const removeItem = (productId: string, variant?: string) => {
    setItems((current) =>
      current.filter((item) => !(item.product.id === productId && item.variant === variant)),
    )
  }

  const updateQuantity = (productId: string, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeItem(productId, variant)
      return
    }

    setItems((current) =>
      current.map((item) =>
        item.product.id === productId && item.variant === variant ? { ...item, quantity } : item,
      ),
    )
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  }
}
```

---

## 5. Import automatique de produits

### 🐍 Script Python pour import massif

Créer `scripts/bulk_import.py` :

```python
#!/usr/bin/env python3
"""
Script d'import en masse de produits pour e-commerce Payload
"""

import requests
import json
import random
from typing import List, Dict

# Configuration
PAYLOAD_API_URL = "http://localhost:3000/api"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "password"

# Données de génération
CATEGORIES = ["electronics", "clothing", "home", "sports"]
BRANDS = ["Apple", "Samsung", "Nike", "Adidas", "IKEA", "Sony"]
ADJECTIVES = ["Premium", "Pro", "Ultra", "Smart", "Eco", "Deluxe"]
PRODUCTS = ["Phone", "Laptop", "Shirt", "Shoes", "Chair", "Headphones"]

class BulkImporter:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None

    def authenticate(self):
        """S'authentifier avec Payload"""
        response = self.session.post(
            f"{PAYLOAD_API_URL}/users/login",
            json={
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            }
        )

        if response.status_code == 200:
            self.auth_token = response.json().get("token")
            self.session.headers.update({
                "Authorization": f"Bearer {self.auth_token}"
            })
            print("✅ Authentification réussie")
            return True
        else:
            print(f"❌ Erreur authentification: {response.status_code}")
            return False

    def generate_product(self, index: int) -> Dict:
        """Générer un produit aléatoire"""
        brand = random.choice(BRANDS)
        adjective = random.choice(ADJECTIVES)
        product = random.choice(PRODUCTS)
        category = random.choice(CATEGORIES)

        title = f"{brand} {adjective} {product}"
        price = random.randint(20, 500)

        return {
            "title": title,
            "slug": title.lower().replace(" ", "-") + f"-{index}",
            "category": category,
            "price": price,
            "shortDescription": f"Découvrez le {title}, parfait pour votre quotidien.",
            "description": [
                {
                    "children": [
                        {
                            "text": f"Le {title} combine qualité et innovation. "
                                   f"Idéal pour la catégorie {category}, ce produit "
                                   f"offre un excellent rapport qualité-prix à {price}€."
                        }
                    ]
                }
            ],
            "isFeatured": random.choice([True, False]),
            "isNewArrival": random.choice([True, False]),
            "rating": round(random.uniform(3.5, 5.0), 1),
            "reviewCount": random.randint(0, 200),
            "_status": "published"
        }

    def create_product(self, product_data: Dict) -> bool:
        """Créer un produit dans Payload"""
        try:
            response = self.session.post(
                f"{PAYLOAD_API_URL}/products",
                json=product_data
            )

            if response.status_code == 201:
                result = response.json()
                print(f"✅ Produit créé: {result.get('title', 'Unknown')}")
                return True
            else:
                print(f"❌ Erreur création: {response.status_code}")
                return False

        except Exception as e:
            print(f"❌ Exception: {e}")
            return False

    def bulk_import(self, count: int = 50):
        """Import en masse"""
        print(f"🚀 Import de {count} produits")

        if not self.authenticate():
            return

        success_count = 0

        for i in range(1, count + 1):
            print(f"📦 {i}/{count}")

            product = self.generate_product(i)
            if self.create_product(product):
                success_count += 1

        print(f"\n🎉 Import terminé!")
        print(f"✅ Réussis: {success_count}/{count}")

def main():
    importer = BulkImporter()

    count = input("Nombre de produits à importer (défaut: 50): ").strip()
    count = int(count) if count.isdigit() else 50

    confirm = input(f"Importer {count} produits? (y/N): ").strip().lower()
    if confirm == 'y':
        importer.bulk_import(count)
    else:
        print("❌ Import annulé")

if __name__ == "__main__":
    main()
```

### 📋 Requirements Python

Créer `scripts/requirements.txt` :

```
requests>=2.28.0
```

### 🚀 Exécution de l'import

```bash
# 1. Installer les dépendances
cd scripts/
pip install -r requirements.txt

# 2. Créer un utilisateur admin dans Payload
# Via l'interface web : http://localhost:3000/admin

# 3. Lancer l'import
python3 bulk_import.py
```

---

## 6. Styling et branding

### 🎨 Configuration Tailwind

Modifier `tailwind.config.mjs` :

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f9fafb',
          500: '#6b7280',
          600: '#4b5563',
          900: '#111827',
        },
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 🎯 CSS global

Modifier `src/app/(frontend)/globals.css` :

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --background: 255 255 255;
  --foreground: 17 24 39;
  --primary: 59 130 246;
  --primary-foreground: 255 255 255;
  --secondary: 107 114 128;
  --muted: 249 250 251;
  --border: 229 231 235;
  --radius: 0.5rem;
}

body {
  @apply bg-background text-foreground font-body;
  font-feature-settings:
    'rlig' 1,
    'calt' 1;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  @apply font-display font-semibold;
}
```

---

## 7. Déploiement

### 🚀 Vercel (recommandé)

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Déployer
vercel

# 3. Configurer les variables d'environnement
vercel env add DATABASE_URI
vercel env add PAYLOAD_SECRET

# 4. Redéployer
vercel --prod
```

### 🐳 Docker

Créer `Dockerfile` :

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

---

## 🎉 Résultat final

Après avoir suivi ce guide, vous aurez :

- ✅ **CMS e-commerce complet** avec Payload
- ✅ **Frontend moderne** avec Next.js et Tailwind
- ✅ **Collections** : Products, Orders, Customers
- ✅ **Fonctionnalités** : Panier, favoris, filtres
- ✅ **Import automatique** de produits
- ✅ **Base de données** PostgreSQL/Supabase
- ✅ **Interface admin** pour gérer le contenu

### 📊 Statistiques

- **Temps de développement** : 1-2 jours
- **Produits importables** : Illimité
- **Performance** : Optimisé Next.js
- **Évolutivité** : Architecture modulaire

### 🔗 Ressources utiles

- [Documentation Payload](https://payloadcms.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase](https://supabase.com/docs)

**🚀 Bon développement !**
