/**
 * Script de test pour vérifier le système de gestion de stock
 * Usage: node scripts/test-stock-management.js
 */

const { getPayload } = require('payload')
const config = require('../src/payload.config.ts').default

async function testStockManagement() {
  console.log('🧪 Test du système de gestion de stock...')

  try {
    const payload = await getPayload({ config })

    // 1. Trouver un produit avec du stock
    const products = await payload.find({
      collection: 'products',
      limit: 1,
      where: {
        'sizes.stock': {
          greater_than: 0,
        },
      },
    })

    if (products.docs.length === 0) {
      console.log('❌ Aucun produit avec stock trouvé')
      return
    }

    const product = products.docs[0]
    const sizeWithStock = product.sizes?.find((s) => s.stock > 0)

    if (!sizeWithStock) {
      console.log('❌ Aucune taille avec stock trouvé')
      return
    }

    console.log(`✅ Produit trouvé: ${product.title}`)
    console.log(`✅ Taille testée: ${sizeWithStock.size}`)
    console.log(`📦 Stock initial: ${sizeWithStock.stock}`)
    console.log(`📦 Stock réservé: ${sizeWithStock.reservedStock || 0}`)
    console.log(`📦 Stock disponible: ${sizeWithStock.availableStock || 0}`)

    // 2. Tester la réservation de stock
    const testQuantity = 1
    const originalStock = sizeWithStock.stock
    const originalReserved = sizeWithStock.reservedStock || 0

    // Simuler une réservation
    sizeWithStock.reservedStock = originalReserved + testQuantity

    await payload.update({
      collection: 'products',
      id: product.id,
      data: {
        sizes: product.sizes,
      },
    })

    console.log(`✅ Stock réservé: +${testQuantity}`)

    // 3. Vérifier la mise à jour
    const updatedProduct = await payload.findByID({
      collection: 'products',
      id: product.id,
    })

    const updatedSize = updatedProduct.sizes?.find((s) => s.size === sizeWithStock.size)
    console.log(`📦 Nouveau stock réservé: ${updatedSize?.reservedStock || 0}`)
    console.log(`📦 Nouveau stock disponible: ${updatedSize?.availableStock || 0}`)

    // 4. Créer un mouvement de stock de test
    const stockMovement = await payload.create({
      collection: 'stock-movements',
      data: {
        product: product.id,
        size: sizeWithStock.size,
        type: 'sale',
        quantity: -testQuantity,
        stockBefore: originalStock,
        stockAfter: originalStock - testQuantity,
        reason: 'Test - Vente simulée',
        reference: 'TEST-001',
        date: new Date().toISOString(),
      },
    })

    console.log(`✅ Mouvement de stock créé: ${stockMovement.id}`)

    // 5. Remettre le stock dans son état initial (cleanup)
    sizeWithStock.reservedStock = originalReserved

    await payload.update({
      collection: 'products',
      id: product.id,
      data: {
        sizes: product.sizes,
      },
    })

    console.log("✅ Stock remis à l'état initial")

    // 6. Supprimer le mouvement de test
    await payload.delete({
      collection: 'stock-movements',
      id: stockMovement.id,
    })

    console.log('✅ Mouvement de test supprimé')

    console.log('\n🎉 Test terminé avec succès !')
  } catch (error) {
    console.error('❌ Erreur lors du test:', error)
  }

  process.exit(0)
}

// Exécuter le test
testStockManagement()
