import type { Travel } from '@repo/payload-types'

import { HeaderNavHighlightLink } from '@/components/layout/HeaderNavHighlight'
import { TravelCard } from '@/components/travels/TravelCard'

type TravelGridProps = {
  travels: Travel[]
  title?: string
  description?: string | null
  showViewAllLink?: boolean
}

export function TravelGrid({
  travels,
  title = 'Latest journeys',
  description,
  showViewAllLink = false,
}: TravelGridProps) {
  if (travels.length === 0) {
    return null
  }

  return (
    <section className="page-container py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {showViewAllLink ? (
          <HeaderNavHighlightLink
            href="/posts"
            heroOverlay={false}
            className="text-sm font-medium tracking-wide text-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            View all journeys
          </HeaderNavHighlightLink>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {travels.map((travel) => (
          <TravelCard key={travel.id} travel={travel} />
        ))}
      </div>
    </section>
  )
}
