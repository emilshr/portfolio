import type { Media } from '@repo/payload-types'

import { getPayloadApiUrl } from '@/lib/env'

type MediaSize = 'thumbnail' | 'card' | 'hero' | 'large' | 'medium' | 'small' | 'og'

/** CMS origin (portfolio), derived from Payload API URL without the `/api` suffix. */
export function getPayloadServerURL(): string {
  const apiUrl = getPayloadApiUrl() || 'http://localhost:3000/api'
  return apiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '')
}

/**
 * Normalizes Payload media paths for same-origin use on the journeys site.
 *
 * `/api/media/...` stays relative so the Next.js rewrite proxies to portfolio and
 * `<audio>` / `<video>` avoid cross-origin issues. External CDN URLs pass through.
 */
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url

  const path = url.startsWith('/') ? url : `/${url}`

  if (path.startsWith('/api/media/')) {
    return path
  }

  return `${getPayloadServerURL()}${path}`
}

/** Absolute URL for Open Graph / metadata (not passed through next/image). */
export function getAbsoluteMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url

  const path = url.startsWith('/') ? url : `/${url}`
  const mediaBaseURL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, '')

  if (path.startsWith('/api/media/')) {
    return mediaBaseURL ? `${mediaBaseURL}${path}` : `${getPayloadServerURL()}${path}`
  }

  return `${getPayloadServerURL()}${path}`
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

/** CSS object-position from Payload focal point (0–100%, default center). */
export function getMediaObjectPosition(media: Media): string {
  const x = typeof media.focalX === 'number' ? media.focalX : 50
  const y = typeof media.focalY === 'number' ? media.focalY : 50
  return `${x}% ${y}%`
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
