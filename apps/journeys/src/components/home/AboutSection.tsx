import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { JourneysSetting } from '@repo/payload-types'

import { PayloadImage } from '@/components/media/PayloadImage'
import { JourneysRichText } from '@/components/rich-text/JourneysRichText'
import { isMedia } from '@/lib/media'
import { cn } from '@/lib/utils'

type AboutSettings = Pick<
  JourneysSetting,
  'aboutHeading' | 'aboutLead' | 'aboutImage' | 'aboutContent' | 'aboutImagePosition'
>

type AboutSectionProps = {
  settings: AboutSettings
}

function hasAboutContent(settings: AboutSettings): boolean {
  return Boolean(
    settings.aboutHeading?.trim() ||
      settings.aboutLead?.trim() ||
      settings.aboutContent ||
      isMedia(settings.aboutImage),
  )
}

export function AboutSection({ settings }: AboutSectionProps) {
  if (!hasAboutContent(settings)) {
    return null
  }

  const imageOnRight = settings.aboutImagePosition === 'right'
  const aboutImage = isMedia(settings.aboutImage) ? settings.aboutImage : null
  const aboutContent = settings.aboutContent as DefaultTypedEditorState | null | undefined

  return (
    <section className="mx-auto w-full max-w-6xl px-[clamp(1.5rem,5vw,4rem)] py-(--space-16) md:py-24">
      <div className="grid items-start gap-(--space-10) md:grid-cols-2 md:gap-(--space-12)">
        {aboutImage ? (
          <div
            className={cn(
              'relative aspect-3/4 w-full max-w-md overflow-hidden rounded-lg bg-muted',
              imageOnRight ? 'md:order-2 md:justify-self-end' : 'md:order-1',
            )}
          >
            <PayloadImage
              media={aboutImage}
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
            !aboutImage && 'md:col-span-2',
          )}
        >
          {settings.aboutHeading ? (
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {settings.aboutHeading}
            </h2>
          ) : null}
          {settings.aboutLead ? (
            <p className="max-w-xl text-lg leading-relaxed text-foreground">
              {settings.aboutLead}
            </p>
          ) : null}
          {aboutContent ? (
            <JourneysRichText data={aboutContent} className="max-w-xl text-base leading-relaxed" />
          ) : null}
        </div>
      </div>
    </section>
  )
}
