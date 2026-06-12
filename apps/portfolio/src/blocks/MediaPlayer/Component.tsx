'use client'

import type { MediaPlayerBlock as MediaPlayerBlockProps } from '@repo/payload-types'
import dynamic from 'next/dynamic'

const MediaPlayerBlockComponentClient = dynamic(
  () =>
    import('@/blocks/MediaPlayer/Component.client').then((mod) => mod.MediaPlayerBlockComponent),
  {
    ssr: false,
    loading: () => <div className="my-8 h-48 animate-pulse rounded-lg bg-muted" />,
  },
)

type Props = MediaPlayerBlockProps & {
  className?: string
  enableGutter?: boolean
  disableInnerContainer?: boolean
}

export const MediaPlayerBlockComponent: React.FC<Props> = (props) => {
  return <MediaPlayerBlockComponentClient {...props} />
}
