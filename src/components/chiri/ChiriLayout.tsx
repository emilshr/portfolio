import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import type { SiteSettingsData } from '@/utilities/getSiteSettings'
import { Footer } from './Footer'
import { Header } from './Header'
import { ThemeManager } from './ThemeManager'

type Props = {
  children: ReactNode
  settings: SiteSettingsData
  preview?: boolean
}

export function ChiriLayout({ children, settings, preview }: Props) {
  const widthValue = Math.min(parseFloat(settings.general.contentWidth || '35'), 50)
  const shouldUseCustomWidth = widthValue > 25
  const finalWidth = shouldUseCustomWidth ? `${widthValue}rem` : '25rem'

  return (
    <html lang={settings.site.language || 'en-US'} suppressHydrationWarning>
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
        data-centered={settings.general.centeredLayout ? 'true' : 'false'}
        style={{
          maxWidth: finalWidth,
          ...(shouldUseCustomWidth ? { ['--content-width' as string]: `${widthValue}rem` } : {}),
        }}
      >
        <AdminBar adminBarProps={{ preview: preview ?? false }} />
        <div className="page-content layout-wrapper">
          <Header settings={settings} />
          <main>{children}</main>
          <Footer settings={settings} />
        </div>
      </body>
    </html>
  )
}
