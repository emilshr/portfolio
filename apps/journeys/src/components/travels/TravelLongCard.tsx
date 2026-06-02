import type { Travel } from '@repo/payload-types'
import Link from 'next/link'

import { PayloadImage } from '@/components/media/PayloadImage'
import { formatLocation, formatTripDates } from '@/lib/media'

type TravelLongCardProps = {
  travel: Travel
}

export function TravelLongCard({ travel }: TravelLongCardProps) {
  const location = formatLocation(travel.location)
  const dates = formatTripDates(travel.tripDates)
  const image = travel.coverImage || travel.heroImage

  return (
    <article className="group grid grid-cols-1 gap-[var(--space-5)] sm:grid-cols-[minmax(15rem,22rem)_1fr] sm:items-start">
      <Link
        href={`/${travel.slug}`}
        className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {image ? (
          <PayloadImage
            media={image}
            size="card"
            fill
            sizes="(max-width: 640px) 100vw, 30vw"
            className="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
        )}
      </Link>
      <div className="flex flex-col gap-[var(--space-3)]">
        {(location || dates) && (
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {[location, dates].filter(Boolean).join(' · ')}
          </p>
        )}
        <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          <Link
            href={`/${travel.slug}`}
            className="rounded-sm underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {travel.title}
          </Link>
        </h2>
        {travel.subtitle ? (
          <p className="text-sm uppercase tracking-wide text-muted-foreground">{travel.subtitle}</p>
        ) : null}
        {travel.excerpt ? (
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {travel.excerpt}
          </p>
        ) : null}
      </div>
    </article>
  )
}
