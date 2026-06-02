import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateJourneys } from '@/utilities/revalidateJourneys'

export const revalidateArticle: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req: { context },
}) => {
  if (context.disableRevalidate) {
    return doc
  }

  if (doc._status === 'published' && doc.slug) {
    await revalidateJourneys({ tags: ['articles', 'gallery', `article:${doc.slug}`] })
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published' && previousDoc.slug) {
    await revalidateJourneys({
      tags: ['articles', 'gallery', `article:${previousDoc.slug}`],
    })
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = async ({ doc, req: { context } }) => {
  if (!context.disableRevalidate && doc?.slug) {
    await revalidateJourneys({ tags: ['articles', 'gallery', `article:${doc.slug}`] })
  }

  return doc
}
