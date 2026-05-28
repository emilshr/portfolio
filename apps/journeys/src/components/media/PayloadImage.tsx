import type { Media } from '@repo/payload-types'
import Image from 'next/image'

import { getMediaAlt, getMediaUrl, isMedia } from '@/lib/media'
import { cn } from '@/lib/utils'

type PayloadImageProps = {
  media?: string | Media | null
  alt?: string
  size?: 'thumbnail' | 'card' | 'hero' | 'large' | 'medium'
  className?: string
  fill?: boolean
  priority?: boolean
  sizes?: string
}

export function PayloadImage({
  media,
  alt,
  size,
  className,
  fill,
  priority,
  sizes = '(max-width: 768px) 100vw, 50vw',
}: PayloadImageProps) {
  if (!isMedia(media)) return null

  const src = getMediaUrl(media, size)
  if (!src) return null

  const width = fill ? undefined : (media.width ?? 1200)
  const height = fill ? undefined : (media.height ?? 800)

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt ?? getMediaAlt(media)}
        fill
        priority={priority}
        sizes={sizes}
        className={cn('object-cover', className)}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt ?? getMediaAlt(media)}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={cn('object-cover', className)}
    />
  )
}
