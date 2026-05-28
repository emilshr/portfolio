import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Travel } from '@repo/payload-types'

import { revalidateJourneys } from '@/utilities/revalidateJourneys'

export const revalidateTravel: CollectionAfterChangeHook<Travel> = async ({
  doc,
  previousDoc,
  req: { context },
}) => {
  if (context.disableRevalidate) {
    return doc
  }

  if (doc._status === 'published') {
    await revalidateJourneys({ tags: ['travels', 'gallery', `travel:${doc.slug}`] })
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    await revalidateJourneys({
      tags: ['travels', 'gallery', `travel:${previousDoc.slug}`],
    })
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Travel> = async ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate && doc?.slug) {
    await revalidateJourneys({ tags: ['travels', 'gallery', `travel:${doc.slug}`] })
  }

  return doc
}
