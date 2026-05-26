import '@/styles/global.css'

import { draftMode } from 'next/headers'

import { ChiriLayout } from '@/components/chiri/ChiriLayout'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getSiteSettings } from '@/utilities/getSiteSettings'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const settings = await getSiteSettings()

  return (
    <ChiriLayout settings={settings} preview={isEnabled}>
      {isEnabled && <LivePreviewListener />}
      {children}
    </ChiriLayout>
  )
}
