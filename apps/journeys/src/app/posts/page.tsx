import type { Metadata } from 'next'
import type { Travel } from '@repo/payload-types'

import { TravelLongCard } from '@/components/travels/TravelLongCard'
import { buildPageMetadata } from '@/lib/metadata'
import { getPublishedTravels } from '@/lib/payload'

export const metadata: Metadata = buildPageMetadata({
  title: 'Journeys',
  description: 'All travel stories from Journeys.',
  path: '/posts',
})

type JourneyGroup = {
  year: string
  travels: Travel[]
}

function getTravelSortTimestamp(travel: Travel): number {
  const source = travel.tripDates?.start ?? travel.publishedAt
  if (!source) return 0
  const timestamp = new Date(source).getTime()
  return Number.isFinite(timestamp) ? timestamp : 0
}

function getTravelYear(travel: Travel): string {
  const source = travel.tripDates?.start ?? travel.publishedAt
  if (!source) return 'Unknown'
  const year = new Date(source).getFullYear()
  return Number.isFinite(year) ? String(year) : 'Unknown'
}

function groupTravelsByYear(travels: Travel[]): JourneyGroup[] {
  const sorted = [...travels].sort((a, b) => getTravelSortTimestamp(b) - getTravelSortTimestamp(a))
  const groups = new Map<string, Travel[]>()

  for (const travel of sorted) {
    const year = getTravelYear(travel)
    const existing = groups.get(year) ?? []
    existing.push(travel)
    groups.set(year, existing)
  }

  return Array.from(groups.entries()).map(([year, groupTravels]) => ({
    year,
    travels: groupTravels,
  }))
}

export default async function PostsPage() {
  const travels = await getPublishedTravels()
  const groups = groupTravelsByYear(travels)

  return (
    <div className="pt-8 pb-16">
      <div className="page-container mb-12">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Journeys</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Every journey, captured in words and photographs.
        </p>
      </div>

      <div className="page-container flex flex-col gap-14">
        {groups.map((group, index) => (
          <section key={group.year} className="space-y-8">
            {index > 0 ? <hr className="border-border/60" aria-hidden /> : null}
            <h2 className="pt-6 font-display text-2xl font-semibold tracking-tight md:text-3xl">
              {group.year}
            </h2>
            <div className="space-y-8">
              {group.travels.map((travel) => (
                <TravelLongCard key={travel.id} travel={travel} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
