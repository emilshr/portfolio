import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { cookies } from 'next/headers'
import Script from 'next/script'

import { AdminBar } from '@/components/AdminBar'
import { isChiriTheme } from '@/lib/chiri-theme'
import type { SiteSettingsData } from '@/utilities/getSiteSettings'
import { Footer } from './Footer'
import { SiteTopFlickeringGrid } from './SiteTopFlickeringGrid'
import { ThemeManager } from './ThemeManager'
import { ThemeProvider } from './ThemeProvider'

type Props = {
  children: ReactNode
  settings: SiteSettingsData
  preview?: boolean
}

export async function ChiriLayout({ children, settings, preview }: Props) {
  const widthValue = Math.min(parseFloat(settings.general.contentWidth || '35'), 50)
  const shouldUseCustomWidth = widthValue > 25
  const finalWidth = shouldUseCustomWidth ? `${widthValue}rem` : '25rem'
  const cookieTheme = (await cookies()).get('chiri-theme')?.value
  const initialTheme = isChiriTheme(cookieTheme) ? cookieTheme : undefined
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID_PORTFOLIO
  const hasUmami = Boolean(umamiSrc && umamiWebsiteId)

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
          <AdminBar adminBarProps={{ preview: preview ?? false }} />
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
