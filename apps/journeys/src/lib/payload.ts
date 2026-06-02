import { PayloadSDK } from '@payloadcms/sdk'
import type { Config, JourneysSetting, Travel } from '@repo/payload-types'
import { unstable_cache } from 'next/cache'

import { getPayloadApiUrl, isProductionDeploy } from '@/lib/env'
import { getMediaUrl, isMedia } from '@/lib/media'

export type HeaderMenuItem = {
  id: string
  label: string
  url: string
  openInNewTab?: boolean | null
}

type JourneysSettingsSnapshot = Pick<JourneysSetting, 'heroTitle' | 'heroSubtitle' | 'homeLayout'> & {
  headerMenu: HeaderMenuItem[]
}

const getSDK = (): PayloadSDK<Config> | null => {
  const baseURL = getPayloadApiUrl()
  if (!baseURL) {
    if (isProductionDeploy()) {
      console.error(
        '[journeys] Missing PAYLOAD_API_URL / NEXT_PUBLIC_PAYLOAD_API_URL — serving fallback homepage content.',
      )
    }
    return null
  }

  return new PayloadSDK<Config>({ baseURL })
}

const publishedWhere = {
  _status: { equals: 'published' as const },
}

const defaultJourneysSettings: Pick<
  JourneysSettingsSnapshot,
  'heroTitle' | 'heroSubtitle' | 'homeLayout' | 'headerMenu'
> = {
  heroTitle: 'BurntClutchProject',
  heroSubtitle: 'Travel stories from the road.',
  homeLayout: null,
  headerMenu: [],
}

export const getJourneysSettings = unstable_cache(
  async () => {
    const sdk = getSDK()
    if (!sdk) return defaultJourneysSettings
    const settings = await sdk.findGlobal({ slug: 'journeys-settings', depth: 2 })
    const rawMenu = (settings as { headerMenu?: unknown }).headerMenu
    const headerMenu: HeaderMenuItem[] = Array.isArray(rawMenu)
      ? rawMenu.reduce<HeaderMenuItem[]>((acc, item, index) => {
          if (!item || typeof item !== 'object') return acc
          const candidate = item as {
            id?: unknown
            label?: unknown
            url?: unknown
            linkType?: unknown
            internalDestinationType?: unknown
            internalPath?: unknown
            travel?: unknown
            openInNewTab?: unknown
          }
          if (typeof candidate.label !== 'string') return acc

          const label = candidate.label.trim()
          const resolvedInternalUrl = (() => {
            if (candidate.internalDestinationType === 'travel') {
              const travel =
                candidate.travel && typeof candidate.travel === 'object'
                  ? (candidate.travel as { slug?: unknown })
                  : null
              return typeof travel?.slug === 'string' && travel.slug.trim()
                ? `/${travel.slug.trim()}`
                : ''
            }
            if (typeof candidate.internalPath === 'string') return candidate.internalPath.trim()
            if (typeof candidate.url === 'string' && candidate.url.startsWith('/')) {
              return candidate.url.trim()
            }
            return ''
          })()

          const resolvedExternalUrl =
            typeof candidate.url === 'string' && /^https?:\/\//i.test(candidate.url)
              ? candidate.url.trim()
              : ''

          const url =
            candidate.linkType === 'external'
              ? resolvedExternalUrl
              : resolvedInternalUrl || resolvedExternalUrl

          if (!label || !url) return acc

          acc.push({
            id: typeof candidate.id === 'string' ? candidate.id : `header-menu-${index}`,
            label,
            url,
            openInNewTab: Boolean(candidate.openInNewTab),
          })
          return acc
        }, [])
      : []

    return {
      ...settings,
      headerMenu,
    } as JourneysSettingsSnapshot
  },
  ['journeys-settings'],
  { tags: ['journeys-settings'] },
)

export const getPublishedTravels = unstable_cache(
  async (limit?: number) => {
    const sdk = getSDK()
    if (!sdk) return [] as Travel[]
    const result = await sdk.find({
      collection: 'travels',
      depth: 2,
      limit: limit ?? 100,
      sort: '-publishedAt',
      where: publishedWhere,
    })
    return result.docs
  },
  ['published-travels'],
  { tags: ['travels'] },
)

export function getFeaturedTravels(limit = 6): Promise<Travel[]> {
  return unstable_cache(
    async () => {
      const sdk = getSDK()
      if (!sdk) return [] as Travel[]
      const result = await sdk.find({
        collection: 'travels',
        depth: 2,
        limit,
        sort: '-publishedAt',
        where: {
          and: [publishedWhere, { featured: { equals: true } }],
        },
      })
      return result.docs
    },
    ['featured-travels', String(limit)],
    { tags: ['travels'] },
  )()
}

export function getTravelBySlug(slug: string): Promise<Travel | null> {
  return unstable_cache(
    async () => {
      const sdk = getSDK()
      if (!sdk) return null
      const result = await sdk.find({
        collection: 'travels',
        depth: 2,
        limit: 1,
        where: {
          and: [publishedWhere, { slug: { equals: slug } }],
        },
      })
      return result.docs[0] ?? null
    },
    [`travel-${slug}`],
    { tags: ['travels', `travel:${slug}`] },
  )()
}

export const getGalleryItems = unstable_cache(
  async () => {
    const travels = await getPublishedTravels()
    const items: GalleryItem[] = []

    for (const travel of travels) {
      if (!travel.gallery?.length) continue

      for (const entry of travel.gallery) {
        const image = entry.image
        if (!image || typeof image === 'string' || !isMedia(image)) continue

        const url = getMediaUrl(image, 'large')
        const thumbnailUrl = getMediaUrl(image, 'thumbnail')
        if (!url) continue

        items.push({
          id: entry.id || `${travel.id}-${image.id}`,
          url,
          alt: entry.alt || image.alt || travel.title,
          caption: entry.caption,
          travelSlug: travel.slug,
          travelTitle: travel.title,
          thumbnailUrl: thumbnailUrl ?? url,
        })
      }
    }

    return items
  },
  ['gallery-items'],
  { tags: ['gallery', 'travels'] },
)

export type GalleryItem = {
  id: string
  url: string
  thumbnailUrl: string
  alt: string
  caption?: string | null
  travelSlug: string
  travelTitle: string
}
