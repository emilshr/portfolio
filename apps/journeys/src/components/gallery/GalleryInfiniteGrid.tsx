'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { MediaPreview } from '@repo/ui/media-preview'
import Image from 'next/image'

import { loadGalleryPage } from '@/app/gallery/actions'
import type { GalleryFolderMediaItem } from '@/lib/payload'

type GalleryInfiniteGridProps = {
  initialItems: GalleryFolderMediaItem[]
  initialHasNextPage: boolean
  initialPage: number
}

export function GalleryInfiniteGrid({
  initialItems,
  initialHasNextPage,
  initialPage,
}: GalleryInfiniteGridProps) {
  const [items, setItems] = useState(initialItems)
  const [page, setPage] = useState(initialPage)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const loadingRef = useRef(false)

  useEffect(() => {
    setItems(initialItems)
    setPage(initialPage)
    setHasNextPage(initialHasNextPage)
  }, [initialItems, initialHasNextPage, initialPage])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting || loadingRef.current || isPending) return

        loadingRef.current = true
        const nextPage = page + 1

        startTransition(async () => {
          try {
            const result = await loadGalleryPage(nextPage)
            setItems((prev) => {
              const seen = new Set(prev.map((item) => item.id))
              const appended = result.items.filter((item) => !seen.has(item.id))
              return appended.length > 0 ? [...prev, ...appended] : prev
            })
            setPage(result.page)
            setHasNextPage(result.hasNextPage)
          } finally {
            loadingRef.current = false
          }
        })
      },
      { rootMargin: '400px 0px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isPending, page])

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground">
        No media in the Gallery folder yet. Upload files into the folder configured in Gallery
        Settings.
      </p>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
          >
            <button
              type="button"
              onClick={() => setPreviewIndex(index)}
              className="group relative h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Open ${item.alt || 'gallery media'}`}
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
                  sizes="(max-width: 768px) 50vw, 25vw"
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                />
              )}
            </button>
          </div>
        ))}
      </div>

      {hasNextPage ? (
        <div ref={sentinelRef} className="flex justify-center py-10" aria-hidden={!isPending}>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {isPending ? 'Loading more…' : '\u00a0'}
          </p>
        </div>
      ) : null}

      <MediaPreview
        items={items}
        currentIndex={previewIndex}
        onIndexChange={setPreviewIndex}
        onClose={() => setPreviewIndex(null)}
      />
    </>
  )
}
