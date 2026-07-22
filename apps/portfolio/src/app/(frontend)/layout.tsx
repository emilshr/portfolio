import '@/styles/global.css'

import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'

import { Providers } from '@/app/(frontend)/providers'
import { ChiriLayout } from '@/components/chiri/ChiriLayout'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { getServerSideURL } from '@/utilities/getURL'

const LivePreviewListener = dynamic(() =>
  import('@/components/LivePreviewListener').then((mod) => mod.LivePreviewListener),
)

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
  const [{ isEnabled }, settings] = await Promise.all([draftMode(), getSiteSettings()])

  return (
    <ChiriLayout settings={settings} preview={isEnabled}>
      <Providers>
        {isEnabled ? <LivePreviewListener /> : null}
        {children}
      </Providers>
    </ChiriLayout>
  )
}
