'use client'

import type { ImageMarqueeBlock } from '@repo/payload-types'
import dynamic from 'next/dynamic'

const ImageMarqueeSectionClient = dynamic(
  () =>
    import('@/components/home/ImageMarqueeSection.client').then((mod) => mod.ImageMarqueeSectionClient),
  {
    ssr: false,
    loading: () => <section className="h-40 w-full animate-pulse bg-muted py-10" />,
  },
)

type ImageMarqueeSectionProps = {
  block: ImageMarqueeBlock
}

export function ImageMarqueeSection({ block }: ImageMarqueeSectionProps) {
  return <ImageMarqueeSectionClient block={block} />
}
