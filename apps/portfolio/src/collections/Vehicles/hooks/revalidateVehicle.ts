import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateJourneys } from '@/utilities/revalidateJourneys'

export const revalidateVehicle: CollectionAfterChangeHook = async ({ doc, req: { context } }) => {
  if (context.disableRevalidate) {
    return doc
  }

  if (doc._status === 'published') {
    await revalidateJourneys({ tags: ['vehicles'] })
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = async ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    await revalidateJourneys({ tags: ['vehicles'] })
  }

  return doc
}
