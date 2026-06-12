import type { Article } from '@repo/payload-types'

import { ArticleCard } from '@/components/articles/ArticleCard'
import { HeaderNavHighlightLink } from '@/components/layout/HeaderNavHighlight'

type TravelGridProps = {
  articles: Article[]
  title?: string
  description?: string | null
  showViewAllLink?: boolean
}

export function TravelGrid({
  articles,
  title = 'Latest journeys',
  description,
  showViewAllLink = false,
}: TravelGridProps) {
  if (articles.length === 0) {
    return null
  }

  return (
    <section className="page-container py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {showViewAllLink ? (
          <HeaderNavHighlightLink
            href="/articles"
            heroOverlay={false}
            className="rounded-sm text-sm font-medium tracking-wide text-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            View all articles
          </HeaderNavHighlightLink>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}
