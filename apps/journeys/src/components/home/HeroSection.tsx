import type { JourneysSetting, Media, Travel } from '@repo/payload-types'

import { ParallaxHeroCover } from '@/components/home/ParallaxHeroCover'
import { isMedia } from '@/lib/media'

type HeroSettings = Pick<
  JourneysSetting,
  'heroImage' | 'heroTitle' | 'heroSubtitle' | 'featuredTravel'
>

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

  return (
    <section className="w-full">
      <ParallaxHeroCover media={heroMedia} />
      <div id="hero-cover-sentinel" className="h-0 w-full" aria-hidden />
      <div className="w-full text-center py-(--space-10) md:py-(--space-16)">
        <h1 className="w-full font-display text-[clamp(2.75rem,11vw,8rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-foreground">
          {settings.heroTitle || 'BurntClutchProject'}
        </h1>
        {settings.heroSubtitle ? (
          <p className="mt-(--space-4) max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {settings.heroSubtitle}
          </p>
        ) : null}
      </div>
    </section>
  )
}
