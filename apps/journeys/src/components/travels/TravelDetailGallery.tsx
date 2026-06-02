'use client'

import type { Media } from '@repo/payload-types'
import { BentoCard, BentoGrid } from '@repo/ui/bento-grid'
import { MediaPreview, type MediaPreviewItem } from '@repo/ui/media-preview'
import { TooltipCard } from '@repo/ui/tooltip-card'
import Image from 'next/image'
import { useMemo, useState } from 'react'

import { getMediaUrl, isMedia } from '@/lib/media'
import { cn } from '@/lib/utils'

type TravelGalleryEntry = {
  id?: string | null
  media?: Media | string | null
  image?: Media | string | null
  alt?: string | null
  caption?: string | null
}

type RichTextNode = {
  text?: string | null
  children?: RichTextNode[] | null
}

type TravelDetailGalleryProps = {
  travelTitle: string
  items: TravelGalleryEntry[]
}

const spanPatterns = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-2',
  'md:col-span-2 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-2 md:row-span-2',
]

function extractPlainTextFromRichText(node: RichTextNode | null | undefined): string {
  if (!node) return ''

  const chunks: string[] = []

  const visit = (current: RichTextNode) => {
    if (typeof current.text === 'string' && current.text.trim()) {
      chunks.push(current.text.trim())
    }
    if (Array.isArray(current.children)) {
      current.children.forEach(visit)
    }
  }

  visit(node)
  return chunks.join(' ').trim()
}

function toPreviewItems(travelTitle: string, entries: TravelGalleryEntry[]): MediaPreviewItem[] {
  return entries.reduce<MediaPreviewItem[]>((acc, entry, index) => {
    const media = entry.media || entry.image
    if (!isMedia(media)) return acc

    const url = getMediaUrl(media, 'large')
    if (!url) return acc

    const thumb = getMediaUrl(media, 'card') || getMediaUrl(media, 'medium') || url
    const mimeType = media.mimeType ?? null
    const kind = mimeType?.startsWith('video/') ? 'video' : 'image'
    const mediaCaption = extractPlainTextFromRichText((media.caption?.root as RichTextNode | undefined) ?? null)
    const caption = entry.caption?.trim() || mediaCaption || null

    acc.push({
      id: entry.id || `${media.id}-${index}`,
      url,
      thumbnailUrl: thumb,
      kind,
      mimeType,
      alt: entry.alt || media.alt || travelTitle,
      caption,
    })
    return acc
  }, [])
}

export function TravelDetailGallery({ travelTitle, items }: TravelDetailGalleryProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const previewItems = useMemo(() => toPreviewItems(travelTitle, items), [items, travelTitle])

  if (previewItems.length === 0) return null

  return (
    <>
      <BentoGrid className="auto-rows-[140px] sm:auto-rows-[160px]">
        {previewItems.map((item, index) => (
          <TooltipCard key={item.id} disabled={!item.caption} content={item.caption} side="top">
            <BentoCard className={cn('bg-muted', spanPatterns[index % spanPatterns.length])}>
              <button
                type="button"
                onClick={() => setPreviewIndex(index)}
                className={cn(
                  'group relative h-full w-full overflow-hidden',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                )}
                aria-label={`Open ${item.alt || 'media'} in fullscreen`}
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
                    alt={item.alt || ''}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  />
                )}
              </button>
            </BentoCard>
          </TooltipCard>
        ))}
      </BentoGrid>

      <MediaPreview
        items={previewItems}
        title={travelTitle}
        currentIndex={previewIndex}
        onIndexChange={setPreviewIndex}
        onClose={() => setPreviewIndex(null)}
      />
    </>
  )
}
