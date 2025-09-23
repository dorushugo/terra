import { test, expect, Page } from '@playwright/test'

test.describe('User Journey E2E Tests', () => {
  let page: Page

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test.describe('Homepage and Navigation', () => {
    test('should load homepage and display main elements', async () => {
      await page.goto('/')

      // Vérifier le titre et les éléments principaux
      await expect(page).toHaveTitle(/TERRA/)
      await expect(page.locator('h1')).toContainText('Sneakers. Grounded in Purpose.')

      // Vérifier la navigation
      await expect(page.locator('nav')).toBeVisible()
      await expect(page.getByText('Produits')).toBeVisible()
      await expect(page.getByText('Collections')).toBeVisible()

      // Vérifier les sections principales
      await expect(page.getByText('Trois collections pensées pour ton style de vie')).toBeVisible()
    })

    test('should navigate to products page', async () => {
      await page.goto('/')

      await page.click('text=Produits')
      await expect(page).toHaveURL('/products')
      await expect(page.locator('h1')).toContainText('Nos Sneakers')
    })

    test('should navigate to collections', async () => {
      await page.goto('/')

      // Cliquer sur "Découvrir nos collections"
      await page.click('text=Découvrir nos collections')
      await expect(page).toHaveURL('/products')
    })
  })

  test.describe('Product Browsing', () => {
    test('should browse and filter products', async () => {
      await page.goto('/products')

      // Attendre que les produits se chargent
      await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })

      // Vérifier qu'il y a des produits
      const productCards = await page.locator('[data-testid="product-card"]').count()
      expect(productCards).toBeGreaterThan(0)

      // Tester les filtres si disponibles
      const filterButton = page.locator('text=Filtres')
      if (await filterButton.isVisible()) {
        await filterButton.click()

        // Filtrer par collection
        await page.click('text=TERRA Origin')
        await page.click('text=Appliquer')

        // Vérifier que les résultats sont filtrés
        await page.waitForTimeout(1000)
        const filteredProducts = await page.locator('[data-testid="product-card"]').count()
        expect(filteredProducts).toBeGreaterThan(0)
      }
    })

    test('should search for products', async () => {
      await page.goto('/products')

      const searchInput = page.locator('input[placeholder*="Rechercher"]')
      if (await searchInput.isVisible()) {
        await searchInput.fill('TERRA Origin')
        await page.keyboard.press('Enter')

        await page.waitForTimeout(1000)

        // Vérifier que les résultats contiennent le terme recherché
        const firstProduct = page.locator('[data-testid="product-card"]').first()
        await expect(firstProduct).toContainText('Origin')
      }
    })
  })

  test.describe('Product Detail and Cart', () => {
    test('should view product details and add to cart', async () => {
      await page.goto('/products')

      // Attendre et cliquer sur le premier produit
      await page.waitForSelector('[data-testid="product-card"]')
      await page.locator('[data-testid="product-card"]').first().click()

      // Vérifier qu'on est sur la page produit
      await expect(page).toHaveURL(/\/products\/[^/]+$/)

      // Vérifier les éléments de la page produit
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('text=€')).toBeVisible()

      // Sélectionner une taille si disponible
      const sizeButton = page.locator('[data-testid="size-selector"] button').first()
      if (await sizeButton.isVisible()) {
        await sizeButton.click()
      }

      // Ajouter au panier
      const addToCartButton = page.locator('text=Ajouter au panier')
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click()

        // Vérifier la confirmation
        await expect(page.locator('text=ajouté au panier')).toBeVisible()

        // Vérifier que le compteur du panier a augmenté
        const cartCounter = page.locator('[data-testid="cart-counter"]')
        if (await cartCounter.isVisible()) {
          const count = await cartCounter.textContent()
          expect(parseInt(count || '0')).toBeGreaterThan(0)
        }
      }
    })

    test('should add product to favorites', async () => {
      await page.goto('/products')

      await page.waitForSelector('[data-testid="product-card"]')

      // Hover sur le premier produit pour révéler le bouton favoris
      const firstProduct = page.locator('[data-testid="product-card"]').first()
      await firstProduct.hover()

      // Cliquer sur le bouton favoris
      const favoriteButton = firstProduct.locator('[data-testid="favorite-button"]')
      if (await favoriteButton.isVisible()) {
        await favoriteButton.click()

        // Vérifier que le produit est ajouté aux favoris
        await expect(favoriteButton).toHaveAttribute('aria-pressed', 'true')
      }
    })
  })

  test.describe('Cart Management', () => {
    test('should manage cart items', async () => {
      // D'abord ajouter un produit au panier
      await page.goto('/products')
      await page.waitForSelector('[data-testid="product-card"]')

      const firstProduct = page.locator('[data-testid="product-card"]').first()
      await firstProduct.click()

      // Ajouter au panier si possible
      const sizeButton = page.locator('[data-testid="size-selector"] button').first()
      if (await sizeButton.isVisible()) {
        await sizeButton.click()

        const addToCartButton = page.locator('text=Ajouter au panier')
        if (await addToCartButton.isVisible()) {
          await addToCartButton.click()
          await page.waitForTimeout(1000)
        }
      }

      // Aller au panier
      await page.goto('/cart')

      // Vérifier que le panier contient des articles
      const cartItems = page.locator('[data-testid="cart-item"]')
      const itemCount = await cartItems.count()

      if (itemCount > 0) {
        // Tester la modification de quantité
        const quantityInput = cartItems.first().locator('input[type="number"]')
        if (await quantityInput.isVisible()) {
          await quantityInput.fill('2')
          await page.waitForTimeout(1000)

          // Vérifier que le total a été mis à jour
          await expect(page.locator('[data-testid="cart-total"]')).toBeVisible()
        }

        // Tester la suppression d'article
        const removeButton = cartItems.first().locator('button[aria-label*="Supprimer"]')
        if (await removeButton.isVisible()) {
          await removeButton.click()

          // Confirmer la suppression si nécessaire
          const confirmButton = page.locator('text=Confirmer')
          if (await confirmButton.isVisible()) {
            await confirmButton.click()
          }

          await page.waitForTimeout(1000)

          // Vérifier que l'article a été supprimé
          const remainingItems = await page.locator('[data-testid="cart-item"]').count()
          expect(remainingItems).toBe(itemCount - 1)
        }
      }
    })
  })

  test.describe('User Authentication', () => {
    test('should handle user registration and login flow', async () => {
      await page.goto('/account')

      // Si pas connecté, devrait afficher le formulaire de connexion
      const loginForm = page.locator('form')
      await expect(loginForm).toBeVisible()

      // Tester le passage au formulaire d'inscription
      const registerLink = page.locator('text=Créer un compte')
      if (await registerLink.isVisible()) {
        await registerLink.click()

        // Remplir le formulaire d'inscription
        await page.fill('input[name="firstName"]', 'Test')
        await page.fill('input[name="lastName"]', 'User')
        await page.fill('input[name="email"]', `test-${Date.now()}@terra.com`)
        await page.fill('input[name="password"]', 'TestPassword123!')

        // Soumettre le formulaire
        await page.click('button[type="submit"]')

        // Attendre la redirection ou le message de succès
        await page.waitForTimeout(2000)

        // Vérifier qu'on est connecté ou qu'il y a un message de confirmation
        const successMessage = page.locator('text=compte créé')
        const accountPage = page.locator('text=Mon compte')

        const isSuccess = await successMessage.isVisible()
        const isLoggedIn = await accountPage.isVisible()

        expect(isSuccess || isLoggedIn).toBeTruthy()
      }
    })
  })

  test.describe('Checkout Process', () => {
    test('should proceed through checkout flow', async () => {
      // D'abord ajouter un produit au panier
      await page.goto('/products')
      await page.waitForSelector('[data-testid="product-card"]')

      const firstProduct = page.locator('[data-testid="product-card"]').first()
      await firstProduct.click()

      const sizeButton = page.locator('[data-testid="size-selector"] button').first()
      if (await sizeButton.isVisible()) {
        await sizeButton.click()

        const addToCartButton = page.locator('text=Ajouter au panier')
        if (await addToCartButton.isVisible()) {
          await addToCartButton.click()
          await page.waitForTimeout(1000)
        }
      }

      // Aller au checkout
      await page.goto('/checkout')

      // Vérifier les éléments du checkout
      await expect(page.locator('h1')).toContainText('Finaliser votre commande')

      // Vérifier le récapitulatif de commande
      await expect(page.locator('[data-testid="order-summary"]')).toBeVisible()

      // Remplir les informations de livraison si nécessaire
      const shippingForm = page.locator('[data-testid="shipping-form"]')
      if (await shippingForm.isVisible()) {
        await page.fill('input[name="firstName"]', 'Test')
        await page.fill('input[name="lastName"]', 'User')
        await page.fill('input[name="email"]', 'test@terra.com')
        await page.fill('input[name="address"]', '123 Rue de la Paix')
        await page.fill('input[name="city"]', 'Paris')
        await page.fill('input[name="postalCode"]', '75001')
      }

      // Note: On ne teste pas le paiement réel pour éviter les frais
      // Mais on peut vérifier que le formulaire de paiement est présent
      const paymentSection = page.locator('[data-testid="payment-section"]')
      if (await paymentSection.isVisible()) {
        await expect(paymentSection).toContainText('Paiement')
      }
    })
  })

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async () => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      // Vérifier que la navigation mobile fonctionne
      const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]')
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click()
        await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
      }

      // Vérifier que les éléments sont bien adaptés
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('h1')).toHaveCSS('font-size', /\d+px/)
    })

    test('should work on tablet viewport', async () => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/products')

      // Vérifier l'affichage des produits sur tablette
      await page.waitForSelector('[data-testid="product-card"]')
      const productCards = await page.locator('[data-testid="product-card"]').count()
      expect(productCards).toBeGreaterThan(0)
    })
  })

  test.describe('Performance and Accessibility', () => {
    test('should load pages within reasonable time', async () => {
      const startTime = Date.now()
      await page.goto('/')
      const loadTime = Date.now() - startTime

      // La page devrait se charger en moins de 3 secondes
      expect(loadTime).toBeLessThan(3000)
    })

    test('should have proper heading hierarchy', async () => {
      await page.goto('/')

      // Vérifier qu'il y a un seul H1
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBe(1)

      // Vérifier la présence d'autres niveaux de titre
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').count()
      expect(headings).toBeGreaterThan(1)
    })

    test('should have proper alt text for images', async () => {
      await page.goto('/products')
      await page.waitForSelector('img')

      const images = await page.locator('img').all()
      for (const image of images) {
        const alt = await image.getAttribute('alt')
        expect(alt).toBeTruthy()
        expect(alt?.length).toBeGreaterThan(0)
      }
    })
  })
})

