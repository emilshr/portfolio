'use client'

import { ImageMedia } from '@/components/Media/ImageMedia'
import type { Media } from '@repo/payload-types'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

type AboutAvatarProps = {
  avatar: Media
}

export function AboutAvatar({ avatar }: AboutAvatarProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="shrink-0 rounded-full bg-(--selection)/50 p-1 shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-white/40 backdrop-blur-md dark:bg-white/6 dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] dark:ring-white/12 max-sm:self-start max-sm:p-0.75">
      <div
        aria-busy={isLoading}
        className="relative size-32 overflow-hidden rounded-full border border-border bg-white/5 shadow-inner max-sm:size-19"
      >
        {isLoading ? (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-(--bg)/50 text-(--text-secondary)"
            role="status"
          >
            <span className="sr-only">Loading avatar</span>
            <div className="animate-spin">
              <Loader2 aria-hidden className="size-5 stroke-current max-sm:size-4" />
            </div>
          </div>
        ) : null}
        <ImageMedia
          resource={avatar}
          fill
          className="size-full"
          pictureClassName="block size-full"
          imgClassName="object-cover"
          size="(max-width: 640px) 76px, 128px"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      </div>
    </div>
  )
}
