import type { Article, Tag } from '@repo/payload-types'
import Link from 'next/link'

import { PayloadImage } from '@/components/media/PayloadImage'
import { formatLocation, formatTripDates } from '@/lib/media'

type ArticleLongCardProps = {
  article: Article
}

function getTagLabel(tag: string | Tag): string | null {
  if (typeof tag === 'object' && tag?.name) return tag.name
  return null
}

export function ArticleLongCard({ article }: ArticleLongCardProps) {
  const location = formatLocation(article.location)
  const dates = formatTripDates(article.tripDates)
  const image = article.coverImage || article.heroImage
  const tagLabels = (article.tags ?? [])
    .map(getTagLabel)
    .filter((label): label is string => Boolean(label))
  const metaLabel = [location, dates].filter(Boolean).join(' · ') || tagLabels.join(' · ')

  return (
    <article className="group grid grid-cols-1 gap-5 sm:grid-cols-[minmax(15rem,22rem)_1fr] sm:items-start">
      <Link
        href={`/articles/${article.slug}`}
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
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </Link>
      <div className="flex flex-col gap-3">
        {metaLabel ? (
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{metaLabel}</p>
        ) : null}
        <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          <Link
            href={`/articles/${article.slug}`}
            className="rounded-sm underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {article.title}
          </Link>
        </h2>
        {article.subtitle ? (
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            {article.subtitle}
          </p>
        ) : null}
        {article.excerpt ? (
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {article.excerpt}
          </p>
        ) : null}
      </div>
    </article>
  )
}
