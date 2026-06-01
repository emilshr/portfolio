import type { Travel } from '@repo/payload-types'

import { TravelCard } from '@/components/travels/TravelCard'

type TravelGridProps = {
  travels: Travel[]
  title?: string
}

export function TravelGrid({ travels, title = 'Latest journeys' }: TravelGridProps) {
  if (travels.length === 0) {
    return null
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-[clamp(1.5rem,5vw,4rem)] py-[var(--space-16)]">
      <h2 className="mb-[var(--space-10)] font-display text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-[var(--space-10)] sm:grid-cols-2 lg:grid-cols-3">
        {travels.map((travel) => (
          <TravelCard key={travel.id} travel={travel} />
        ))}
      </div>
    </section>
  )
}
