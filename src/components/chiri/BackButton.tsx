import Link from 'next/link'

import { cn } from '@/utilities/ui'

type Props = {
  href?: string
  label?: string
  className?: string
}

export function BackButton({ href = '/', label = 'Back', className }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        'mb-4 mt-5 inline-block text-(length:--font-size-s) text-(--text-secondary) no-underline',
        className,
      )}
    >
      ← {label}
    </Link>
  )
}
