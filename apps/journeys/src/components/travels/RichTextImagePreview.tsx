'use client'

import { MediaPreview } from '@repo/ui/media-preview'
import Image from 'next/image'
import { useMemo, useState } from 'react'

type RichTextImagePreviewProps = {
  src: string
  alt: string
  width: number
  height: number
}

export function RichTextImagePreview({ src, alt, width, height }: RichTextImagePreviewProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const items = useMemo(
    () => [
      {
        id: 'rich-text-image',
        url: src,
        thumbnailUrl: src,
        kind: 'image' as const,
        alt,
        caption: null,
      },
    ],
    [alt, src],
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setPreviewIndex(0)}
        className="group relative block w-full"
        aria-label={`Open ${alt} in fullscreen`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full object-cover"
          sizes="(max-width: 768px) 100vw, 72rem"
        />
      </button>
      <MediaPreview
        items={items}
        currentIndex={previewIndex}
        onIndexChange={setPreviewIndex}
        onClose={() => setPreviewIndex(null)}
      />
    </>
  )
}
