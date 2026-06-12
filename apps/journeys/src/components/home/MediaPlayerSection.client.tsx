'use client'

import type { Media, MediaPlayerBlock } from '@repo/payload-types'
import { MediaPlayerBlockView } from '@repo/ui/media-player-block-view'
import { mapMediaPlayerBlockFields } from '@repo/ui/lib/media-player-block'

import { getMediaUrl, isMedia } from '@/lib/media'

type MediaPlayerSectionProps = {
  block: MediaPlayerBlock
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

export function MediaPlayerSectionClient({ block }: MediaPlayerSectionProps) {
  const source = resolveMediaSource(block.media)

  if (!source) return null

  return (
    <section className="my-10 px-4 md:px-6">
      <MediaPlayerBlockView
        src={source.src}
        mimeType={source.mimeType}
        config={mapMediaPlayerBlockFields(block)}
      />
    </section>
  )
}
