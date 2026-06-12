import type { Article, Tag } from '@repo/payload-types'
import Link from 'next/link'

import { PayloadImage } from '@/components/media/PayloadImage'
import { HeroMediaPreviewTrigger } from '@/components/travels/HeroMediaPreviewTrigger'
import { TravelDetailGallery } from '@/components/travels/TravelDetailGallery'
import { TravelRichText } from '@/components/travels/TravelRichText'
import { formatLocation, formatTripDates, getMediaAlt, getMediaUrl, isMedia } from '@/lib/media'

type ArticleDetailProps = {
  article: Article
}

function getTagLabel(tag: string | Tag): string | null {
  if (typeof tag === 'object' && tag?.name) return tag.name
  return null
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  const location = formatLocation(article.location)
  const dates = formatTripDates(article.tripDates)
  const hero = article.heroImage || article.coverImage
  const heroPreviewUrl = isMedia(hero) ? getMediaUrl(hero, 'large') : null
  const heroPreviewAlt = isMedia(hero) ? getMediaAlt(hero, article.title) : article.title
  const tagLabels = (article.tags ?? [])
    .map(getTagLabel)
    .filter((label): label is string => Boolean(label))
  const heroMeta = [location, dates].filter(Boolean).join(' · ') || tagLabels.join(' · ')

  return (
    <article>
      <div id="hero-cover-sentinel" className="h-0 w-full" aria-hidden />
      <section className="relative min-h-[min(70vh,720px)] w-full overflow-hidden">
        {hero ? (
          <>
            <PayloadImage
              media={hero}
              size="hero"
              fill
              priority
              sizes="100vw"
              className="absolute inset-0"
            />
            {heroPreviewUrl ? (
              <HeroMediaPreviewTrigger url={heroPreviewUrl} alt={heroPreviewAlt} />
            ) : null}
            <div className="pointer-events-none absolute inset-0 bg-hero-scrim" aria-hidden />
          </>
        ) : (
          <div className="absolute inset-0 bg-muted" aria-hidden />
        )}
        <div className="relative z-10 flex min-h-[min(70vh,720px)] flex-col justify-end pb-12 pt-28">
          <div className="page-container">
            {heroMeta ? (
              <p className="mb-3 text-sm uppercase tracking-wider text-white/70">{heroMeta}</p>
            ) : null}
            <h1 className="max-w-4xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {article.title}
            </h1>
            {article.subtitle ? (
              <p className="mt-4 max-w-2xl text-lg text-white/60 sm:text-xl">{article.subtitle}</p>
            ) : article.excerpt ? (
              <p className="mt-4 max-w-2xl text-lg text-white/60 sm:text-xl">{article.excerpt}</p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="page-container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <TravelRichText data={article.content} />
        </div>

        {article.gallery && article.gallery.length > 0 ? (
          <section className="mt-16" aria-labelledby="article-gallery-heading">
            <h2
              id="article-gallery-heading"
              className="mb-8 font-display text-2xl font-semibold tracking-tight"
            >
              Gallery
            </h2>
            <TravelDetailGallery travelTitle={article.title} items={article.gallery} />
            <p className="mt-6">
              <Link
                href="/gallery"
                className="rounded-sm text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                View full gallery →
              </Link>
            </p>
          </section>
        ) : null}
      </div>
    </article>
  )
}
