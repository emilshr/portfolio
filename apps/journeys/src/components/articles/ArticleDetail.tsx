import type { Article } from '@repo/payload-types'

import { PayloadImage } from '@/components/media/PayloadImage'
import { TravelDetailGallery } from '@/components/travels/TravelDetailGallery'
import { TravelRichText } from '@/components/travels/TravelRichText'

type ArticleDetailProps = {
  article: Article
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  return (
    <article>
      <section className="relative min-h-[min(62vh,680px)] w-full overflow-hidden">
        {article.heroImage ? (
          <>
            <PayloadImage
              media={article.heroImage}
              size="hero"
              fill
              priority
              sizes="100vw"
              className="absolute inset-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-hero-scrim" aria-hidden />
          </>
        ) : (
          <div className="absolute inset-0 bg-muted" aria-hidden />
        )}
        <div className="relative z-10 flex min-h-[min(62vh,680px)] flex-col justify-end pb-12 pt-28">
          <div className="page-container">
            <p className="mb-3 text-sm uppercase tracking-wider text-white/70">Article</p>
            <h1 className="max-w-4xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {article.title}
            </h1>
            {article.excerpt ? (
              <p className="mt-4 max-w-2xl text-lg text-white/60 sm:text-xl">{article.excerpt}</p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="page-container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <TravelRichText data={article.content} />
        </div>

        {article.gallery && article.gallery.length > 0 ? (
          <section className="mt-16" aria-labelledby="article-gallery-heading">
            <h2
              id="article-gallery-heading"
              className="mb-8 font-display text-2xl font-semibold tracking-tight"
            >
              Gallery
            </h2>
            <TravelDetailGallery travelTitle={article.title} items={article.gallery} />
          </section>
        ) : null}
      </div>
    </article>
  )
}
