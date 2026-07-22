import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { ArticleDetail } from '@/components/articles/ArticleDetail'
import { articleMetadata } from '@/lib/metadata'
import { getArticleBySlug } from '@/lib/payload'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [{ slug }, { isEnabled: draft }] = await Promise.all([params, draftMode()])
  const article = await getArticleBySlug(slug, draft)
  if (!article) return {}
  return articleMetadata(article)
}

export default async function ArticlePage({ params }: PageProps) {
  const [{ slug }, { isEnabled: draft }] = await Promise.all([params, draftMode()])
  const article = await getArticleBySlug(slug, draft)

  if (!article) {
    notFound()
  }

  return <ArticleDetail article={article} />
}
