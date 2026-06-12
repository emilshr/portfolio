import type { Article } from '@repo/payload-types'

import { HeaderNavHighlightLink } from '@/components/layout/HeaderNavHighlight'
import { PayloadImage } from '@/components/media/PayloadImage'
import { formatLocation, formatTripDates } from '@/lib/media'
import { cn } from '@/lib/utils'

type ArticleCardProps = {
  article: Article
  className?: string
}

export function ArticleCard({ article, className }: ArticleCardProps) {
  const location = formatLocation(article.location)
  const dates = formatTripDates(article.tripDates)
  const image = article.coverImage || article.heroImage

  return (
    <article className={cn('group flex flex-col gap-4', className)}>
      <HeaderNavHighlightLink
        href={`/articles/${article.slug}`}
        heroOverlay={false}
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
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </HeaderNavHighlightLink>
      <div className="flex flex-col gap-2">
        {(location || dates) && (
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {[location, dates].filter(Boolean).join(' · ')}
          </p>
        )}
        <h2 className="font-display text-xl font-semibold tracking-tight">
          <HeaderNavHighlightLink
            href={`/articles/${article.slug}`}
            heroOverlay={false}
            className="rounded-sm text-inherit transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {article.title}
          </HeaderNavHighlightLink>
        </h2>
        {article.excerpt ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        ) : null}
      </div>
    </article>
  )
}
