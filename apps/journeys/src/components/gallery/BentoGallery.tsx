'use client'

import { useState } from 'react'
import { MediaPreview } from '@repo/ui/media-preview'
import { TooltipCard } from '@repo/ui/tooltip-card'
import Link from 'next/link'
import Image from 'next/image'

import type { GalleryItem } from '@/lib/payload'

type BentoGalleryProps = {
  items: GalleryItem[]
}

export function BentoGallery({ items }: BentoGalleryProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  if (items.length === 0) {
    return <p className="text-muted-foreground">No gallery media yet.</p>
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
        {items.map((item, index) => (
          <TooltipCard
            key={item.id}
            disabled={!item.caption}
            content={item.caption}
            side="top"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
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
                    <source src={item.thumbnailUrl || item.url} type={item.mimeType ?? undefined} />
                  </video>
                ) : (
                  <Image
                    src={item.thumbnailUrl || item.url}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 text-left">
                  <p className="text-xs text-white/80">
                    {item.source ? `${item.source.type === 'article' ? 'Article' : 'Travel'} · ${item.source.title}` : 'Gallery'}
                  </p>
                </div>
              </button>
            </div>
          </TooltipCard>
        ))}
      </div>

      <MediaPreview
        items={items}
        currentIndex={previewIndex}
        onIndexChange={setPreviewIndex}
        onClose={() => setPreviewIndex(null)}
        renderAnnotation={(item) => {
          const source = (item as GalleryItem).source
          if (!source) return null
          return (
            <Link
              href={source.href}
              className="inline-flex max-w-full items-center rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs text-white/90 backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Part of {source.type === 'article' ? 'article' : 'travel'}: {source.title}
            </Link>
          )
        }}
      />
    </>
  )
}
