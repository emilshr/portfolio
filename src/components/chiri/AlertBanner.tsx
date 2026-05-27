import { CMSLink } from '@/components/Link'
import type { AlertBannerBlock } from '@/payload-types'

type Props = Pick<AlertBannerBlock, 'text' | 'link'>

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
  const className = 'chiri-alert-banner'

  if (!href) {
    return <div className={className}>{text}</div>
  }

  return (
    <CMSLink className={className} appearance="inline" {...link}>
      {text}
    </CMSLink>
  )
}
