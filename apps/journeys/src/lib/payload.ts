import { PayloadSDK } from '@payloadcms/sdk'
import type {
  Article,
  Config,
  GallerySetting,
  JourneysSetting,
  Media,
  Vehicle,
} from '@repo/payload-types'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import { getPayloadApiUrl, isProductionDeploy } from '@/lib/env'
import { getMediaUrl } from '@/lib/media'

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

const articleListSelect = {
  title: true,
  slug: true,
  publishedAt: true,
  excerpt: true,
  subtitle: true,
  heroImage: true,
  coverImage: true,
  featured: true,
  tripDates: true,
  location: true,
  tags: true,
  meta: true,
  updatedAt: true,
  createdAt: true,
} as const

const articleDetailSelect = {
  ...articleListSelect,
  content: true,
  gallery: true,
} as const

const vehicleListSelect = {
  name: true,
  slug: true,
  odometer: true,
  publishedAt: true,
  coverImage: true,
  details: true,
  meta: true,
  updatedAt: true,
  createdAt: true,
} as const

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

const getJourneysSettingsUncached = unstable_cache(
  async () => {
    const sdk = getSDK()
    if (!sdk) return defaultJourneysSettings

    return safePayloadFetch('getJourneysSettings', defaultJourneysSettings, async () => {
      const settings = await sdk.findGlobal({ slug: 'journeys-settings', depth: 1 })
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

export const getJourneysSettings = cache(getJourneysSettingsUncached)

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

const PUBLISHED_ARTICLES_DEFAULT_LIMIT = 100

export function getPublishedArticles(limit = PUBLISHED_ARTICLES_DEFAULT_LIMIT): Promise<Article[]> {
  const normalizedLimit = Math.max(1, Math.floor(limit))

  return unstable_cache(
    async () => {
      const sdk = getSDK()
      if (!sdk) return [] as Article[]

      return safePayloadFetch('getPublishedArticles', [] as Article[], async () => {
        const result = await sdk.find({
          collection: 'articles',
          depth: 1,
          limit: normalizedLimit,
          select: articleListSelect,
          ...publishedAndSorted,
        })
        return result.docs as Article[]
      })
    },
    ['published-articles', String(normalizedLimit)],
    { tags: ['articles'] },
  )()
}

export const getPublishedVehicles = unstable_cache(
  async () => {
    const sdk = getSDK()
    if (!sdk) return [] as Vehicle[]

    return safePayloadFetch('getPublishedVehicles', [] as Vehicle[], async () => {
      const result = await sdk.find({
        collection: 'vehicles',
        depth: 1,
        limit: 100,
        select: vehicleListSelect,
        ...publishedAndSorted,
      })
      return result.docs as Vehicle[]
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
          depth: 1,
          limit: normalizedLimit,
          sort: '-publishedAt',
          select: articleListSelect,
          where: {
            and: [publishedWhere, { featured: { equals: true } }],
          },
        })
        return result.docs as Article[]
      })
    },
    ['featured-articles', String(normalizedLimit)],
    { tags: ['articles'] },
  )()
}

export async function getArticleBySlug(slug: string, draft = false): Promise<Article | null> {
  if (draft) {
    const sdk = getSDK()
    if (!sdk) return null

    return safePayloadFetch('getArticleBySlug', null, async () => {
      const result = await sdk.find({
        collection: 'articles',
        depth: 2,
        draft: true,
        limit: 1,
        select: articleDetailSelect,
        where: {
          slug: { equals: slug },
        },
      })
      return (result.docs[0] as Article | undefined) ?? null
    })
  }

  return unstable_cache(
    async () => {
      const sdk = getSDK()
      if (!sdk) return null

      return safePayloadFetch('getArticleBySlug', null, async () => {
        const result = await sdk.find({
          collection: 'articles',
          depth: 2,
          limit: 1,
          select: articleDetailSelect,
          where: {
            and: [publishedWhere, { slug: { equals: slug } }],
          },
        })
        return (result.docs[0] as Article | undefined) ?? null
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

export const GALLERY_PAGE_LIMIT = 24

export type GalleryFolderMediaItem = {
  id: string
  url: string
  thumbnailUrl: string
  alt: string
  kind: 'image' | 'video'
  mimeType: string | null
}

export type GalleryFolderMediaPage = {
  items: GalleryFolderMediaItem[]
  hasNextPage: boolean
  page: number
  totalDocs: number
}

function resolveGalleryFolderId(folder: GallerySetting['folder'] | null | undefined): string | null {
  if (!folder) return null
  return typeof folder === 'object' ? folder.id : folder
}

function mapMediaToGalleryItem(media: Media): GalleryFolderMediaItem | null {
  const url = getMediaUrl(media, 'large')
  if (!url) return null

  const thumbnailUrl = getMediaUrl(media, 'card') || getMediaUrl(media, 'medium') || url
  const mimeType = media.mimeType ?? null
  const kind = mimeType?.startsWith('video/') ? 'video' : 'image'

  return {
    id: media.id,
    url,
    thumbnailUrl,
    alt: media.alt || '',
    kind,
    mimeType,
  }
}

const emptyGalleryFolderMediaPage = (page: number): GalleryFolderMediaPage => ({
  items: [],
  hasNextPage: false,
  page,
  totalDocs: 0,
})

async function fetchGalleryFolderMediaPage({
  page,
  limit,
}: {
  page: number
  limit: number
}): Promise<GalleryFolderMediaPage> {
  const sdk = getSDK()
  if (!sdk) return emptyGalleryFolderMediaPage(page)

  return safePayloadFetch('getGalleryFolderMediaPage', emptyGalleryFolderMediaPage(page), async () => {
    const settings = await getGallerySettings()
    const folderId = resolveGalleryFolderId(settings?.folder)
    if (!folderId) return emptyGalleryFolderMediaPage(page)

    const result = await sdk.find({
      collection: 'media',
      depth: 0,
      limit,
      page,
      sort: '-createdAt',
      where: {
        folder: { equals: folderId },
      },
    })

    const items = (result.docs as Media[])
      .map(mapMediaToGalleryItem)
      .filter((item): item is GalleryFolderMediaItem => item !== null)

    return {
      items,
      hasNextPage: Boolean(result.hasNextPage),
      page: result.page ?? page,
      totalDocs: result.totalDocs ?? items.length,
    }
  })
}

export function getGalleryFolderMediaPage({
  page,
  limit = GALLERY_PAGE_LIMIT,
}: {
  page: number
  limit?: number
}): Promise<GalleryFolderMediaPage> {
  if (page === 1 && limit === GALLERY_PAGE_LIMIT) {
    return unstable_cache(
      () => fetchGalleryFolderMediaPage({ page: 1, limit: GALLERY_PAGE_LIMIT }),
      ['gallery-folder-media-page-1'],
      { tags: ['gallery', 'gallery-settings'] },
    )()
  }

  return fetchGalleryFolderMediaPage({ page, limit })
}
