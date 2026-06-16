import '@/styles/global.css'

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'

import { Providers } from '@/app/(frontend)/providers'
import { ChiriLayout } from '@/components/chiri/ChiriLayout'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { getServerSideURL } from '@/utilities/getURL'

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const settings = await getSiteSettings()

  return (
    <ChiriLayout settings={settings} preview={isEnabled}>
      <Providers>
        {isEnabled && <LivePreviewListener />}
        {children}
      </Providers>
    </ChiriLayout>
  )
}
