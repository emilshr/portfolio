import type { FeaturedTravelsBlock } from '@repo/payload-types'

import { TravelGrid } from '@/components/home/TravelGrid'
import { getFeaturedTravels } from '@/lib/payload'

type FeaturedTravelsSectionProps = {
  block: FeaturedTravelsBlock
}

export async function FeaturedTravelsSection({ block }: FeaturedTravelsSectionProps) {
  const limit = block.limit ?? 6
  const travels = await getFeaturedTravels(limit)

  if (travels.length === 0) return null

  return (
    <TravelGrid
      travels={travels}
      title={block.heading ?? 'Featured journeys'}
    />
  )
}
