import type { JourneysSetting } from '@repo/payload-types'

import { FeaturedTravelsSection } from '@/components/home/FeaturedTravelsSection'
import { ImageMarqueeSection } from '@/components/home/ImageMarqueeSection'

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
          default:
            return null
        }
      })}
    </>
  )
}
