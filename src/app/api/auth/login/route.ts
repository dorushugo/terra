import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    console.log('🔄 /api/auth/login - Tentative de connexion:', { email })

    // Tentative de connexion
    const result = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    if (result.token && result.user) {
      // Connexion réussie
      const response = NextResponse.json({
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          phone: result.user.phone,
          dateOfBirth: result.user.dateOfBirth,
          avatar: result.user.avatar,
          preferences: result.user.preferences,
          createdAt: result.user.createdAt,
        },
        token: result.token,
      })

      // Définir le cookie d'authentification
      response.cookies.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7200, // 2 heures
        path: '/',
      })

      return response
    } else {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    }
  } catch (error: any) {
    console.error('❌ /api/auth/login - Erreur de connexion:', error)
    console.error("❌ /api/auth/login - Type d'erreur:", error.name)
    console.error('❌ /api/auth/login - Message:', error.message)

    // Si c'est une erreur d'authentification, renvoyer un message spécifique
    if (error.name === 'AuthenticationError' || error.message?.includes('incorrect')) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    }

    return NextResponse.json({ error: 'Erreur de connexion' }, { status: 500 })
  }
}
