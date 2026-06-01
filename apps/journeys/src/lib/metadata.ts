import type { Metadata } from 'next'

import type { JourneysSetting } from '@repo/payload-types'

import { getAbsoluteMediaUrl, getMediaUrl, isMedia } from '@/lib/media'

const siteName = 'Journeys'

export function getSiteURL(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://burntclutchproject.com').replace(/\/$/, '')
}

export function buildPageMetadata({
  title,
  description,
  path = '',
  image,
}: {
  title: string
  description?: string | null
  path?: string
  image?: string | null
}): Metadata {
  const siteURL = getSiteURL()
  const url = `${siteURL}${path}`
  const metaTitle = title === siteName ? title : `${title} | ${siteName}`

  return {
    title: metaTitle,
    description: description ?? undefined,
    openGraph: {
      title: metaTitle,
      description: description ?? undefined,
      url,
      siteName,
      type: 'website',
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: metaTitle,
      description: description ?? undefined,
      ...(image ? { images: [image] } : {}),
    },
    alternates: { canonical: url },
  }
}

type JourneysHomeSEOSettings = Pick<
  JourneysSetting,
  'heroTitle' | 'heroSubtitle' | 'heroImage' | 'meta'
>

export function journeysHomeMetadata(settings: JourneysHomeSEOSettings): Metadata {
  const title = settings.meta?.title || settings.heroTitle || 'Journeys'
  const description =
    settings.meta?.description || settings.heroSubtitle || 'Travel stories from the road.'
  const metaImage = settings.meta?.image

  const image =
    (isMedia(metaImage) ? getAbsoluteMediaUrl(getMediaUrl(metaImage, 'og')) : null) ||
    (isMedia(settings.heroImage)
      ? getAbsoluteMediaUrl(getMediaUrl(settings.heroImage, 'og'))
      : null)

  return buildPageMetadata({
    title,
    description,
    path: '/',
    image,
  })
}

export function travelMetadata(travel: {
  title: string
  subtitle?: string | null
  excerpt?: string | null
  slug: string
  meta?: {
    title?: string | null
    description?: string | null
    image?: unknown
  } | null
  heroImage?: unknown
  coverImage?: unknown
}): Metadata {
  const title = travel.meta?.title || travel.title
  const description = travel.meta?.description || travel.excerpt || travel.subtitle
  const metaImage = travel.meta?.image
  const image =
    (isMedia(metaImage) ? getAbsoluteMediaUrl(getMediaUrl(metaImage, 'og')) : null) ||
    (isMedia(travel.heroImage) ? getAbsoluteMediaUrl(getMediaUrl(travel.heroImage, 'og')) : null) ||
    (isMedia(travel.coverImage) ? getAbsoluteMediaUrl(getMediaUrl(travel.coverImage, 'og')) : null)

  return buildPageMetadata({
    title,
    description,
    path: `/${travel.slug}`,
    image,
  })
}
