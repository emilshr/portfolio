'use client'

import Image from 'next/image'
import { useState } from 'react'

import { MediaLightbox } from '@/components/gallery/MediaLightbox'
import type { GalleryItem } from '@/lib/payload'
import { cn } from '@/lib/utils'

const spanPatterns = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-2',
  'md:col-span-2 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-2 md:row-span-2',
]

type BentoGalleryProps = {
  items: GalleryItem[]
}

export function BentoGallery({ items }: BentoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (items.length === 0) {
    return <p className="text-muted-foreground">No gallery images yet.</p>
  }

  return (
    <>
      <div className="grid auto-rows-[120px] grid-cols-1 gap-3 sm:auto-rows-[140px] md:grid-cols-4 md:gap-4">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className={cn(
              'group relative min-h-[120px] overflow-hidden rounded-xl bg-muted',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              spanPatterns[index % spanPatterns.length],
            )}
            aria-label={`Open ${item.alt}`}
          >
            <Image
              src={item.thumbnailUrl || item.url}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 text-left">
              <p className="text-xs text-white/80">{item.travelTitle}</p>
            </div>
          </button>
        ))}
      </div>

      {lightboxIndex !== null ? (
        <MediaLightbox
          items={items}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </>
  )
}
