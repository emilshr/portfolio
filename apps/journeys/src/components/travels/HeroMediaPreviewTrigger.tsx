'use client'

import { MediaPreview } from '@repo/ui/media-preview'
import { useMemo, useState } from 'react'

type HeroMediaPreviewTriggerProps = {
  url: string
  alt: string
}

export function HeroMediaPreviewTrigger({ url, alt }: HeroMediaPreviewTriggerProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const items = useMemo(
    () => [
      {
        id: 'travel-hero-media',
        url,
        thumbnailUrl: url,
        kind: 'image' as const,
        alt,
        caption: null,
      },
    ],
    [alt, url],
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setPreviewIndex(0)}
        aria-label="Open hero image in fullscreen"
        className="absolute inset-0 z-[5]"
      />
      <MediaPreview
        items={items}
        currentIndex={previewIndex}
        onIndexChange={setPreviewIndex}
        onClose={() => setPreviewIndex(null)}
      />
    </>
  )
}
