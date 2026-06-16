import configPromise from '@payload-config'
import { getPayload } from 'payload'

/** Standard options for public-facing Local API reads — enforces collection access control. */
export const PUBLIC_PAYLOAD_QUERY = {
  overrideAccess: false,
  draft: false,
} as const

export async function getPublicPayload() {
  return getPayload({ config: configPromise })
}
