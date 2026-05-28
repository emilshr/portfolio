import type { Metadata } from 'next'

import { TravelGrid } from '@/components/home/TravelGrid'
import { buildPageMetadata } from '@/lib/metadata'
import { getPublishedTravels } from '@/lib/payload'

export const metadata: Metadata = buildPageMetadata({
  title: 'Posts',
  description: 'All travel stories from Journeys.',
  path: '/posts',
})

export default async function PostsPage() {
  const travels = await getPublishedTravels()

  return (
    <div className="pt-[var(--space-8)]">
      <div className="container-content mb-[var(--space-8)]">
        <h1 className="text-display text-3xl font-bold md:text-4xl">Posts</h1>
        <p className="mt-[var(--space-3)] max-w-2xl text-muted-foreground">
          Every journey, captured in words and photographs.
        </p>
      </div>
      <TravelGrid travels={travels} title="All journeys" />
    </div>
  )
}
