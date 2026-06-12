import { PayloadSDK } from '@payloadcms/sdk'
import type {
  Article,
  Config,
  GalleryCollection,
  GallerySetting,
  JourneysSetting,
  Media,
  Vehicle,
} from '@repo/payload-types'
import { unstable_cache } from 'next/cache'

import { getPayloadApiUrl, isProductionDeploy } from '@/lib/env'
import { getMediaUrl, isMedia } from '@/lib/media'

export type HeaderMenuItem = {
  id: string
  label: string
  url: string
  openInNewTab?: boolean | null
}

const FEATURED_ARTICLES_MIN_LIMIT = 1
const FEATURED_ARTICLES_MAX_LIMIT = 12
const FEATURED_ARTICLES_DEFAULT_LIMIT = 6

type JourneysSettingsSnapshot = Pick<
  JourneysSetting,
  'heroTitle' | 'heroSubtitle' | 'homeLayout'
> & {
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

function resolveArticleSlugFromRelationship(value: unknown): string {
  if (!value || typeof value !== 'object') return ''
  const slug = (value as { slug?: unknown }).slug
  return typeof slug === 'string' ? slug.trim() : ''
}

async function safePayloadFetch<T>(label: string, fallback: T, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    console.warn(`[journeys] ${label} failed:`, error)
    return fallback
  }
}

export const getJourneysSettings = unstable_cache(
  async () => {
    const sdk = getSDK()
    if (!sdk) return defaultJourneysSettings

    return safePayloadFetch('getJourneysSettings', defaultJourneysSettings, async () => {
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
              article?: unknown
              travel?: unknown
              openInNewTab?: unknown
            }
            if (typeof candidate.label !== 'string') return acc

            const label = candidate.label.trim()
            const resolvedInternalUrl = (() => {
              if (
                candidate.internalDestinationType === 'article' ||
                candidate.internalDestinationType === 'travel'
              ) {
                const slug =
                  resolveArticleSlugFromRelationship(candidate.article) ||
                  resolveArticleSlugFromRelationship(candidate.travel)
                return slug ? `/articles/${slug}` : ''
              }
              if (typeof candidate.internalPath === 'string') {
                const path = candidate.internalPath.trim()
                if (path === '/posts') return '/articles'
                return path
              }
              if (typeof candidate.url === 'string' && candidate.url.startsWith('/')) {
                const path = candidate.url.trim()
                if (path === '/posts') return '/articles'
                return path
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
    })
  },
  ['journeys-settings'],
  { tags: ['journeys-settings'] },
)

export function getArticleSortTimestamp(article: Article): number {
  const tripStart = article.tripDates?.start
  const publishedAt = article.publishedAt
  const source = tripStart ?? publishedAt
  if (!source) return 0

  const timestamp = new Date(source).getTime()
  return Number.isFinite(timestamp) ? timestamp : 0
}

export function getArticleYear(article: Article): string {
  const source = article.tripDates?.start ?? article.publishedAt
  if (!source) return 'Unknown'
  const year = new Date(source).getFullYear()
  return Number.isFinite(year) ? String(year) : 'Unknown'
}

export const getPublishedArticles = unstable_cache(
  async (limit?: number) => {
    const sdk = getSDK()
    if (!sdk) return [] as Article[]

    return safePayloadFetch('getPublishedArticles', [] as Article[], async () => {
      const result = await sdk.find({
        collection: 'articles',
        depth: 2,
        limit: limit ?? 1000,
        ...publishedAndSorted,
      })
      return result.docs
    })
  },
  ['published-articles'],
  { tags: ['articles'] },
)

export const getPublishedVehicles = unstable_cache(
  async () => {
    const sdk = getSDK()
    if (!sdk) return [] as Vehicle[]

    return safePayloadFetch('getPublishedVehicles', [] as Vehicle[], async () => {
      const result = await sdk.find({
        collection: 'vehicles',
        depth: 2,
        limit: 100,
        ...publishedAndSorted,
      })
      return result.docs
    })
  },
  ['published-vehicles'],
  { tags: ['vehicles'] },
)

function normalizeFeaturedLimit(limit?: number | null): number {
  if (typeof limit !== 'number' || Number.isNaN(limit)) {
    return FEATURED_ARTICLES_DEFAULT_LIMIT
  }

  const normalized = Math.floor(limit)
  return Math.min(FEATURED_ARTICLES_MAX_LIMIT, Math.max(FEATURED_ARTICLES_MIN_LIMIT, normalized))
}

export function getFeaturedArticles(limit = FEATURED_ARTICLES_DEFAULT_LIMIT): Promise<Article[]> {
  const normalizedLimit = normalizeFeaturedLimit(limit)

  return unstable_cache(
    async () => {
      const sdk = getSDK()
      if (!sdk) return [] as Article[]

      return safePayloadFetch('getFeaturedArticles', [] as Article[], async () => {
        const result = await sdk.find({
          collection: 'articles',
          depth: 2,
          limit: 100,
          where: {
            and: [publishedWhere, { featured: { equals: true } }],
          },
        })
        return result.docs
          .sort((a, b) => getArticleSortTimestamp(b) - getArticleSortTimestamp(a))
          .slice(0, normalizedLimit)
      })
    },
    ['featured-articles', String(normalizedLimit)],
    { tags: ['articles'] },
  )()
}

export function getArticleBySlug(slug: string): Promise<Article | null> {
  return unstable_cache(
    async () => {
      const sdk = getSDK()
      if (!sdk) return null

      return safePayloadFetch('getArticleBySlug', null, async () => {
        const result = await sdk.find({
          collection: 'articles',
          depth: 2,
          limit: 1,
          where: {
            and: [publishedWhere, { slug: { equals: slug } }],
          },
        })
        return result.docs[0] ?? null
      })
    },
    [`article-${slug}`],
    { tags: ['articles', `article:${slug}`] },
  )()
}

export const getGallerySettings = unstable_cache(
  async () => {
    const sdk = getSDK()
    if (!sdk) return null

    return safePayloadFetch('getGallerySettings', null, async () => {
      const settings = await sdk.findGlobal({ slug: 'gallery-settings', depth: 2 })
      return settings as GallerySetting
    })
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

export function resolveGalleryCollectionCover(
  collection: GalleryCollection,
): Media | string | null {
  if (isMedia(collection.coverImage)) {
    return collection.coverImage
  }

  const firstImage = collection.images?.[0]
  if (firstImage?.media && isMedia(firstImage.media)) {
    return firstImage.media
  }

  if (typeof firstImage?.media === 'string') {
    return firstImage.media
  }

  return null
}

export const getPublishedGalleryCollections = unstable_cache(
  async () => {
    const sdk = getSDK()
    if (!sdk) return [] as GalleryCollection[]

    return safePayloadFetch(
      'getPublishedGalleryCollections',
      [] as GalleryCollection[],
      async () => {
        const result = await sdk.find({
          collection: 'gallery-collections',
          depth: 2,
          limit: 100,
          ...publishedAndSorted,
        })
        return result.docs
      },
    )
  },
  ['published-gallery-collections'],
  { tags: ['gallery', 'gallery-collections'] },
)

export function getGalleryCollectionBySlug(slug: string): Promise<GalleryCollection | null> {
  return unstable_cache(
    async () => {
      const sdk = getSDK()
      if (!sdk) return null

      return safePayloadFetch('getGalleryCollectionBySlug', null, async () => {
        const result = await sdk.find({
          collection: 'gallery-collections',
          depth: 2,
          limit: 1,
          where: {
            and: [publishedWhere, { slug: { equals: slug } }],
          },
        })
        return result.docs[0] ?? null
      })
    },
    [`gallery-collection-${slug}`],
    { tags: ['gallery', 'gallery-collections', `gallery-collection:${slug}`] },
  )()
}

export type GalleryCollectionImageItem = {
  id: string
  url: string
  thumbnailUrl: string
  alt: string
  caption?: string | null
  kind: 'image' | 'video'
  mimeType: string | null
}

export function mapGalleryCollectionImages(
  collection: GalleryCollection,
): GalleryCollectionImageItem[] {
  const items: GalleryCollectionImageItem[] = []

  for (const entry of collection.images ?? []) {
    const media = entry.media
    if (!media || typeof media === 'string' || !isMedia(media)) continue
    const url = getMediaUrl(media, 'large')
    if (!url) continue
    const thumbnailUrl = getMediaUrl(media, 'card') || getMediaUrl(media, 'medium') || url
    const mimeType = media.mimeType ?? null
    const kind = mimeType?.startsWith('video/') ? 'video' : 'image'

    items.push({
      id: media.id,
      url,
      thumbnailUrl,
      alt: entry.alt || media.alt || collection.title,
      caption: entry.caption || null,
      kind,
      mimeType,
    })
  }

  return items
}
