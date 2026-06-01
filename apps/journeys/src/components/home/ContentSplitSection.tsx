import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { ContentSplitBlock } from '@repo/payload-types'

import { PayloadImage } from '@/components/media/PayloadImage'
import { JourneysRichText } from '@/components/rich-text/JourneysRichText'
import { isMedia } from '@/lib/media'
import { cn } from '@/lib/utils'

type ContentSplitSectionProps = {
  block: ContentSplitBlock
}

function hasContent(block: ContentSplitBlock): boolean {
  return Boolean(
    block.heading?.trim() ||
      block.lead?.trim() ||
      block.content ||
      isMedia(block.image),
  )
}

export function ContentSplitSection({ block }: ContentSplitSectionProps) {
  if (!hasContent(block)) {
    return null
  }

  const imageOnRight = block.imagePosition === 'right'
  const image = isMedia(block.image) ? block.image : null
  const richContent = block.content as DefaultTypedEditorState | null | undefined

  return (
    <section className="mx-auto w-full max-w-6xl px-[clamp(1.5rem,5vw,4rem)] py-(--space-16) md:py-24">
      <div className="grid items-start gap-(--space-10) md:grid-cols-2 md:gap-(--space-12)">
        {image ? (
          <div
            className={cn(
              'relative aspect-3/4 w-full max-w-md overflow-hidden rounded-lg bg-muted',
              imageOnRight ? 'md:order-2 md:justify-self-end' : 'md:order-1',
            )}
          >
            <PayloadImage
              media={image}
              size="large"
              fill
              sizes="(max-width: 768px) 100vw, 28rem"
              className="object-cover"
            />
          </div>
        ) : null}

        <div
          className={cn(
            'flex flex-col gap-(--space-6)',
            imageOnRight ? 'md:order-1' : 'md:order-2',
            !image && 'md:col-span-2',
          )}
        >
          {block.heading ? (
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {block.heading}
            </h2>
          ) : null}
          {block.lead ? (
            <p className="max-w-xl text-lg leading-relaxed text-foreground">{block.lead}</p>
          ) : null}
          {richContent ? (
            <JourneysRichText data={richContent} className="max-w-xl text-base leading-relaxed" />
          ) : null}
        </div>
      </div>
    </section>
  )
}
