'use client'

import type { SeparatorBlock as SeparatorBlockProps } from '@repo/payload-types'
import { Separator } from '@repo/ui/separator'
import {
  separatorBlockWrapperClassName,
  type SeparatorOrientation,
  type SeparatorSpacing,
} from '@repo/ui/lib/separator-block'

export const SeparatorBlockComponent: React.FC<SeparatorBlockProps> = ({
  orientation = 'horizontal',
  spacing = 'md',
}) => {
  const resolvedOrientation = (orientation ?? 'horizontal') as SeparatorOrientation
  const resolvedSpacing = (spacing ?? 'md') as SeparatorSpacing

  return (
    <div
      className={separatorBlockWrapperClassName(resolvedOrientation, resolvedSpacing)}
      aria-hidden
    >
      <Separator orientation={resolvedOrientation} />
    </div>
  )
}
