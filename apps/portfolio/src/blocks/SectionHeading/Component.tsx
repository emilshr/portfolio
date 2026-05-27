import type { SectionHeadingBlock as SectionHeadingBlockProps } from '@repo/payload-types'

import { sectionHeading } from '@/components/chiri/classNames'

export const SectionHeadingBlockComponent: React.FC<SectionHeadingBlockProps> = ({ heading }) => {
  if (!heading) return null
  return <h2 className={sectionHeading}>{heading}</h2>
}
