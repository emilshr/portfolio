'use client'

import { useState } from 'react'
import { BentoCard, BentoGrid } from '@repo/ui/bento-grid'
import { MediaPreview } from '@repo/ui/media-preview'
import { TooltipCard } from '@repo/ui/tooltip-card'
import Image from 'next/image'

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
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  if (items.length === 0) {
    return <p className="text-muted-foreground">No gallery media yet.</p>
  }

  return (
    <>
      <BentoGrid className="auto-rows-[120px] sm:auto-rows-[140px]">
        {items.map((item, index) => (
          <TooltipCard
            key={item.id}
            disabled={!item.caption}
            content={item.caption}
            side="top"
          >
            <BentoCard className={cn('min-h-[120px] bg-muted', spanPatterns[index % spanPatterns.length])}>
              <button
                type="button"
                onClick={() => setPreviewIndex(index)}
                className={cn(
                  'group relative h-full w-full focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-ring focus-visible:ring-offset-2',
                )}
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
                  <p className="text-xs text-white/80">{item.travelTitle}</p>
                </div>
              </button>
            </BentoCard>
          </TooltipCard>
        ))}
      </BentoGrid>

      <MediaPreview
        items={items}
        currentIndex={previewIndex}
        onIndexChange={setPreviewIndex}
        onClose={() => setPreviewIndex(null)}
      />
    </>
  )
}
