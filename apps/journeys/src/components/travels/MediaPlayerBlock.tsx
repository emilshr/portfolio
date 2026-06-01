'use client'

import type { Media, MediaPlayerBlock } from '@repo/payload-types'
import { MediaPlayerBlockView } from '@repo/ui/media-player-block-view'
import { mapMediaPlayerBlockFields } from '@repo/ui/lib/media-player-block'

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
  const source = resolveMediaSource(media)
  if (!source) return null

  return (
    <div className={cn('my-8', className)}>
      <MediaPlayerBlockView
        src={source.src}
        mimeType={source.mimeType}
        config={mapMediaPlayerBlockFields(props)}
      />
    </div>
  )
}
