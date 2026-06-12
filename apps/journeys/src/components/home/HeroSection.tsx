import type { Article, JourneysSetting, Media } from '@repo/payload-types'

import { ParallaxHeroCover } from '@/components/home/ParallaxHeroCover'
import { isMedia } from '@/lib/media'

type HeroSettings = Pick<
  JourneysSetting,
  'heroImage' | 'heroTitle' | 'heroSubtitle' | 'featuredArticle'
>

type HeroSectionProps = {
  settings: HeroSettings
}

function resolveHeroMedia(settings: HeroSettings): Media | null {
  if (isMedia(settings.heroImage)) {
    return settings.heroImage
  }

  const featured = settings.featuredArticle
  if (featured && typeof featured === 'object') {
    const article = featured as Article
    if (isMedia(article.heroImage)) return article.heroImage
    if (isMedia(article.coverImage)) return article.coverImage
  }

  return null
}

export function HeroSection({ settings }: HeroSectionProps) {
  const heroMedia = resolveHeroMedia(settings)

  return (
    <section className="w-full">
      <ParallaxHeroCover media={heroMedia} />
      <div id="hero-cover-sentinel" className="h-0 w-full" aria-hidden />
      <div className="w-full py-10 text-center md:py-16">
        <h1 className="w-full font-display text-4xl font-bold uppercase leading-[0.95] tracking-[-0.03em] text-foreground sm:text-7xl">
          {settings.heroTitle || 'BurntClutchProject'}
        </h1>
        {settings.heroSubtitle ? (
          <p className="mt-4 w-full text-center text-lg text-muted-foreground sm:text-xl">
            {settings.heroSubtitle}
          </p>
        ) : null}
      </div>
    </section>
  )
}
