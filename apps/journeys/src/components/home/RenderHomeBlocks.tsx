import type { JourneysSetting } from '@repo/payload-types'

import { FeaturedTravelsSection } from '@/components/home/FeaturedTravelsSection'
import { ImageMarqueeSection } from '@/components/home/ImageMarqueeSection'
import { MediaPlayerSection } from '@/components/home/MediaPlayerSection'
import { SeparatorSection } from '@/components/home/SeparatorSection'

type RenderHomeBlocksProps = {
  blocks?: JourneysSetting['homeLayout']
}

export function RenderHomeBlocks({ blocks }: RenderHomeBlocksProps) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, index) => {
        const { blockType } = block

        switch (blockType) {
          case 'imageMarquee':
            return (
              <ImageMarqueeSection
                key={block.id ?? `imageMarquee-${index}`}
                block={block}
              />
            )
          case 'featuredTravels':
            return (
              <FeaturedTravelsSection
                key={block.id ?? `featuredTravels-${index}`}
                block={block}
              />
            )
          case 'separator':
            return (
              <SeparatorSection key={block.id ?? `separator-${index}`} block={block} />
            )
          case 'mediaPlayer':
            return (
              <MediaPlayerSection
                key={block.id ?? `mediaPlayer-${index}`}
                block={block}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
