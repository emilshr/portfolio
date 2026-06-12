import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ArticlesList, ArticlesListFallback } from '@/components/articles/ArticlesList'
import { buildPageMetadata, formatPageTitle } from '@/lib/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: formatPageTitle('Articles'),
  description: 'Travel stories, motorcycle notes, and road dispatches.',
  path: '/articles',
})

export default function ArticlesPage() {
  return (
    <div className="pt-8 pb-16">
      <div className="page-container mb-12">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Articles</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Every journey and motorcycle story, captured in words and photographs.
        </p>
      </div>

      <Suspense fallback={<ArticlesListFallback />}>
        <ArticlesList />
      </Suspense>
    </div>
  )
}
