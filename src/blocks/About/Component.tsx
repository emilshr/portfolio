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
    <div className="about chiri-about">
      <div className="chiri-about__header">
        <div className="chiri-about__headerText">
          {heading ? <h1 className="chiri-about__title">{heading}</h1> : null}
          {subheading ? <p className="chiri-about__subtitle">{subheading}</p> : null}
        </div>

        {avatar && typeof avatar === 'object' ? (
          <div className="chiri-about__avatar">
            <Media resource={avatar} imgClassName="chiri-about__avatarImg" />
          </div>
        ) : null}
      </div>

      {content ? (
        <div className="chiri-about__body prose">
          <RichText data={content} enableGutter={false} enableProse />
        </div>
      ) : null}
    </div>
  )
}
