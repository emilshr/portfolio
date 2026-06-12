import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '@repo/payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getSiteSettings } from './getSiteSettings'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args
  const settings = await getSiteSettings()
  const siteName = settings.site.title
  const siteDescription = settings.site.description

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title ?? (doc?.title ? `${doc.title} | ${siteName}` : siteName)

  return {
    description: doc?.meta?.description ?? siteDescription,
    openGraph: mergeOpenGraph(
      {
        description: doc?.meta?.description || siteDescription,
        images: ogImage
          ? [
              {
                url: ogImage,
              },
            ]
          : undefined,
        title,
        url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
      },
      { siteName, description: siteDescription },
    ),
    title,
  }
}
