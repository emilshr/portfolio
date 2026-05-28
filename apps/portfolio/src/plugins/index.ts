import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

import { Page, Post, Travel } from '@repo/payload-types'
import { getJourneysSiteURL } from '@/utilities/getJourneysSiteURL'
import { getServerSideURL } from '@/utilities/getURL'
import { storagePlugins } from '@/storage'

const generateTitle: GenerateTitle<Post | Page | Travel> = ({ doc, collectionSlug }) => {
  if (!doc?.title) {
    return collectionSlug === 'travels' ? 'Journeys' : 'Emil'
  }

  if (collectionSlug === 'travels') {
    return `${doc.title} | Journeys`
  }

  return `${doc.title} | Emil`
}

const generateURL: GenerateURL<Post | Page | Travel> = ({ doc, collectionSlug }) => {
  if (collectionSlug === 'travels') {
    const journeysURL = getJourneysSiteURL()
    if (!doc?.slug) return journeysURL
    return `${journeysURL}/${doc.slug}`
  }

  const url = getServerSideURL()
  if (!doc?.slug) return url
  if (doc.slug === 'home') return url
  return `${url}/${doc.slug}`
}

export const plugins: Plugin[] = [
  ...storagePlugins,
  redirectsPlugin({
    collections: ['pages', 'posts', 'travels'],
    overrides: {
      // @ts-expect-error - valid override
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
]
