import { NextRequest, NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await req.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, mot de passe, prénom et nom requis' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Vérifier si l'utilisateur existe déjà
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (existingUsers.docs.length > 0) {
      return NextResponse.json({ error: 'Un compte avec cet email existe déjà' }, { status: 409 })
    }

    // Créer le nouvel utilisateur
    const newUser = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        firstName,
        lastName,
        phone: phone || '',
        preferences: {
          newsletter: true,
          smsNotifications: false,
          emailNotifications: true,
          language: 'fr',
          currency: 'EUR',
        },
      },
    })

    // Connecter automatiquement l'utilisateur après inscription
    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    if (loginResult.token && loginResult.user) {
      const response = NextResponse.json({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phone: newUser.phone,
          preferences: newUser.preferences,
          createdAt: newUser.createdAt,
        },
        token: loginResult.token,
      })

      // Définir le cookie d'authentification
      response.cookies.set('payload-token', loginResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7200, // 2 heures
        path: '/',
      })

      return response
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        preferences: newUser.preferences,
        createdAt: newUser.createdAt,
      },
    })
  } catch (error) {
    console.error("Erreur d'inscription:", error)
    return NextResponse.json({ error: 'Erreur lors de la création du compte' }, { status: 500 })
  }
}
