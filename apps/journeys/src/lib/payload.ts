import { PayloadSDK } from '@payloadcms/sdk'
import type { Article, Config, GallerySetting, JourneysSetting, Travel, Vehicle } from '@repo/payload-types'
import { unstable_cache } from 'next/cache'

import { getPayloadApiUrl, isProductionDeploy } from '@/lib/env'
import { getMediaUrl, isMedia } from '@/lib/media'

export type HeaderMenuItem = {
  id: string
  label: string
  url: string
  openInNewTab?: boolean | null
}

const FEATURED_TRAVELS_MIN_LIMIT = 1
const FEATURED_TRAVELS_MAX_LIMIT = 12
const FEATURED_TRAVELS_DEFAULT_LIMIT = 6

type JourneysSettingsSnapshot = Pick<JourneysSetting, 'heroTitle' | 'heroSubtitle' | 'homeLayout'> & {
  headerMenu: HeaderMenuItem[]
}

type RichTextNode = {
  text?: string | null
  children?: RichTextNode[] | null
}

function extractPlainTextFromRichText(node: RichTextNode | null | undefined): string {
  if (!node) return ''

  const chunks: string[] = []

  const visit = (current: RichTextNode) => {
    if (typeof current.text === 'string' && current.text.trim()) {
      chunks.push(current.text.trim())
    }
    if (Array.isArray(current.children)) {
      current.children.forEach(visit)
    }
  }

  visit(node)
  return chunks.join(' ').trim()
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

const publishedAndSorted = {
  where: publishedWhere,
  sort: '-publishedAt',
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
      ...publishedAndSorted,
    })
    return result.docs
  },
  ['published-travels'],
  { tags: ['travels'] },
)

export const getPublishedArticles = unstable_cache(
  async (limit?: number) => {
    const sdk = getSDK()
    if (!sdk) return [] as Article[]
    const result = await sdk.find({
      collection: 'articles',
      depth: 2,
      limit: limit ?? 100,
      ...publishedAndSorted,
    })
    return result.docs
  },
  ['published-articles'],
  { tags: ['articles'] },
)

export const getPublishedVehicles = unstable_cache(
  async () => {
    const sdk = getSDK()
    if (!sdk) return [] as Vehicle[]
    const result = await sdk.find({
      collection: 'vehicles',
      depth: 2,
      limit: 100,
      ...publishedAndSorted,
    })
    return result.docs
  },
  ['published-vehicles'],
  { tags: ['vehicles'] },
)

function normalizeFeaturedLimit(limit?: number | null): number {
  if (typeof limit !== 'number' || Number.isNaN(limit)) {
    return FEATURED_TRAVELS_DEFAULT_LIMIT
  }

  const normalized = Math.floor(limit)
  return Math.min(FEATURED_TRAVELS_MAX_LIMIT, Math.max(FEATURED_TRAVELS_MIN_LIMIT, normalized))
}

function getTravelSortTimestamp(travel: Travel): number {
  const tripStart = travel.tripDates?.start
  const publishedAt = travel.publishedAt
  const source = tripStart ?? publishedAt
  if (!source) return 0

  const timestamp = new Date(source).getTime()
  return Number.isFinite(timestamp) ? timestamp : 0
}

export function getFeaturedTravels(limit = FEATURED_TRAVELS_DEFAULT_LIMIT): Promise<Travel[]> {
  const normalizedLimit = normalizeFeaturedLimit(limit)

  return unstable_cache(
    async () => {
      const sdk = getSDK()
      if (!sdk) return [] as Travel[]
      const result = await sdk.find({
        collection: 'travels',
        depth: 2,
        limit: 100,
        where: {
          and: [publishedWhere, { featured: { equals: true } }],
        },
      })
      return result.docs
        .sort((a, b) => getTravelSortTimestamp(b) - getTravelSortTimestamp(a))
        .slice(0, normalizedLimit)
    },
    ['featured-travels', String(normalizedLimit)],
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

export function getArticleBySlug(slug: string): Promise<Article | null> {
  return unstable_cache(
    async () => {
      const sdk = getSDK()
      if (!sdk) return null
      const result = await sdk.find({
        collection: 'articles',
        depth: 2,
        limit: 1,
        where: {
          and: [publishedWhere, { slug: { equals: slug } }],
        },
      })
      return result.docs[0] ?? null
    },
    [`article-${slug}`],
    { tags: ['articles', `article:${slug}`] },
  )()
}

export const getGallerySettings = unstable_cache(
  async () => {
    const sdk = getSDK()
    if (!sdk) return null
    const settings = await sdk.findGlobal({ slug: 'gallery-settings', depth: 2 })
    return settings as GallerySetting
  },
  ['gallery-settings'],
  { tags: ['gallery-settings'] },
)

export const getLatestVehicleForMetadata = unstable_cache(
  async () => {
    const vehicles = await getPublishedVehicles()
    return vehicles[0] ?? null
  },
  ['latest-vehicle-metadata'],
  { tags: ['vehicles'] },
)

export const getGalleryItems = unstable_cache(
  async () => {
    const sdk = getSDK()
    if (!sdk) return [] as GalleryItem[]

    const [settings, travels, articles] = await Promise.all([
      getGallerySettings(),
      getPublishedTravels(),
      getPublishedArticles(),
    ])

    const folderId =
      settings?.folder && typeof settings.folder === 'object' ? settings.folder.id : settings?.folder

    if (!folderId) return [] as GalleryItem[]

    const mediaResult = await sdk.find({
      collection: 'media',
      depth: 1,
      limit: 500,
      sort: '-createdAt',
      where: {
        folder: { equals: folderId },
      },
    })

    const sourceByMediaId = new Map<string, GalleryItem['source']>()

    for (const travel of travels) {
      if (!travel.gallery?.length) continue
      for (const entry of travel.gallery) {
        const media = entry.media || entry.image
        if (!media || typeof media === 'string' || !isMedia(media)) continue
        if (!sourceByMediaId.has(media.id)) {
          sourceByMediaId.set(media.id, {
            type: 'travel',
            href: `/${travel.slug}`,
            title: travel.title,
          })
        }
      }
    }

    for (const article of articles) {
      if (!article.gallery?.length) continue
      for (const entry of article.gallery) {
        const media = entry.media
        if (!media || typeof media === 'string' || !isMedia(media)) continue
        if (!sourceByMediaId.has(media.id)) {
          sourceByMediaId.set(media.id, {
            type: 'article',
            href: `/articles/${article.slug}`,
            title: article.title,
          })
        }
      }
    }

    const items: GalleryItem[] = []

    for (const media of mediaResult.docs) {
      if (!isMedia(media)) continue
      const url = getMediaUrl(media, 'large')
      if (!url) continue
      const thumbnailUrl = getMediaUrl(media, 'card') || getMediaUrl(media, 'medium') || url
      const mimeType = media.mimeType ?? null
      const kind = mimeType?.startsWith('video/') ? 'video' : 'image'
      const mediaCaption = extractPlainTextFromRichText((media.caption?.root as RichTextNode | undefined) ?? null)
      const source = sourceByMediaId.get(media.id) ?? null

      items.push({
        id: media.id,
        url,
        alt: media.alt || 'Gallery media',
        caption: mediaCaption || null,
        thumbnailUrl,
        kind,
        mimeType,
        source,
      })
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
  kind: 'image' | 'video'
  mimeType: string | null
  source?: {
    type: 'article' | 'travel'
    href: string
    title: string
  } | null
}
