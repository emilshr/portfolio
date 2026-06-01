'use client'

import type { SeparatorBlock } from '@repo/payload-types'
import { Separator } from '@repo/ui/separator'
import {
  separatorBlockWrapperClassName,
  type SeparatorOrientation,
  type SeparatorSpacing,
} from '@repo/ui/lib/separator-block'

type SeparatorSectionProps = {
  block: SeparatorBlock
}

export function SeparatorSection({ block }: SeparatorSectionProps) {
  const resolvedOrientation = (block.orientation ?? 'horizontal') as SeparatorOrientation
  const resolvedSpacing = (block.spacing ?? 'md') as SeparatorSpacing

  return (
    <div
      className={separatorBlockWrapperClassName(resolvedOrientation, resolvedSpacing)}
      aria-hidden
    >
      <Separator orientation={resolvedOrientation} />
    </div>
  )
}
