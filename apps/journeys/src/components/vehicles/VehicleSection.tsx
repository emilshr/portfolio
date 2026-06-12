'use client'

import type { Vehicle } from '@repo/payload-types'
import { BentoCard, BentoGrid } from '@repo/ui/bento-grid'
import { MediaPreview, type MediaPreviewItem } from '@repo/ui/media-preview'
import { Star } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { PayloadImage } from '@/components/media/PayloadImage'
import { TravelDetailGallery } from '@/components/travels/TravelDetailGallery'
import { TravelRichText } from '@/components/travels/TravelRichText'
import { getMediaUrl, isMedia } from '@/lib/media'
import { cn } from '@/lib/utils'

type VehicleSectionProps = {
  vehicle: Vehicle
}

type VehicleMod = NonNullable<Vehicle['mods']>[number]

const spanPatterns = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-2',
  'md:col-span-2 md:row-span-1',
]

function formatOdometer(value: number | null | undefined): string {
  if (typeof value !== 'number') return '—'
  return `${new Intl.NumberFormat('en-US').format(value)} km`
}

function buildModPreviewItems(mod: VehicleMod): MediaPreviewItem[] {
  if (!mod?.pictures?.length) return []

  return mod.pictures.reduce<MediaPreviewItem[]>((acc, item, index) => {
    const media = item.media
    if (!media || typeof media === 'string' || !isMedia(media)) return acc
    const url = getMediaUrl(media, 'large')
    if (!url) return acc

    acc.push({
      id: item.id || `${media.id}-${index}`,
      url,
      thumbnailUrl: getMediaUrl(media, 'card') || getMediaUrl(media, 'medium') || url,
      kind: media.mimeType?.startsWith('video/') ? 'video' : 'image',
      mimeType: media.mimeType ?? null,
      alt: item.alt || media.alt || mod.name || 'Mod media',
      caption: item.caption ?? null,
    })
    return acc
  }, [])
}

function RatingStars({ rating }: { rating: number | null | undefined }) {
  if (typeof rating !== 'number') return null
  const normalized = Math.max(0, Math.min(5, rating))

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground" aria-label={`${normalized} out of 5 stars`}>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn('h-4 w-4', normalized >= index + 1 ? 'fill-primary text-primary' : 'text-muted-foreground')}
          />
        ))}
      </div>
      <span>{normalized.toFixed(1)} / 5</span>
    </div>
  )
}

export function VehicleSection({ vehicle }: VehicleSectionProps) {
  const [preview, setPreview] = useState<{ modId: string; index: number | null } | null>(null)

  return (
    <article className="space-y-10">
      <header className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(14rem,20rem)_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
          {vehicle.coverImage ? (
            <PayloadImage media={vehicle.coverImage} size="card" fill sizes="(max-width: 768px) 100vw, 30vw" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">No cover image</div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Vehicle</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight">{vehicle.name}</h2>
          <p className="text-sm text-muted-foreground">Odometer: {formatOdometer(vehicle.odometer)}</p>
        </div>
      </header>

      <div className="max-w-3xl">
        <TravelRichText data={vehicle.details} />
      </div>

      {vehicle.gallery && vehicle.gallery.length > 0 ? (
        <section aria-labelledby={`vehicle-gallery-${vehicle.id}`} className="space-y-6">
          <h3 id={`vehicle-gallery-${vehicle.id}`} className="font-display text-2xl font-semibold tracking-tight">
            Gallery
          </h3>
          <TravelDetailGallery travelTitle={vehicle.name} items={vehicle.gallery} />
        </section>
      ) : null}

      {vehicle.mods && vehicle.mods.length > 0 ? (
        <section aria-labelledby={`vehicle-mods-${vehicle.id}`} className="space-y-6">
          <h3 id={`vehicle-mods-${vehicle.id}`} className="font-display text-2xl font-semibold tracking-tight">
            Mods
          </h3>

          <div className="space-y-8">
            {vehicle.mods.map((mod) => {
              const modId = mod.id || `${vehicle.id}-${mod.name}`
              const previewItems = buildModPreviewItems(mod)
              const isOpen = preview?.modId === modId

              return (
                <article key={modId} className="rounded-xl border border-border p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h4 className="font-display text-xl font-semibold tracking-tight">{mod.name}</h4>
                      {mod.productURL ? (
                        <Link
                          href={mod.productURL}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex text-sm text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          Product link
                        </Link>
                      ) : null}
                    </div>
                    <RatingStars rating={mod.rating} />
                  </div>

                  {previewItems.length > 0 ? (
                    <div className="mt-5">
                      <BentoGrid className="auto-rows-[120px] sm:auto-rows-[140px]">
                        {previewItems.map((item, index) => (
                          <BentoCard
                            key={item.id}
                            className={cn('bg-muted', spanPatterns[index % spanPatterns.length])}
                          >
                            <button
                              type="button"
                              onClick={() => setPreview({ modId, index })}
                              className="group relative h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              aria-label={`Open ${item.alt || 'mod image'} in fullscreen`}
                            >
                              <img
                                src={item.thumbnailUrl || item.url}
                                alt={item.alt || ''}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                              />
                            </button>
                          </BentoCard>
                        ))}
                      </BentoGrid>

                      <MediaPreview
                        items={previewItems}
                        currentIndex={isOpen ? preview.index : null}
                        onIndexChange={(index) => setPreview({ modId, index })}
                        onClose={() => setPreview(null)}
                        title={`${vehicle.name} · ${mod.name}`}
                      />
                    </div>
                  ) : null}

                  {mod.review ? (
                    <div className="mt-5 max-w-3xl">
                      <TravelRichText data={mod.review} />
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        </section>
      ) : null}
    </article>
  )
}
