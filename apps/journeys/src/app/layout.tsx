import type { Metadata } from 'next'
import { Outfit, Unbounded } from 'next/font/google'
import type { ReactNode } from 'react'

import { Main } from '@/components/layout/Main'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { getJourneysSettings } from '@/lib/payload'
import { Providers } from '@/components/providers'
import { getSiteURL } from '@/lib/metadata'

import '@/styles/globals.css'

export const dynamic = 'force-dynamic'

const unbounded = Unbounded({
  subsets: ['latin'],
  variable: '--font-unbounded',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteURL()),
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID_JOURNEYS
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC
  const settings = await getJourneysSettings()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${unbounded.variable} ${outfit.variable} min-h-screen antialiased`}>
        <Providers>
          <SiteHeader menuItems={settings.headerMenu ?? []} />
          <Main>{children}</Main>
          <SiteFooter />
        </Providers>
        {umamiWebsiteId && umamiSrc ? (
          <script async defer src={umamiSrc} data-website-id={umamiWebsiteId} />
        ) : null}
      </body>
    </html>
  )
}
