import type { ReactNode } from 'react'
import { cookies } from 'next/headers'

import { AdminBar } from '@/components/AdminBar'
import { isChiriTheme } from '@/lib/chiri-theme'
import type { SiteSettingsData } from '@/utilities/getSiteSettings'
import { Footer } from './Footer'
import { Header } from './Header'
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

  return (
    <html
      lang={settings.site.language || 'en-US'}
      className={initialTheme}
      suppressHydrationWarning
    >
      <head>
        <ThemeManager />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
          <SiteTopFlickeringGrid />
          <AdminBar adminBarProps={{ preview: preview ?? false }} />
          <div className="page-content layout-wrapper relative z-10">
            <Header settings={settings} />
            <main>{children}</main>
            <Footer settings={settings} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
