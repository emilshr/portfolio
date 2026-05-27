import { CMSLink } from '@/components/Link'
import type { AlertBannerBlock } from '@/payload-types'
import { cn } from '@/utilities/ui'

type Props = Pick<AlertBannerBlock, 'text' | 'link'>

const bannerClass = cn(
  'my-3 block rounded-md border-[0.5px] border-(--border) px-3.5 py-2.5',
  'bg-[color-mix(in_srgb,var(--border)_12%,transparent)] text-(length:--font-size-s) text-(--text-secondary) no-underline',
  'transition-[background-color,border-color,color] duration-150',
  'hover:border-[color-mix(in_srgb,var(--border)_80%,var(--text-secondary))] hover:bg-[color-mix(in_srgb,var(--border)_24%,transparent)] hover:text-(--text-primary)',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--text-secondary)_50%,transparent)]',
)

function resolveLinkHref(link?: AlertBannerBlock['link']): string | null {
  if (!link) return null

  const { type, reference, url } = link

  if (type === 'reference' && reference?.value && typeof reference.value === 'object' && 'slug' in reference.value) {
    const slug = reference.value.slug
    if (!slug) return null
    return reference.relationTo === 'posts' ? `/${slug}` : slug === 'home' ? '/' : `/${slug}`
  }

  return url || null
}

export function ChiriAlertBanner({ text, link }: Props) {
  const href = resolveLinkHref(link)

  if (!href) {
    return <div className={bannerClass}>{text}</div>
  }

  return (
    <CMSLink className={bannerClass} appearance="inline" {...link}>
      {text}
    </CMSLink>
  )
}
