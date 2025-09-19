import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Récupérer le token depuis les cookies
    const token = req.cookies.get('payload-token')?.value

    if (token) {
      // Déconnecter l'utilisateur côté Payload
      await payload.logout({
        collection: 'users',
        token,
      })
    }

    // Créer la réponse et supprimer le cookie
    const response = NextResponse.json({ success: true })

    response.cookies.set('payload-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Erreur de déconnexion:', error)
    return NextResponse.json({ error: 'Erreur de déconnexion' }, { status: 500 })
  }
}
