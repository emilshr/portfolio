import type { Metadata } from 'next'
import { Outfit, Unbounded } from 'next/font/google'
import Script from 'next/script'
import { Suspense, type ReactNode } from 'react'

import { Main } from '@/components/layout/Main'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteHeaderLoader } from '@/components/layout/SiteHeaderLoader'
import { Providers } from '@/components/providers'
import { getSiteURL } from '@/lib/metadata'

import '@/styles/globals.css'

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

export default function RootLayout({ children }: { children: ReactNode }) {
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID_JOURNEYS
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${unbounded.variable} ${outfit.variable} min-h-screen antialiased`}>
        <Providers>
          <Suspense fallback={<SiteHeader menuItems={[]} />}>
            <SiteHeaderLoader />
          </Suspense>
          <Main>{children}</Main>
          <SiteFooter />
        </Providers>
        {umamiWebsiteId && umamiSrc ? (
          <Script src={umamiSrc} data-website-id={umamiWebsiteId} strategy="afterInteractive" />
        ) : null}
      </body>
    </html>
  )
}
