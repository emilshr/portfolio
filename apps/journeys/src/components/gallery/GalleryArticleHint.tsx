import Link from 'next/link'

import type { GalleryRelatedArticle } from '@/lib/payload'

type GalleryArticleHintProps = {
  article: GalleryRelatedArticle
}

export function GalleryArticleHint({ article }: GalleryArticleHintProps) {
  return (
    <p className="truncate text-xs text-white/55">
      <span className="font-medium uppercase tracking-wide text-white/40">From</span>
      <span className="mx-1.5 text-white/25" aria-hidden="true">
        ·
      </span>
      <Link
        href={`/articles/${article.slug}`}
        aria-label={`From article: ${article.title}`}
        className="text-white/60 underline-offset-2 transition-colors hover:text-white/85 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {article.title}
      </Link>
    </p>
  )
}
