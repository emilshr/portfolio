import type { JourneysSetting, Media, Travel } from '@repo/payload-types'

type HeroSettings = Pick<
  JourneysSetting,
  'heroImage' | 'heroTitle' | 'heroSubtitle' | 'featuredTravel'
>

import { PayloadImage } from '@/components/media/PayloadImage'
import { getMediaUrl, isMedia } from '@/lib/media'

type HeroSectionProps = {
  settings: HeroSettings
}

function resolveHeroMedia(settings: HeroSettings): Media | null {
  if (isMedia(settings.heroImage)) {
    return settings.heroImage
  }

  const featured = settings.featuredTravel
  if (featured && typeof featured === 'object') {
    const travel = featured as Travel
    if (isMedia(travel.heroImage)) return travel.heroImage
    if (isMedia(travel.coverImage)) return travel.coverImage
  }

  return null
}

export function HeroSection({ settings }: HeroSectionProps) {
  const heroMedia = resolveHeroMedia(settings)
  const heroUrl = heroMedia ? getMediaUrl(heroMedia, 'hero') : null

  return (
    <section className="relative min-h-[min(92vh,900px)] w-full overflow-hidden">
      {heroUrl ? (
        <>
          <PayloadImage
            media={heroMedia}
            size="hero"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'var(--hero-scrim)' }}
            aria-hidden
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-muted" aria-hidden />
      )}
      <div className="relative z-10 flex min-h-[min(92vh,900px)] flex-col justify-end pb-(--space-16) pt-32">
        <div className="container-content">
          <h1 className="text-display max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            {settings.heroTitle || 'Journeys'}
          </h1>
          {settings.heroSubtitle ? (
            <p className="mt-(--space-4) max-w-2xl text-lg text-white/60 sm:text-xl">
              {settings.heroSubtitle}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
