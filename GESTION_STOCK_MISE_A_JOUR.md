# 📦 Gestion automatique du stock après validation Stripe

## Vue d'ensemble

Le système de gestion de stock a été amélioré pour automatiquement décrémenter le stock des produits après validation d'un paiement Stripe. Voici comment cela fonctionne :

## 🔄 Flux de gestion du stock

### 1. Création du PaymentIntent (`/api/checkout/create-payment-intent`)

```typescript
// Vérification de la disponibilité du stock
const sizeData = product.sizes?.find((s: any) => s.size === item.size)
if (!sizeData || sizeData.availableStock < item.quantity) {
  return NextResponse.json({ error: 'Stock insuffisant' }, { status: 400 })
}

// Réservation temporaire du stock (30 minutes)
await reserveStock(item.product.id, item.size, item.quantity, paymentIntent.id)
```

### 2. Validation du paiement (Webhook Stripe)

**Paiement réussi** (`payment_intent.succeeded`) :

```typescript
// Décrémentation définitive du stock
await decrementStock(item.product.id, item.size, item.quantity, order.orderNumber)

// Création automatique d'un mouvement de stock pour traçabilité
await payload.create({
  collection: 'stock-movements',
  data: {
    product: item.product.id,
    type: 'sale',
    quantity: -item.quantity,
    reason: `Vente - Commande ${order.orderNumber}`,
    // ...
  },
})
```

**Paiement échoué** (`payment_intent.payment_failed`) :

```typescript
// Libération du stock réservé
await releaseStock(item.product.id, item.size, item.quantity, paymentIntent.id)
```

## 🏗️ Architecture

### Fichiers modifiés

1. **`src/app/api/checkout/webhook/route.ts`**
   - Gestion des événements Stripe
   - Décrémentation du stock après paiement réussi
   - Libération du stock après paiement échoué

2. **`src/app/api/checkout/create-payment-intent/route.ts`**
   - Vérification et réservation temporaire du stock
   - Utilisation des nouvelles fonctions utilitaires

3. **`src/utilities/stockReservation.ts`** (nouveau)
   - Fonctions utilitaires pour la gestion du stock
   - Réservation/libération temporaire
   - Décrémentation définitive avec traçabilité

4. **`src/app/api/admin/clean-expired-reservations/route.ts`** (nouveau)
   - API pour nettoyer les réservations expirées
   - Monitoring des réservations actives

### Fonctions utilitaires

```typescript
// Réserver temporairement du stock
await reserveStock(productId, size, quantity, paymentIntentId)

// Libérer une réservation
await releaseStock(productId, size, quantity, paymentIntentId)

// Décrémenter définitivement le stock
await decrementStock(productId, size, quantity, orderNumber)

// Nettoyer les réservations expirées (>30min)
await cleanExpiredReservations()
```

## 📊 Structure des données

### Product.sizes

```typescript
{
  size: "42",
  stock: 10,              // Stock total
  reservedStock: 2,       // Stock temporairement réservé
  availableStock: 8,      // Stock disponible (calculé automatiquement)
  lowStockThreshold: 5,
  isLowStock: false       // Calculé automatiquement
}
```

### StockMovement (traçabilité)

```typescript
{
  product: "product_id",
  size: "42",
  type: "sale",           // sale, restock, return, adjustment
  quantity: -1,           // Négatif pour vente, positif pour réapprovisionnement
  stockBefore: 10,
  stockAfter: 9,
  reason: "Vente - Commande ORD-2024-001",
  reference: "ORD-2024-001",
  orderReference: "ORD-2024-001",
  date: "2024-01-01T12:00:00Z"
}
```

## ⚡ Gestion des cas particuliers

### Réservations expirées

- Les réservations expirent après 30 minutes
- Elles sont automatiquement libérées via l'API `/api/admin/clean-expired-reservations`
- Recommandé : configurer un cron job pour appeler cette API toutes les 15 minutes

### Stock insuffisant

- Vérification en temps réel avant création du PaymentIntent
- Message d'erreur explicite à l'utilisateur
- Pas de création de PaymentIntent si stock insuffisant

### Gestion des erreurs

- Tous les échecs sont loggés avec détails
- Le stock n'est jamais décrémenté en cas d'erreur
- Système de rollback automatique pour les réservations

## 🔧 Configuration

### Variables d'environnement

```env
# Optionnel : Token pour l'API de nettoyage
ADMIN_API_TOKEN=your_secret_token_here
```

### Cron job recommandé

```bash
# Nettoyer les réservations expirées toutes les 15 minutes
*/15 * * * * curl -X POST https://votre-domaine.com/api/admin/clean-expired-reservations \
  -H "Authorization: Bearer $ADMIN_API_TOKEN"
```

## 📈 Monitoring

### API de monitoring

- `GET /api/admin/clean-expired-reservations` : Statistiques des réservations
- Logs détaillés dans la console pour chaque opération
- Traçabilité complète via la collection `stock-movements`

### Métriques importantes

- Nombre de réservations actives
- Réservations les plus anciennes
- Mouvements de stock par produit
- Alertes de stock faible automatiques

## ✅ Tests recommandés

1. **Test de paiement réussi**
   - Vérifier la décrémentation du stock
   - Vérifier la création du mouvement de stock
   - Vérifier la libération de la réservation

2. **Test de paiement échoué**
   - Vérifier la libération de la réservation
   - Vérifier que le stock n'est pas décrémenté

3. **Test de stock insuffisant**
   - Vérifier le blocage avant PaymentIntent
   - Vérifier le message d'erreur

4. **Test d'expiration de réservation**
   - Attendre 30 minutes ou forcer l'expiration
   - Vérifier la libération automatique

## 🚀 Déploiement

Le système est maintenant opérationnel ! Les modifications sont compatibles avec l'existant et n'affectent pas les commandes déjà créées.

Pour activer le nettoyage automatique des réservations expirées, configurez un cron job ou un service de monitoring pour appeler l'API de nettoyage régulièrement.
