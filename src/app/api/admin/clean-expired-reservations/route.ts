import { NextRequest, NextResponse } from 'next/server'
import { cleanExpiredReservations } from '@/utilities/stockReservation'

/**
 * API pour nettoyer les réservations de stock expirées
 * À appeler périodiquement (par exemple avec un cron job)
 */
export async function POST(request: NextRequest) {
  try {
    // Vérification basique d'authentification (optionnel)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.ADMIN_API_TOKEN

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    console.log('🧹 Nettoyage des réservations expirées...')
    await cleanExpiredReservations()

    return NextResponse.json({
      success: true,
      message: 'Réservations expirées nettoyées',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Erreur nettoyage réservations:', error)
    return NextResponse.json(
      { error: 'Erreur lors du nettoyage des réservations' },
      { status: 500 },
    )
  }
}

/**
 * GET pour vérifier le statut des réservations
 */
export async function GET(request: NextRequest) {
  try {
    // Récupérer les stats des réservations actuelles
    global.stockReservations = global.stockReservations || new Map()

    const stats = {
      totalProducts: global.stockReservations.size,
      totalReservations: Array.from(global.stockReservations.values()).reduce(
        (sum, reservations) => sum + reservations.length,
        0,
      ),
      reservationsByProduct: Object.fromEntries(
        Array.from(global.stockReservations.entries()).map(([productId, reservations]) => [
          productId,
          {
            count: reservations.length,
            totalQuantity: reservations.reduce((sum, r) => sum + r.quantity, 0),
            oldestReservation:
              reservations.length > 0
                ? Math.min(...reservations.map((r) => r.reservedAt.getTime()))
                : null,
          },
        ]),
      ),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erreur récupération stats réservations:', error)
    return NextResponse.json({ error: 'Erreur lors de la récupération des stats' }, { status: 500 })
  }
}
