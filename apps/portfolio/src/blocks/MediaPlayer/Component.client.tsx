'use client'

import type { Media } from '@repo/payload-types'
import type { MediaPlayerBlock as MediaPlayerBlockProps } from '@repo/payload-types'
import { MediaPlayerBlockView } from '@repo/ui/media-player-block-view'

import { cn } from '@/utilities/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'

import { mapMediaPlayerBlockToConfig } from './mapConfig'

type Props = MediaPlayerBlockProps & {
  className?: string
  enableGutter?: boolean
  disableInnerContainer?: boolean
}

function resolveMediaSource(media: Media | string | null | undefined): {
  src: string
  mimeType: string | null
} | null {
  if (!media || typeof media !== 'object') return null

  const src = getMediaUrl(media.url, media.updatedAt)
  if (!src) return null

  return {
    src,
    mimeType: media.mimeType ?? null,
  }
}

export const MediaPlayerBlockComponent: React.FC<Props> = (props) => {
  const { className, enableGutter = true, disableInnerContainer, media } = props

  const source = resolveMediaSource(media)
  if (!source) return null

  const config = mapMediaPlayerBlockToConfig(props)

  return (
    <div
      className={cn(
        'my-8',
        {
          container: enableGutter && !disableInnerContainer,
        },
        className,
      )}
    >
      <MediaPlayerBlockView src={source.src} mimeType={source.mimeType} config={config} />
    </div>
  )
}
