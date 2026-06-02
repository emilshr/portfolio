'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import type { GalleryItem } from '@/lib/payload'
import { cn } from '@/lib/utils'

type MediaLightboxProps = {
  items: GalleryItem[]
  initialIndex: number
  onClose: () => void
}

export function MediaLightbox({ items, initialIndex, onClose }: MediaLightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const current = items[index]

  const goPrev = useCallback(() => {
    setIndex((i) => (i === 0 ? items.length - 1 : i - 1))
  }, [items.length])

  const goNext = useCallback(() => {
    setIndex((i) => (i === items.length - 1 ? 0 : i + 1))
  }, [items.length])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (!dialog.open) {
      dialog.showModal()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') goPrev()
      if (event.key === 'ArrowRight') goNext()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [goNext, goPrev, onClose])

  if (!current) return null

  return (
    <dialog
      ref={dialogRef}
      aria-label="Image gallery"
      className="fixed inset-0 z-50 m-0 flex h-full max-h-none w-full max-w-none flex-col border-0 bg-black/95 p-0 backdrop:bg-black/80"
      onClose={onClose}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <p className="truncate text-sm text-white/80">
          {current.source?.title || 'Gallery'}
          {current.caption ? ` — ${current.caption}` : ''}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10"
          aria-label="Close gallery"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 pb-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={goPrev}
          className="absolute left-2 z-10 text-white hover:bg-white/10 md:left-4"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="relative h-full w-full max-h-[calc(100vh-12rem)] max-w-6xl">
          <Image
            src={current.url}
            alt={current.alt}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={goNext}
          className="absolute right-2 z-10 text-white hover:bg-white/10 md:right-4"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="border-t border-white/10 px-4 py-3">
        <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto pb-1" aria-label="Image thumbnails">
          {items.map((item, thumbIndex) => {
            const active = thumbIndex === index
            return (
              <button
                key={item.id}
                type="button"
                aria-current={active ? 'true' : undefined}
                onClick={() => setIndex(thumbIndex)}
                className={cn(
                  'relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                  active ? 'border-white opacity-100' : 'border-transparent opacity-50 grayscale',
                )}
              >
                <Image src={item.thumbnailUrl || item.url} alt="" fill className="object-cover" sizes="56px" />
              </button>
            )
          })}
        </div>
      </div>

    </dialog>
  )
}
