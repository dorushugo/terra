import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'
import { Toaster } from 'sonner'

import { AdminBar } from '@/components/AdminBar'
import { TerraHeader } from '@/components/terra/TerraHeader'
import { TerraFooter } from '@/components/terra/TerraFooter'
import { CookieBanner } from '@/components/terra/CookieBanner'
import { Analytics } from '@/components/terra/Analytics'
import { ProgressBar } from '@/components/ui/LoadingTransition'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/favicon-192x192.png" rel="icon" type="image/png" sizes="192x192" />
        <link href="/favicon-512x512.png" rel="icon" type="image/png" sizes="512x512" />
        <link href="/favicon-192x192.png" rel="apple-touch-icon" />
        <meta name="theme-color" content="#2d5a27" />
      </head>
      <body className="bg-neutral-50">
        <Providers>
          <ProgressBar />
          <TerraHeader />
          <main className="">{children}</main>
          <TerraFooter />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#fff',
                border: '1px solid #e5e7eb',
                color: '#111827',
              },
            }}
          />
          <CookieBanner />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
