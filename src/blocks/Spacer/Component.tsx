import type { SpacerBlock as SpacerBlockProps } from '@/payload-types'

export const SpacerBlockComponent: React.FC<SpacerBlockProps> = () => {
  return <div className="py-2" aria-hidden />
}
