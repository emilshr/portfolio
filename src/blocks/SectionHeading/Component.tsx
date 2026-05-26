import type { SectionHeadingBlock as SectionHeadingBlockProps } from '@/payload-types'

export const SectionHeadingBlockComponent: React.FC<SectionHeadingBlockProps> = ({ heading }) => {
  if (!heading) return null
  return <h2 className="section-heading chiri-section-heading">{heading}</h2>
}
