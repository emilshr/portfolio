"use client"

import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react"
import { type MouseEvent, type ReactNode, useCallback, useEffect, useMemo, useState, useRef } from "react"

import { cn } from "../lib/utils"
import { Button } from "./button"

export type MediaPreviewItem = {
  id: string
  url: string
  thumbnailUrl?: string | null
  alt?: string
  caption?: string | null
  kind: "image" | "video"
  mimeType?: string | null
}

type MediaPreviewProps = {
  items: MediaPreviewItem[]
  currentIndex: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
  title?: string
  renderAnnotation?: (item: MediaPreviewItem) => ReactNode
}

export function MediaPreview({
  items,
  currentIndex,
  onIndexChange,
  onClose,
  title,
  renderAnnotation,
}: MediaPreviewProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const activeThumbRef = useRef<HTMLButtonElement>(null)
  const isOpen = currentIndex !== null
  const item = currentIndex !== null ? items[currentIndex] : null
  const [loadedItemId, setLoadedItemId] = useState<string | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const isMediaLoading = Boolean(item && loadedItemId !== item.id)

  const hasMultiple = items.length > 1
  const fallbackTitle = useMemo(() => {
    if (!isOpen || currentIndex === null) return ""
    return `Item ${currentIndex + 1} of ${items.length}`
  }, [currentIndex, isOpen, items.length])

  const goPrev = useCallback(() => {
    if (!hasMultiple || currentIndex === null) return
    onIndexChange(currentIndex === 0 ? items.length - 1 : currentIndex - 1)
  }, [currentIndex, hasMultiple, items.length, onIndexChange])

  const goNext = useCallback(() => {
    if (!hasMultiple || currentIndex === null) return
    onIndexChange(currentIndex === items.length - 1 ? 0 : currentIndex + 1)
  }, [currentIndex, hasMultiple, items.length, onIndexChange])

  const markLoaded = useCallback((itemId: string) => {
    setLoadedItemId(itemId)
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
    }

    if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setPrefersReducedMotion(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (currentIndex === null) return
    activeThumbRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    })
  }, [currentIndex, prefersReducedMotion])

  const handleImageRef = useCallback(
    (node: HTMLImageElement | null) => {
      if (!item) return
      if (node?.complete && node.naturalWidth > 0) {
        markLoaded(item.id)
      }
    },
    [item, markLoaded],
  )

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        goPrev()
      }
      if (event.key === "ArrowRight") {
        event.preventDefault()
        goNext()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [goNext, goPrev, isOpen, onClose])

  const handleOverlayClick = useCallback(
    (event: MouseEvent<HTMLDialogElement>) => {
      const target = event.target
      if (!(target instanceof Element)) return
      // Keep media and chrome interactive; only backdrop/empty areas dismiss.
      if (target.closest("img, video, button, a, [data-media-preview-interactive]")) return
      onClose()
    },
    [onClose],
  )

  if (!isOpen || !item) return null

  const annotation = renderAnnotation?.(item) ?? null
  const mediaTransitionClass = prefersReducedMotion
    ? undefined
    : "transition-opacity duration-300 ease-out"

  return (
    <dialog
      ref={dialogRef}
      aria-label="Fullscreen media preview"
      aria-busy={isMediaLoading}
      className="fixed inset-0 z-50 m-0 flex h-full max-h-none w-full max-w-none flex-col border-0 bg-black/95 p-0 backdrop:bg-black/80"
      onClose={onClose}
      onClick={handleOverlayClick}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="truncate text-sm text-white/80">{title || fallbackTitle}</p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="cursor-pointer text-white hover:bg-white/10"
          aria-label="Close preview"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 pb-4">
        {hasMultiple ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={goPrev}
            className="absolute left-2 z-10 cursor-pointer text-white hover:bg-white/10 md:left-4"
            aria-label="Previous media"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        ) : null}

        <div className="flex h-full w-full max-h-[calc(100vh-16rem)] max-w-6xl flex-col items-center justify-center">
          {annotation ? (
            <div
              data-media-preview-interactive
              className="mb-3 w-full max-w-xl shrink-0 px-2 text-center sm:mb-4"
            >
              {annotation}
            </div>
          ) : null}

          <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
            {isMediaLoading ? (
              <div
                className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
                aria-hidden="true"
              >
                <Loader2 className="h-8 w-8 animate-spin text-white/80" />
              </div>
            ) : null}

            {item.kind === "video" ? (
              <video
                key={item.id}
                controls
                autoPlay
                onLoadedData={() => markLoaded(item.id)}
                onError={() => markLoaded(item.id)}
                className={cn(
                  "max-h-full max-w-full rounded-md",
                  mediaTransitionClass,
                  isMediaLoading ? "opacity-0" : "opacity-100",
                )}
                aria-label={item.alt || "Preview video"}
              >
                <source src={item.url} type={item.mimeType ?? undefined} />
              </video>
            ) : (
              <img
                key={item.id}
                ref={handleImageRef}
                src={item.url}
                alt={item.alt || "Preview image"}
                onLoad={() => markLoaded(item.id)}
                onError={() => markLoaded(item.id)}
                className={cn(
                  "max-h-full max-w-full rounded-md object-contain",
                  mediaTransitionClass,
                  isMediaLoading ? "opacity-0" : "opacity-100",
                )}
              />
            )}
          </div>
        </div>

        {hasMultiple ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={goNext}
            className="absolute right-2 z-10 cursor-pointer text-white hover:bg-white/10 md:right-4"
            aria-label="Next media"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        ) : null}
      </div>

      {item.caption ? (
        <p className="px-4 pb-2 text-center text-xs text-white/60">{item.caption}</p>
      ) : null}

      {hasMultiple ? (
        <div data-media-preview-interactive className="border-t border-white/10 px-4 py-3">
          <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto pb-1" aria-label="Media thumbnails">
            {items.map((thumb, thumbIndex) => {
              const active = thumbIndex === currentIndex
              return (
                <button
                  key={thumb.id}
                  ref={active ? activeThumbRef : undefined}
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => onIndexChange(thumbIndex)}
                  className={cn(
                    "relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                    active ? "border-white opacity-100" : "border-transparent opacity-60 grayscale",
                  )}
                >
                  {thumb.kind === "video" ? (
                    <video
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                    >
                      <source src={thumb.thumbnailUrl || thumb.url} type={thumb.mimeType ?? undefined} />
                    </video>
                  ) : (
                    <img
                      src={thumb.thumbnailUrl || thumb.url}
                      alt=""
                      className="h-full w-full object-cover"
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </dialog>
  )
}
