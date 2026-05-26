import RichText from '@/components/RichText'
import type { AboutBlock as AboutBlockProps } from '@/payload-types'

export const AboutBlockComponent: React.FC<AboutBlockProps> = ({ content }) => {
  if (!content) return null
  return (
    <div className="about prose chiri-about">
      <RichText data={content} enableGutter={false} enableProse />
    </div>
  )
}
