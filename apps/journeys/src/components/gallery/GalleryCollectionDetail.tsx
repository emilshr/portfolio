'use client'

import { useState } from 'react'
import type { GalleryCollection } from '@repo/payload-types'
import { MediaPreview } from '@repo/ui/media-preview'
import Image from 'next/image'

import { PayloadImage } from '@/components/media/PayloadImage'
import { TravelRichText } from '@/components/travels/TravelRichText'
import type { GalleryCollectionImageItem } from '@/lib/payload'
import { resolveGalleryCollectionCover } from '@/lib/payload'
import { isMedia } from '@/lib/media'

type GalleryCollectionDetailProps = {
  collection: GalleryCollection
  images: GalleryCollectionImageItem[]
}

export function GalleryCollectionDetail({ collection, images }: GalleryCollectionDetailProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const cover = resolveGalleryCollectionCover(collection)

  return (
    <article>
      <section className="relative min-h-[min(52vh,560px)] w-full overflow-hidden">
        {cover && isMedia(cover) ? (
          <>
            <PayloadImage
              media={cover}
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
        <div className="relative z-10 flex min-h-[min(52vh,560px)] flex-col justify-end pb-12 pt-28">
          <div className="page-container">
            <h1 className="max-w-4xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {collection.title}
            </h1>
            {collection.excerpt ? (
              <p className="mt-4 max-w-2xl text-lg text-white/60 sm:text-xl">
                {collection.excerpt}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="page-container py-12 md:py-16">
        {collection.description ? (
          <div className="mx-auto mb-12 max-w-3xl">
            <TravelRichText data={collection.description} />
          </div>
        ) : null}

        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
            {images.map((item, index) => (
              <div
                key={item.id}
                className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
              >
                <button
                  type="button"
                  onClick={() => setPreviewIndex(index)}
                  className="group relative h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={`Open ${item.alt}`}
                >
                  {item.kind === 'video' ? (
                    <video
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                    >
                      <source
                        src={item.thumbnailUrl || item.url}
                        type={item.mimeType ?? undefined}
                      />
                    </video>
                  ) : (
                    <Image
                      src={item.thumbnailUrl || item.url}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                    />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No images in this collection yet.</p>
        )}
      </div>

      <MediaPreview
        items={images}
        currentIndex={previewIndex}
        onIndexChange={setPreviewIndex}
        onClose={() => setPreviewIndex(null)}
      />
    </article>
  )
}
