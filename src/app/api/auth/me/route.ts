import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Récupérer le token depuis les cookies
    const token = req.cookies.get('payload-token')?.value
    console.log('🔍 /api/auth/me - Token présent:', !!token)

    if (!token) {
      console.log('❌ /api/auth/me - Aucun token trouvé')
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier le token et récupérer l'utilisateur
    const { user } = await payload.auth({ headers: req.headers })
    console.log('🔍 /api/auth/me - Utilisateur depuis auth:', !!user, user?.email)

    if (!user) {
      console.log('❌ /api/auth/me - Token invalide ou expiré')
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    // Récupérer les données complètes de l'utilisateur
    const fullUser = await payload.findByID({
      collection: 'users',
      id: user.id,
    })

    // Récupérer les adresses de l'utilisateur
    const addresses = await payload.find({
      collection: 'addresses',
      where: {
        user: {
          equals: user.id,
        },
      },
    })

    // Récupérer les commandes de l'utilisateur
    const orders = await payload.find({
      collection: 'orders',
      where: {
        user: {
          equals: user.id,
        },
      },
      sort: '-createdAt',
      depth: 2,
    })

    console.log('✅ /api/auth/me - Données récupérées:', {
      userId: fullUser.id,
      email: fullUser.email,
      addressCount: addresses.docs.length,
      orderCount: orders.docs.length,
    })

    return NextResponse.json({
      user: {
        id: fullUser.id,
        email: fullUser.email,
        firstName: fullUser.firstName,
        lastName: fullUser.lastName,
        phone: fullUser.phone,
        dateOfBirth: fullUser.dateOfBirth,
        avatar: fullUser.avatar,
        preferences: fullUser.preferences,
        createdAt: fullUser.createdAt,
      },
      addresses: addresses.docs,
      orders: orders.docs,
    })
  } catch (error) {
    console.error('Erreur de récupération du profil:', error)
    return NextResponse.json({ error: 'Erreur de récupération du profil' }, { status: 500 })
  }
}
