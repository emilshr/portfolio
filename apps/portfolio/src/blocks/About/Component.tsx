import RichText from '@/components/RichText'
import type { AboutBlock as AboutBlockProps } from '@repo/payload-types'
import { Media } from '@/components/Media'

export const AboutBlockComponent: React.FC<AboutBlockProps> = ({
  avatar,
  content,
  heading,
  subheading,
}) => {
  if (!heading && !subheading && !content && !avatar) return null

  return (
    <div className="about mb-0">
      <div className="flex items-center justify-between gap-8 max-sm:flex-col-reverse max-sm:items-start max-sm:gap-5">
        <div className="min-w-0">
          {heading ? (
            <h1 className="m-0 text-[clamp(2rem,5vw,3.25rem)] font-bold leading-tight tracking-tight text-(--text-primary)">
              {heading}
            </h1>
          ) : null}
          {subheading ? (
            <p className="mt-3 max-w-184 text-[1.05rem] leading-relaxed text-(--text-secondary) max-sm:mt-2.5 max-sm:text-base">
              {subheading}
            </p>
          ) : null}
        </div>

        {avatar && typeof avatar === 'object' ? (
          <div
            className="shrink-0 rounded-full bg-(--selection)/50 p-1 shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-white/40 backdrop-blur-md dark:bg-white/6 dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)] dark:ring-white/12 max-sm:self-start max-sm:p-0.75"
          >
            <div className="relative size-32 overflow-hidden rounded-full border border-border bg-white/5 shadow-inner max-sm:size-19">
              <Media
                resource={avatar}
                fill
                className="size-full"
                pictureClassName="block size-full"
                imgClassName="object-cover"
                size="(max-width: 640px) 76px, 128px"
              />
            </div>
          </div>
        ) : null}
      </div>

      {content ? (
        <div className="prose mt-7 max-sm:mt-5">
          <RichText data={content} enableGutter={false} enableProse />
        </div>
      ) : null}
    </div>
  )
}
