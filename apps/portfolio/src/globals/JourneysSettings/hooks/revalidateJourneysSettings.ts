import type { GlobalAfterChangeHook } from 'payload'

import { revalidateJourneys } from '@/utilities/revalidateJourneys'

export const revalidateJourneysSettings: GlobalAfterChangeHook = async ({ req }) => {
  if (req.context.disableRevalidate) {
    return
  }

  await revalidateJourneys({ tags: ['journeys-settings', 'travels'] })
}
