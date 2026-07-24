'use client'

import { Info } from 'lucide-react'
import Link from 'next/link'
import { useId, useState } from 'react'

import type { GalleryRelatedArticle } from '@/lib/payload'
import { cn } from '@/lib/utils'

type GalleryArticleHintProps = {
  article: GalleryRelatedArticle
}

export function GalleryArticleHint({ article }: GalleryArticleHintProps) {
  const [expanded, setExpanded] = useState(false)
  const panelId = useId()

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        aria-label={expanded ? 'Hide article hint' : 'Show related article'}
        onClick={() => setExpanded((open) => !open)}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white shadow-sm backdrop-blur-sm',
          'transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
        )}
      >
        <Info className="h-4 w-4" aria-hidden="true" />
      </button>

      {expanded ? (
        <div
          id={panelId}
          role="region"
          aria-label="Related article"
          className="absolute bottom-11 left-0 w-[min(18rem,calc(100vw-3rem))] rounded-lg border border-white/15 bg-black/75 p-3 text-left shadow-lg backdrop-blur-md"
        >
          <p className="text-[11px] font-medium uppercase tracking-wide text-white/55">
            From this article
          </p>
          <p className="mt-1 truncate text-sm font-medium text-white">{article.title}</p>
          <Link
            href={`/articles/${article.slug}`}
            className="mt-2 inline-flex text-sm text-white/85 underline-offset-2 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            View article →
          </Link>
        </div>
      ) : null}
    </div>
  )
}
