import type { FeaturedTravelsBlock } from '@repo/payload-types'

import { TravelGrid } from '@/components/home/TravelGrid'
import { getFeaturedArticles } from '@/lib/payload'

type FeaturedTravelsSectionProps = {
  block: FeaturedTravelsBlock
}

export async function FeaturedTravelsSection({ block }: FeaturedTravelsSectionProps) {
  const limit = typeof block.limit === 'number' ? block.limit : 6
  const articles = await getFeaturedArticles(limit)

  if (articles.length === 0) return null

  return (
    <TravelGrid
      articles={articles}
      title={block.heading ?? 'Featured journeys'}
      description={block.description}
      showViewAllLink
    />
  )
}
