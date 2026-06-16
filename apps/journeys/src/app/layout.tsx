import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { Outfit, Unbounded } from 'next/font/google'
import Script from 'next/script'
import { Suspense, type ReactNode } from 'react'

import { LivePreviewListener } from '@/components/LivePreviewListener'
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

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { isEnabled: draft } = await draftMode()
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID_JOURNEYS
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${unbounded.variable} ${outfit.variable} min-h-screen antialiased`}>
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:shadow"
          >
            Skip to content
          </a>
          <Suspense fallback={<SiteHeader menuItems={[]} />}>
            <SiteHeaderLoader />
          </Suspense>
          <Main id="main-content">{children}</Main>
          <SiteFooter />
        </Providers>
        {draft ? <LivePreviewListener /> : null}
        {umamiWebsiteId && umamiSrc ? (
          <Script src={umamiSrc} data-website-id={umamiWebsiteId} strategy="afterInteractive" />
        ) : null}
      </body>
    </html>
  )
}
