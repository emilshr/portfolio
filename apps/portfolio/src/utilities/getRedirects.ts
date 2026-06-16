import { unstable_cache } from 'next/cache'

import { getPublicPayload, PUBLIC_PAYLOAD_QUERY } from './payloadPublicQuery'

const REDIRECTS_LIMIT = 500

export async function getRedirects(depth = 1) {
  const payload = await getPublicPayload()

  const { docs: redirects } = await payload.find({
    collection: 'redirects',
    depth,
    limit: REDIRECTS_LIMIT,
    pagination: false,
    ...PUBLIC_PAYLOAD_QUERY,
  })

  return redirects
}

/**
 * Returns a unstable_cache function mapped with the cache tag for 'redirects'.
 *
 * Cache all redirects together to avoid multiple fetches.
 */
export const getCachedRedirects = () =>
  unstable_cache(async () => getRedirects(), ['redirects'], {
    tags: ['redirects'],
  })
