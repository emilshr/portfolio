import type { Travel } from '@repo/payload-types'
import Link from 'next/link'

import { PayloadImage } from '@/components/media/PayloadImage'
import { HeroMediaPreviewTrigger } from '@/components/travels/HeroMediaPreviewTrigger'
import { TravelDetailGallery } from '@/components/travels/TravelDetailGallery'
import { TravelRichText } from '@/components/travels/TravelRichText'
import { formatLocation, formatTripDates, getMediaAlt, getMediaUrl, isMedia } from '@/lib/media'

type TravelDetailProps = {
  travel: Travel
}

export function TravelDetail({ travel }: TravelDetailProps) {
  const location = formatLocation(travel.location)
  const dates = formatTripDates(travel.tripDates)
  const hero = travel.heroImage || travel.coverImage
  const heroPreviewUrl = isMedia(hero) ? getMediaUrl(hero, 'large') : null
  const heroPreviewAlt = isMedia(hero) ? getMediaAlt(hero, travel.title) : travel.title

  return (
    <article>
      <div id="hero-cover-sentinel" className="h-0 w-full" aria-hidden />
      <section className="relative min-h-[min(70vh,720px)] w-full overflow-hidden">
        {hero ? (
          <>
            <PayloadImage media={hero} size="hero" fill priority sizes="100vw" className="absolute inset-0" />
            {heroPreviewUrl ? <HeroMediaPreviewTrigger url={heroPreviewUrl} alt={heroPreviewAlt} /> : null}
            <div className="pointer-events-none absolute inset-0" style={{ background: 'var(--hero-scrim)' }} aria-hidden />
          </>
        ) : (
          <div className="absolute inset-0 bg-muted" aria-hidden />
        )}
        <div className="relative z-10 flex min-h-[min(70vh,720px)] flex-col justify-end pb-[var(--space-12)] pt-28">
          <div className="mx-auto w-full max-w-6xl px-[clamp(1.5rem,5vw,4rem)]">
            {(location || dates) && (
              <p className="mb-[var(--space-3)] text-sm uppercase tracking-wider text-white/70">
                {[location, dates].filter(Boolean).join(' · ')}
              </p>
            )}
            <h1 className="max-w-4xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {travel.title}
            </h1>
            {travel.subtitle ? (
              <p className="mt-[var(--space-4)] max-w-2xl text-lg text-white/60 sm:text-xl">{travel.subtitle}</p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-[clamp(1.5rem,5vw,4rem)] py-[var(--space-12)] md:py-[var(--space-16)]">
        <div className="mx-auto max-w-3xl">
          <TravelRichText data={travel.content} />
        </div>

        {travel.gallery && travel.gallery.length > 0 ? (
          <section className="mt-[var(--space-16)]" aria-labelledby="travel-gallery-heading">
            <h2
              id="travel-gallery-heading"
              className="mb-[var(--space-8)] font-display text-2xl font-semibold tracking-tight"
            >
              Gallery
            </h2>
            <TravelDetailGallery travelTitle={travel.title} items={travel.gallery} />
            <p className="mt-[var(--space-6)]">
              <Link href="/gallery" className="text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                View full gallery →
              </Link>
            </p>
          </section>
        ) : null}
      </div>
    </article>
  )
}
