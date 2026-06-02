import type { GlobalAfterChangeHook } from 'payload'

import { revalidateJourneys } from '@/utilities/revalidateJourneys'

export const revalidateGallerySettings: GlobalAfterChangeHook = async ({ req }) => {
  if (req.context.disableRevalidate) {
    return
  }

  await revalidateJourneys({ tags: ['gallery', 'gallery-settings'] })
}
