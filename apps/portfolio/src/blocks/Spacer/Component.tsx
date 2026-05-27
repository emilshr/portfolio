import type { SpacerBlock as SpacerBlockProps } from '@repo/payload-types'

export const SpacerBlockComponent: React.FC<SpacerBlockProps> = () => {
  return <div className="py-2" aria-hidden />
}
