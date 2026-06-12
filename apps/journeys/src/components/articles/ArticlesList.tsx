import type { Article } from '@repo/payload-types'

import { ArticleLongCard } from '@/components/articles/ArticleLongCard'
import { getArticleYear, getArticleSortTimestamp, getPublishedArticles } from '@/lib/payload'

type ArticleGroup = {
  year: string
  articles: Article[]
}

function groupArticlesByYear(articles: Article[]): ArticleGroup[] {
  const sorted = [...articles].sort(
    (a, b) => getArticleSortTimestamp(b) - getArticleSortTimestamp(a),
  )
  const groups = new Map<string, Article[]>()

  for (const article of sorted) {
    const year = getArticleYear(article)
    const existing = groups.get(year) ?? []
    existing.push(article)
    groups.set(year, existing)
  }

  return Array.from(groups.entries()).map(([year, groupArticles]) => ({
    year,
    articles: groupArticles,
  }))
}

export async function ArticlesList() {
  const articles = await getPublishedArticles(100)
  const groups = groupArticlesByYear(articles)

  return (
    <div className="page-container flex flex-col gap-14">
      {groups.map((group, index) => (
        <section key={group.year} className="space-y-8">
          {index > 0 ? <hr className="border-border/60" aria-hidden /> : null}
          <h2 className="pt-6 font-display text-2xl font-semibold tracking-tight md:text-3xl">
            {group.year}
          </h2>
          <div className="space-y-8">
            {group.articles.map((article) => (
              <ArticleLongCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export function ArticlesListFallback() {
  return (
    <div className="page-container flex flex-col gap-14" aria-hidden>
      {Array.from({ length: 2 }).map((_, groupIndex) => (
        <section key={groupIndex} className="space-y-8">
          <div className="h-8 w-16 animate-pulse rounded bg-muted" />
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((__, articleIndex) => (
              <div key={articleIndex} className="h-32 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
