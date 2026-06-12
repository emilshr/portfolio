'use client'

import type { MediaPlayerBlock } from '@repo/payload-types'
import dynamic from 'next/dynamic'

const MediaPlayerSectionClient = dynamic(
  () =>
    import('@/components/home/MediaPlayerSection.client').then((mod) => mod.MediaPlayerSectionClient),
  {
    ssr: false,
    loading: () => <section className="my-10 h-48 animate-pulse rounded-lg bg-muted px-4 md:px-6" />,
  },
)

type MediaPlayerSectionProps = {
  block: MediaPlayerBlock
}

export function MediaPlayerSection({ block }: MediaPlayerSectionProps) {
  return <MediaPlayerSectionClient block={block} />
}
