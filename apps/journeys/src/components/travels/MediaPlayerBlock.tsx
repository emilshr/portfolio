'use client'

import type { Media, MediaPlayerBlock } from '@repo/payload-types'
import { Button } from '@repo/ui/button'
import { MediaPlayerBlockView } from '@repo/ui/media-player-block-view'
import { MediaPreview } from '@repo/ui/media-preview'
import { mapMediaPlayerBlockFields } from '@repo/ui/lib/media-player-block'
import { Expand } from 'lucide-react'
import { useMemo, useState } from 'react'

import { getMediaUrl, isMedia } from '@/lib/media'
import { cn } from '@/lib/utils'

type Props = MediaPlayerBlock & {
  className?: string
}

function resolveMediaSource(media: Media | string | null | undefined): {
  src: string
  mimeType: string | null
} | null {
  if (!isMedia(media)) return null

  const src = getMediaUrl(media)
  if (!src) return null

  return {
    src,
    mimeType: media.mimeType ?? null,
  }
}

export function MediaPlayerBlockComponent(props: Props) {
  const { className, media } = props
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const source = resolveMediaSource(media)
  const isVideo = Boolean(source?.mimeType?.startsWith('video/'))
  const previewItems = useMemo(
    () =>
      source && isVideo
        ? [
            {
              id: 'richtext-video-preview',
              url: source.src,
              thumbnailUrl: source.src,
              kind: 'video' as const,
              mimeType: source.mimeType,
            },
          ]
        : [],
    [isVideo, source],
  )

  if (!source) return null

  return (
    <div className={cn('my-8', className)}>
      {isVideo ? (
        <div className="mb-3 flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewIndex(0)}
            aria-label="Open video in fullscreen"
          >
            <Expand className="h-4 w-4" />
            Fullscreen preview
          </Button>
        </div>
      ) : null}
      <MediaPlayerBlockView
        src={source.src}
        mimeType={source.mimeType}
        config={mapMediaPlayerBlockFields(props)}
      />
      {isVideo ? (
        <MediaPreview
          items={previewItems}
          currentIndex={previewIndex}
          onIndexChange={setPreviewIndex}
          onClose={() => setPreviewIndex(null)}
          title="Video preview"
        />
      ) : null}
    </div>
  )
}
