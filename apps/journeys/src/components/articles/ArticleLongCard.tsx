import type { Article } from '@repo/payload-types'
import Link from 'next/link'

import { PayloadImage } from '@/components/media/PayloadImage'

type ArticleLongCardProps = {
  article: Article
}

export function ArticleLongCard({ article }: ArticleLongCardProps) {
  return (
    <article className="group grid grid-cols-1 gap-5 sm:grid-cols-[minmax(15rem,22rem)_1fr] sm:items-start">
      <Link
        href={`/articles/${article.slug}`}
        className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {article.heroImage ? (
          <PayloadImage
            media={article.heroImage}
            size="card"
            fill
            sizes="(max-width: 640px) 100vw, 30vw"
            className="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
        )}
      </Link>
      <div className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Article</p>
        <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          <Link
            href={`/articles/${article.slug}`}
            className="rounded-sm underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {article.title}
          </Link>
        </h2>
        {article.excerpt ? (
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {article.excerpt}
          </p>
        ) : null}
      </div>
    </article>
  )
}
