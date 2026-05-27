import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Journeys',
  description: 'Travel blog by Emil',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID_JOURNEYS
  const hasUmami = Boolean(umamiSrc && umamiWebsiteId)

  return (
    <html lang="en">
      <head>
        {hasUmami && (
          <Script
            src={umamiSrc}
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}
