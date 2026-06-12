import type { JourneysSetting } from '@repo/payload-types'
import { Suspense } from 'react'

import { ContentSplitSection } from '@/components/home/ContentSplitSection'
import { FeaturedTravelsSection } from '@/components/home/FeaturedTravelsSection'
import { ImageMarqueeSection } from '@/components/home/ImageMarqueeSection'
import { MediaPlayerSection } from '@/components/home/MediaPlayerSection'
import { SeparatorSection } from '@/components/home/SeparatorSection'

type RenderHomeBlocksProps = {
  blocks?: JourneysSetting['homeLayout']
}

function FeaturedTravelsFallback() {
  return (
    <section className="page-container py-10" aria-hidden>
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    </section>
  )
}

export function RenderHomeBlocks({ blocks }: RenderHomeBlocksProps) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, index) => {
        const { blockType } = block
        const key = block.id ?? `${blockType}-${index}`

        switch (blockType) {
          case 'contentSplit':
            return <ContentSplitSection key={key} block={block} />
          case 'imageMarquee':
            return <ImageMarqueeSection key={key} block={block} />
          case 'featuredTravels':
            return (
              <Suspense key={key} fallback={<FeaturedTravelsFallback />}>
                <FeaturedTravelsSection block={block} />
              </Suspense>
            )
          case 'separator':
            return <SeparatorSection key={key} block={block} />
          case 'mediaPlayer':
            return <MediaPlayerSection key={key} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}
