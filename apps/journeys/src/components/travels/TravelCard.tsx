import type { Travel } from '@repo/payload-types'
import Link from 'next/link'

import { PayloadImage } from '@/components/media/PayloadImage'
import { formatLocation, formatTripDates } from '@/lib/media'
import { cn } from '@/lib/utils'

type TravelCardProps = {
  travel: Travel
  className?: string
}

export function TravelCard({ travel, className }: TravelCardProps) {
  const location = formatLocation(travel.location)
  const dates = formatTripDates(travel.tripDates)
  const image = travel.coverImage || travel.heroImage

  return (
    <article className={cn('group flex flex-col gap-[var(--space-4)]', className)}>
      <Link
        href={`/${travel.slug}`}
        className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {image ? (
          <PayloadImage
            media={image}
            size="card"
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
        )}
      </Link>
      <div className="flex flex-col gap-[var(--space-2)]">
        {(location || dates) && (
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {[location, dates].filter(Boolean).join(' · ')}
          </p>
        )}
        <h2 className="font-display text-xl font-semibold tracking-tight">
          <Link
            href={`/${travel.slug}`}
            className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {travel.title}
          </Link>
        </h2>
        {travel.excerpt ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{travel.excerpt}</p>
        ) : null}
      </div>
    </article>
  )
}
