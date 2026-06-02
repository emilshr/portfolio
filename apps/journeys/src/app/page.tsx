import type { Metadata } from 'next'

import { HeroSection } from '@/components/home/HeroSection'
import { RenderHomeBlocks } from '@/components/home/RenderHomeBlocks'
import { journeysHomeMetadata } from '@/lib/metadata'
import { getJourneysSettings } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getJourneysSettings()
  return journeysHomeMetadata(settings)
}

export default async function HomePage() {
  const settings = await getJourneysSettings()

  return (
    <>
      <HeroSection settings={settings} />
      <RenderHomeBlocks blocks={settings.homeLayout} />
    </>
  )
}
