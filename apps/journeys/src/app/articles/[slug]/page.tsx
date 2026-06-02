import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArticleDetail } from '@/components/articles/ArticleDetail'
import { articleMetadata } from '@/lib/metadata'
import { getArticleBySlug, getPublishedArticles } from '@/lib/payload'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const articles = await getPublishedArticles()
    return articles.map((article) => ({ slug: article.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  return articleMetadata(article)
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return <ArticleDetail article={article} />
}
