import React, { Fragment } from 'react'

import type { Page } from '@repo/payload-types'

import { AlertBannerBlockComponent } from '@/blocks/AlertBanner/Component'
import { AboutBlockComponent } from '@/blocks/About/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContactCTABlockComponent } from '@/blocks/ContactCTA/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PostListBlockComponent } from '@/blocks/PostList/Component'
import { PostListByYearBlockComponent } from '@/blocks/PostListByYear/Component'
import { SectionHeadingBlockComponent } from '@/blocks/SectionHeading/Component'
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
  postList: PostListBlockComponent,
  postListByYear: PostListByYearBlockComponent,
  sectionHeading: SectionHeadingBlockComponent,
  spacer: SpacerBlockComponent,
  workExperience: WorkExperienceBlockComponent,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout']
}> = async (props) => {
  const { blocks } = props
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (!hasBlocks) return null

  return (
    <Fragment>
      {await Promise.all(
        blocks.map(async (block, index) => {
          const { blockType } = block
          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof typeof blockComponents]
            if (Block) {
              return (
                <Fragment key={index}>
                  {/* @ts-expect-error block props vary */}
                  <Block {...block} disableInnerContainer />
                </Fragment>
              )
            }
          }
          return null
        }),
      )}
    </Fragment>
  )
}
