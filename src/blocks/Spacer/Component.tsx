import type { SpacerBlock as SpacerBlockProps } from '@/payload-types'

const heights = { small: '1rem', medium: '2rem', large: '3rem' }

export const SpacerBlockComponent: React.FC<SpacerBlockProps> = ({ height = 'medium' }) => {
  return <div style={{ height: heights[height as keyof typeof heights] ?? heights.medium }} />
}
