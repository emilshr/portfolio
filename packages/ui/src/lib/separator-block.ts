import { cn } from './utils'

export type SeparatorSpacing = 'none' | 'sm' | 'md' | 'lg'
export type SeparatorOrientation = 'horizontal' | 'vertical'

const spacingClasses: Record<
  SeparatorOrientation,
  Record<SeparatorSpacing, string>
> = {
  horizontal: {
    none: '',
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12',
  },
  vertical: {
    none: '',
    sm: 'px-4',
    md: 'px-8',
    lg: 'px-12',
  },
}

export function separatorBlockWrapperClassName(
  orientation: SeparatorOrientation = 'horizontal',
  spacing: SeparatorSpacing = 'md',
): string {
  return cn(
    'w-full',
    orientation === 'vertical' && 'flex min-h-24 items-stretch justify-center',
    spacingClasses[orientation][spacing],
  )
}
