import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/next'
import dynamic from 'next/dynamic'
import { cookies, headers } from 'next/headers'
import Script from 'next/script'
import { getPayload } from 'payload'

import configPromise from '@payload-config'
import { isChiriTheme } from '@/lib/chiri-theme'
import type { SiteSettingsData } from '@/utilities/getSiteSettings'
import { Footer } from './Footer'
import { SiteTopFlickeringGrid } from './SiteTopFlickeringGrid'
import { ThemeManager } from './ThemeManager'
import { ThemeProvider } from './ThemeProvider'

const AdminBar = dynamic(() =>
  import('@/components/AdminBar').then((mod) => mod.AdminBar),
)

type Props = {
  children: ReactNode
  settings: SiteSettingsData
  preview?: boolean
}

export async function ChiriLayout({ children, settings, preview }: Props) {
  const widthValue = Math.min(parseFloat(settings.general.contentWidth || '35'), 50)
  const shouldUseCustomWidth = widthValue > 25
  const finalWidth = shouldUseCustomWidth ? `${widthValue}rem` : '25rem'
  const cookieStore = await cookies()
  const cookieTheme = cookieStore.get('chiri-theme')?.value
  const initialTheme = isChiriTheme(cookieTheme) ? cookieTheme : undefined
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID_PORTFOLIO
  const hasUmami = Boolean(umamiSrc && umamiWebsiteId)

  let showAdminBar = Boolean(preview)
  if (!showAdminBar && cookieStore.get('payload-token')?.value) {
    try {
      const payload = await getPayload({ config: configPromise })
      const { user } = await payload.auth({ headers: await headers() })
      showAdminBar = Boolean(user)
    } catch {
      showAdminBar = false
    }
  }

  return (
    <html
      lang={settings.site.language || 'en-US'}
      className={initialTheme}
      suppressHydrationWarning
    >
      {/* oxlint-disable-next-line next/no-head-element -- App Router root layouts use native head */}
      <head>
        <ThemeManager />
        {hasUmami && (
          <Script src={umamiSrc} data-website-id={umamiWebsiteId} strategy="afterInteractive" />
        )}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="preload"
          href="/fonts/Inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Besley-Italic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className="relative"
        data-centered={settings.general.centeredLayout ? 'true' : 'false'}
        style={{
          maxWidth: finalWidth,
          ...(shouldUseCustomWidth ? { ['--content-width' as string]: `${widthValue}rem` } : {}),
        }}
      >
        <ThemeProvider initialTheme={initialTheme}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-(--bg-primary) focus:px-4 focus:py-2"
          >
            Skip to content
          </a>
          <SiteTopFlickeringGrid />
          {showAdminBar ? <AdminBar adminBarProps={{ preview: preview ?? false }} /> : null}
          <div className="page-content layout-wrapper relative z-10">
            <main id="main-content">{children}</main>
            <Footer settings={settings} />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
