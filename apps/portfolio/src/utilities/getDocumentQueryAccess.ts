import configPromise from '@payload-config'
import { draftMode, headers } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { User } from '@repo/payload-types'

export type DocumentQueryAccess = {
  draft: boolean
  overrideAccess: false
  user?: User
}

/**
 * Access-aware Local API options for frontend document reads.
 * Draft cookie alone is not enough — unpublished docs require an authenticated user.
 */
export const getDocumentQueryAccess = cache(async (): Promise<DocumentQueryAccess> => {
  const { isEnabled: draftEnabled } = await draftMode()

  if (!draftEnabled) {
    return { draft: false, overrideAccess: false }
  }

  const payload = await getPayload({ config: configPromise })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return { draft: false, overrideAccess: false }
  }

  return {
    draft: true,
    overrideAccess: false,
    user: user as User,
  }
})
