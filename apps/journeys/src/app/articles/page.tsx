import type { Metadata } from 'next'
import type { Article } from '@repo/payload-types'

import { ArticleLongCard } from '@/components/articles/ArticleLongCard'
import { buildPageMetadata, formatPageTitle } from '@/lib/metadata'
import { getArticleYear, getArticleSortTimestamp, getPublishedArticles } from '@/lib/payload'

export const metadata: Metadata = buildPageMetadata({
  title: formatPageTitle('Articles'),
  description: 'Travel stories, motorcycle notes, and road dispatches.',
  path: '/articles',
})

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

export default async function ArticlesPage() {
  const articles = await getPublishedArticles()
  const groups = groupArticlesByYear(articles)

  return (
    <div className="pt-8 pb-16">
      <div className="page-container mb-12">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Articles</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Every journey and motorcycle story, captured in words and photographs.
        </p>
      </div>

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
    </div>
  )
}
