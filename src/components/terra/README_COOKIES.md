# 🍪 Système de Gestion des Cookies TERRA

## Vue d'ensemble

Le système de cookies TERRA est conçu pour être **conforme RGPD** et offrir une **expérience utilisateur optimale**. Il respecte les principes de transparence, de contrôle utilisateur et de minimisation des données.

## Composants

### 1. `CookieBanner.tsx`

Le bandeau principal qui apparaît lors de la première visite.

**Fonctionnalités :**

- Affichage automatique après 2 secondes
- 3 options : Tout accepter, Nécessaires uniquement, Personnaliser
- Vue détaillée des préférences avec toggles
- Sauvegarde dans localStorage
- Design responsive et accessible

### 2. `CookieSettingsButton.tsx`

Bouton pour rouvrir les préférences de cookies.

**Utilisation :**

```tsx
import { CookieSettingsButton } from '@/components/terra/CookieSettingsButton'

;<CookieSettingsButton />
```

### 3. `useCookieConsent.ts`

Hook React pour gérer l'état des cookies dans l'application.

**Utilisation :**

```tsx
import { useCookieConsent } from '@/hooks/useCookieConsent'

const { canUseAnalytics, canUseMarketing, hasConsent } = useCookieConsent()
```

### 4. `Analytics.tsx`

Composant pour charger Google Analytics conditionnellement.

**Fonctionnalités :**

- Chargement conditionnel de GA
- Anonymisation des IP (RGPD)
- Hook `useAnalytics()` pour tracker des événements

## Types de Cookies

### 🟢 Nécessaires (Toujours activés)

- Session utilisateur
- Panier d'achat
- Sécurité CSRF
- Préférences de cookies

### 🔵 Analytiques (Optionnels)

- Google Analytics (anonymisé)
- Statistiques de performance
- Amélioration UX

### 🟣 Personnalisation (Optionnels)

- Préférences utilisateur
- Historique de navigation
- Recommandations

### 🟠 Marketing (Optionnels)

- Facebook Pixel
- Google Ads
- Retargeting

## Configuration

### Variables d'environnement

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Intégration dans le layout

```tsx
import { CookieBanner } from '@/components/terra/CookieBanner'
import { Analytics } from '@/components/terra/Analytics'

// Dans le body
<CookieBanner />
<Analytics />
```

## Conformité RGPD

✅ **Consentement explicite** : L'utilisateur doit choisir activement
✅ **Granularité** : Choix par catégorie de cookies
✅ **Révocabilité** : Possibilité de changer d'avis à tout moment
✅ **Transparence** : Explication claire de chaque type
✅ **Minimisation** : Seuls les cookies nécessaires par défaut
✅ **Documentation** : Politique des cookies détaillée

## Utilisation avancée

### Tracker des événements

```tsx
import { useAnalytics } from '@/components/terra/Analytics'

const { trackEvent, canTrack } = useAnalytics()

const handlePurchase = () => {
  if (canTrack) {
    trackEvent('purchase', {
      transaction_id: 'T123',
      value: 159.99,
      currency: 'EUR',
    })
  }
}
```

### Vérifier le consentement

```tsx
import { useCookieConsent } from '@/hooks/useCookieConsent'

const { canUseMarketing } = useCookieConsent()

if (canUseMarketing()) {
  // Charger Facebook Pixel
  loadFacebookPixel()
}
```

## Stockage

Les préférences sont stockées dans `localStorage` :

```json
{
  "preferences": {
    "necessary": true,
    "analytics": false,
    "marketing": false,
    "personalization": true
  },
  "timestamp": 1703123456789
}
```

## Maintenance

### Mise à jour des cookies

1. Modifier les types dans `useCookieConsent.ts`
2. Mettre à jour `CookieBanner.tsx` avec les nouvelles catégories
3. Documenter dans `/cookies` page
4. Tester le consentement

### Tests recommandés

- [ ] Banner s'affiche sur première visite
- [ ] Préférences sont sauvegardées
- [ ] Analytics ne charge que si consenti
- [ ] Bouton de réouverture fonctionne
- [ ] Design responsive sur mobile
- [ ] Accessibilité (navigation clavier)

## Support navigateurs

✅ Chrome/Edge 88+
✅ Firefox 85+
✅ Safari 14+
✅ Mobile iOS/Android

## Notes importantes

⚠️ **localStorage requis** : Le système nécessite localStorage
⚠️ **Pas de cookies serveur** : Tout est géré côté client
⚠️ **Rechargement après settings** : Pour réinitialiser le banner
⚠️ **HTTPS requis** : Pour les cookies sécurisés en production
