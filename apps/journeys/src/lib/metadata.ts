import type { Metadata } from 'next'

import type { JourneysSetting } from '@repo/payload-types'

import { getAbsoluteMediaUrl, getMediaUrl, isMedia } from '@/lib/media'

const siteName = 'Journeys'

export function getSiteURL(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://burntclutchproject.com').replace(/\/$/, '')
}

export function formatPageTitle(pageTitle: string, site = siteName): string {
  return pageTitle === site ? pageTitle : `${pageTitle} | ${site}`
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

  return {
    title,
    description: description ?? undefined,
    openGraph: {
      title,
      description: description ?? undefined,
      url,
      siteName,
      type: 'website',
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
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
  const title =
    settings.meta?.title ?? formatPageTitle(settings.heroTitle || siteName)
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
  const title = travel.meta?.title ?? formatPageTitle(travel.title)
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

export function articleMetadata(article: {
  title: string
  excerpt?: string | null
  slug: string
  meta?: {
    title?: string | null
    description?: string | null
    image?: unknown
  } | null
  heroImage?: unknown
}): Metadata {
  const title = article.meta?.title ?? formatPageTitle(article.title)
  const description = article.meta?.description || article.excerpt
  const metaImage = article.meta?.image
  const image =
    (isMedia(metaImage) ? getAbsoluteMediaUrl(getMediaUrl(metaImage, 'og')) : null) ||
    (isMedia(article.heroImage) ? getAbsoluteMediaUrl(getMediaUrl(article.heroImage, 'og')) : null)

  return buildPageMetadata({
    title,
    description,
    path: `/articles/${article.slug}`,
    image,
  })
}

export function vehiclesPageMetadata(vehicle: {
  name: string
  meta?: {
    title?: string | null
    description?: string | null
    image?: unknown
  } | null
  coverImage?: unknown
} | null): Metadata {
  const title = vehicle?.meta?.title ?? formatPageTitle('Vehicles')
  const description = vehicle?.meta?.description || 'Motorcycles and upgrades from my garage.'
  const image =
    (isMedia(vehicle?.meta?.image)
      ? getAbsoluteMediaUrl(getMediaUrl(vehicle.meta.image, 'og'))
      : null) ||
    (isMedia(vehicle?.coverImage) ? getAbsoluteMediaUrl(getMediaUrl(vehicle.coverImage, 'og')) : null)

  return buildPageMetadata({
    title,
    description,
    path: '/vehicles',
    image,
  })
}
