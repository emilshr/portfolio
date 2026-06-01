import type { Media } from '@repo/payload-types'

type MediaSize = 'thumbnail' | 'card' | 'hero' | 'large' | 'medium' | 'small' | 'og'

/** CMS origin (portfolio), derived from PAYLOAD_API_URL without the /api suffix. */
export function getPayloadServerURL(): string {
  const apiUrl =
    process.env.PAYLOAD_API_URL ||
    process.env.NEXT_PUBLIC_PAYLOAD_API_URL ||
    'http://localhost:3000/api'

  return apiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '')
}

/**
 * Normalizes Payload media paths for use with next/image.
 *
 * `/api/media/...` stays relative so Next.js treats it as local (see localPatterns +
 * rewrites in next.config.ts). Absolute CMS URLs are avoided because Next.js 16 blocks
 * private IPs when optimizing remote images.
 */
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url

  const path = url.startsWith('/') ? url : `/${url}`
  const mediaBaseURL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, '')

  if (path.startsWith('/api/media/')) {
    return mediaBaseURL ? `${mediaBaseURL}${path}` : path
  }

  return `${getPayloadServerURL()}${path}`
}

/** Absolute URL for Open Graph / metadata (not passed through next/image). */
export function getAbsoluteMediaUrl(url: string | null | undefined): string | null {
  const resolved = resolveMediaUrl(url)
  if (!resolved) return null
  if (/^https?:\/\//i.test(resolved)) return resolved
  return `${getPayloadServerURL()}${resolved}`
}

export function isMedia(value: unknown): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

export function getMediaUrl(
  media: string | Media | null | undefined,
  size?: MediaSize,
): string | null {
  if (!media) return null
  if (typeof media === 'string') return null

  const raw = (size && media.sizes?.[size]?.url ? media.sizes[size].url : null) ?? media.url ?? null

  return resolveMediaUrl(raw)
}

export function getMediaAlt(media: string | Media | null | undefined, fallback = ''): string {
  if (!media || typeof media === 'string') return fallback
  return media.alt || fallback
}

export function formatLocation(
  location?: {
    city?: string | null
    country?: string | null
  } | null,
): string | null {
  if (!location) return null
  const parts = [location.city, location.country].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : null
}

export function formatTripDates(
  dates?: {
    start?: string | null
    end?: string | null
  } | null,
): string | null {
  if (!dates?.start && !dates?.end) return null

  const formatter = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  if (dates.start && dates.end) {
    return `${formatter.format(new Date(dates.start))} – ${formatter.format(new Date(dates.end))}`
  }

  if (dates.start) {
    return formatter.format(new Date(dates.start))
  }

  return dates.end ? formatter.format(new Date(dates.end)) : null
}
