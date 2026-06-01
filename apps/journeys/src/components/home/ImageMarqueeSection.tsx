'use client'

import type { ImageMarqueeBlock, Media } from '@repo/payload-types'
import { useEffect, useMemo, useState } from 'react'

import { PayloadImage } from '@/components/media/PayloadImage'
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from '@/components/ui/scroll-based-velocity'
import { getMediaAlt, isMedia } from '@/lib/media'
import { cn } from '@/lib/utils'

type ImageMarqueeSectionProps = {
  block: ImageMarqueeBlock
}

type MarqueeImage = {
  id: string
  media: Media
  alt?: string | null
}

function resolveMarqueeImages(block: ImageMarqueeBlock): MarqueeImage[] {
  if (!block.images?.length) return []

  const items: MarqueeImage[] = []

  for (const entry of block.images) {
    if (!isMedia(entry.image)) continue
    items.push({
      id: entry.id ?? entry.image.id,
      media: entry.image,
      alt: entry.alt,
    })
  }

  return items
}

function MarqueeImageTile({ item }: { item: MarqueeImage }) {
  return (
    <span className="relative mx-3 inline-flex h-24 w-40 shrink-0 overflow-hidden rounded-md">
      <PayloadImage
        media={item.media}
        alt={item.alt ?? getMediaAlt(item.media)}
        size="card"
        fill
        className="h-full w-full"
        sizes="160px"
      />
    </span>
  )
}

function StaticMarqueeStrip({ images }: { images: MarqueeImage[] }) {
  return (
    <div className="flex w-full gap-3 overflow-x-auto px-[clamp(1.5rem,5vw,4rem)] py-[var(--space-10)] motion-reduce:overflow-x-auto">
      {images.map((item) => (
        <MarqueeImageTile key={item.id} item={item} />
      ))}
    </div>
  )
}

export function ImageMarqueeSection({ block }: ImageMarqueeSectionProps) {
  const images = useMemo(() => resolveMarqueeImages(block), [block])
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  if (images.length === 0) return null

  const baseVelocity = block.baseVelocity ?? 5
  const direction = block.direction === '-1' ? -1 : 1

  if (prefersReducedMotion) {
    return <StaticMarqueeStrip images={images} />
  }

  return (
    <section className={cn('w-full py-[var(--space-10)]')}>
      <ScrollVelocityContainer>
        <ScrollVelocityRow baseVelocity={baseVelocity} direction={direction}>
          {images.map((item) => (
            <MarqueeImageTile key={item.id} item={item} />
          ))}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </section>
  )
}
