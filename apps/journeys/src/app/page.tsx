import type { Metadata } from 'next'

import { HeroSection } from '@/components/home/HeroSection'
import { RenderHomeBlocks } from '@/components/home/RenderHomeBlocks'
import { TravelGrid } from '@/components/home/TravelGrid'
import { journeysHomeMetadata } from '@/lib/metadata'
import { getJourneysSettings, getPublishedTravels } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getJourneysSettings()
  return journeysHomeMetadata(settings)
}

export default async function HomePage() {
  const [settings, travels] = await Promise.all([getJourneysSettings(), getPublishedTravels(6)])

  return (
    <>
      <HeroSection settings={settings} />
      <RenderHomeBlocks blocks={settings.homeLayout} />
      <TravelGrid travels={travels} />
    </>
  )
}
