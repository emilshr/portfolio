import Link from 'next/link'

type Props = {
  href?: string
  label?: string
}

export function BackButton({ href = '/', label = 'Back' }: Props) {
  return (
    <Link href={href} className="back-button">
      ← {label}
    </Link>
  )
}
