import type { GalleryCollection } from '@repo/payload-types'
import Link from 'next/link'

import { PayloadImage } from '@/components/media/PayloadImage'
import { resolveGalleryCollectionCover } from '@/lib/payload'
import { isMedia } from '@/lib/media'

type GalleryCollectionCardProps = {
  collection: GalleryCollection
}

export function GalleryCollectionCard({ collection }: GalleryCollectionCardProps) {
  const cover = resolveGalleryCollectionCover(collection)

  return (
    <article className="group flex flex-col gap-4">
      <Link
        href={`/gallery/${collection.slug}`}
        className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {cover && isMedia(cover) ? (
          <PayloadImage
            media={cover}
            size="card"
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </Link>
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          <Link
            href={`/gallery/${collection.slug}`}
            className="rounded-sm underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {collection.title}
          </Link>
        </h2>
        {collection.excerpt ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {collection.excerpt}
          </p>
        ) : null}
      </div>
    </article>
  )
}
