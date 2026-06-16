import type { Config } from '@repo/payload-types'

import { type DataFromGlobalSlug } from 'payload'
import { unstable_cache } from 'next/cache'

import { getPublicPayload, PUBLIC_PAYLOAD_QUERY } from './payloadPublicQuery'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(slug: T, depth = 0): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPublicPayload()

  const global = await payload.findGlobal({
    slug,
    depth,
    ...PUBLIC_PAYLOAD_QUERY,
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0) =>
  unstable_cache(async () => getGlobal<T>(slug, depth), [slug], {
    tags: [`global_${slug}`],
  })
