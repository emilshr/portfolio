import type { Config } from '@repo/payload-types'

import { unstable_cache } from 'next/cache'

import { getPublicPayload, PUBLIC_PAYLOAD_QUERY } from './payloadPublicQuery'

type Collection = keyof Config['collections']

async function getDocumentBySlug(collection: Collection, slug: string, depth = 0) {
  const payload = await getPublicPayload()

  const result = await payload.find({
    collection,
    depth,
    limit: 1,
    pagination: false,
    ...PUBLIC_PAYLOAD_QUERY,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs[0] ?? null
}

async function getDocumentById(collection: Collection, id: string, depth = 0) {
  const payload = await getPublicPayload()

  try {
    return await payload.findByID({
      collection,
      id,
      depth,
      ...PUBLIC_PAYLOAD_QUERY,
    })
  } catch {
    return null
  }
}

export const getCachedDocumentBySlug = (collection: Collection, slug: string) =>
  unstable_cache(async () => getDocumentBySlug(collection, slug), [collection, slug], {
    tags: [`${collection}_${slug}`],
  })

export const getCachedDocumentById = (collection: Collection, id: string) =>
  unstable_cache(async () => getDocumentById(collection, id), [collection, id], {
    tags: [`${collection}_id_${id}`],
  })

/** @deprecated Use getCachedDocumentBySlug or getCachedDocumentById */
export const getCachedDocument = getCachedDocumentBySlug
