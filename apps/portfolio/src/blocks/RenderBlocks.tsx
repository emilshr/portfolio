import React, { Fragment, Suspense } from 'react'

import type { Page } from '@repo/payload-types'

import { AlertBannerBlockComponent } from '@/blocks/AlertBanner/Component'
import { AboutBlockComponent } from '@/blocks/About/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContactCTABlockComponent } from '@/blocks/ContactCTA/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { MediaPlayerBlockComponent } from '@/blocks/MediaPlayer/Component'
import { PostListBlockComponent } from '@/blocks/PostList/Component'
import { PostListByYearBlockComponent } from '@/blocks/PostListByYear/Component'
import { SectionHeadingBlockComponent } from '@/blocks/SectionHeading/Component'
import { SeparatorBlockComponent } from '@/blocks/Separator/Component'
import { SpacerBlockComponent } from '@/blocks/Spacer/Component'
import { WorkExperienceBlockComponent } from '@/blocks/WorkExperience/Component'

const blockComponents = {
  alertBanner: AlertBannerBlockComponent,
  about: AboutBlockComponent,
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  contactCTA: ContactCTABlockComponent,
  mediaBlock: MediaBlock,
  mediaPlayer: MediaPlayerBlockComponent,
  postList: PostListBlockComponent,
  postListByYear: PostListByYearBlockComponent,
  sectionHeading: SectionHeadingBlockComponent,
  spacer: SpacerBlockComponent,
  separator: SeparatorBlockComponent,
  workExperience: WorkExperienceBlockComponent,
}

function blockKey(block: NonNullable<Page['layout']>[number], index: number): string {
  if ('id' in block && block.id) return String(block.id)
  return `${block.blockType}-${index}`
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout']
}> = (props) => {
  const { blocks } = props
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (!hasBlocks) return null

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block
        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType as keyof typeof blockComponents]
          if (Block) {
            return (
              <Suspense key={blockKey(block, index)} fallback={null}>
                {/* @ts-expect-error block props vary */}
                <Block {...block} disableInnerContainer />
              </Suspense>
            )
          }
        }

        if (process.env.NODE_ENV === 'development') {
          console.warn(`[RenderBlocks] Unknown block type: ${String(blockType)}`)
        }

        return (
          <p key={blockKey(block, index)} className="text-sm text-muted-foreground">
            This section is unavailable.
          </p>
        )
      })}
    </Fragment>
  )
}
