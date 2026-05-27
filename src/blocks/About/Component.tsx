import RichText from '@/components/RichText'
import type { AboutBlock as AboutBlockProps } from '@/payload-types'
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
      <div className="flex items-start justify-between gap-8 max-sm:flex-col max-sm:gap-5">
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
          <div className="size-21 shrink-0 overflow-hidden rounded-full border border-border bg-white/5 shadow-lg max-sm:size-19">
            <Media resource={avatar} imgClassName="size-full object-cover" />
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
