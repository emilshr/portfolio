import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateExperience: CollectionAfterChangeHook = ({ doc, req }) => {
  if (req.context?.disableRevalidate) return

  if (doc._status === 'published' || doc._status === undefined) {
    revalidatePath('/')
  }
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ req }) => {
  if (req.context?.disableRevalidate) return
  revalidatePath('/')
}
