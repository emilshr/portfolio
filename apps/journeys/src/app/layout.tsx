import type { Metadata } from 'next'
import { IBM_Plex_Mono, Montserrat, Open_Sans } from 'next/font/google'
import type { ReactNode } from 'react'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { Providers } from '@/components/providers'
import { getSiteURL } from '@/lib/metadata'

import '@/styles/globals.css'

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteURL()),
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID_JOURNEYS
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${openSans.variable} ${montserrat.variable} ${ibmPlexMono.variable} min-h-screen antialiased`}
      >
        <Providers>
          <SiteHeader />
          <main className="pt-16">{children}</main>
        </Providers>
        {umamiWebsiteId && umamiSrc ? (
          <script async defer src={umamiSrc} data-website-id={umamiWebsiteId} />
        ) : null}
      </body>
    </html>
  )
}
