/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 *
 * Local paths (e.g. `/api/media/file/image.webp`) are kept relative so
 * Next.js image optimization treats them as local rather than fetching
 * through `remotePatterns`, which blocks private IPs since Next.js 16.
 *
 * Cache tags are applied as a `v` query param (not a bare `?timestamp`) so
 * they remain valid `URLSearchParams` and match Next.js `localPatterns`.
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''
  if (!cacheTag) return url

  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url)
      parsed.searchParams.set('v', cacheTag)
      return parsed.toString()
    } catch {
      return url
    }
  }

  const qIndex = url.indexOf('?')
  const path = qIndex === -1 ? url : url.slice(0, qIndex)
  const existingQuery = qIndex === -1 ? '' : url.slice(qIndex + 1)
  const params = new URLSearchParams(existingQuery)
  params.set('v', cacheTag)
  return `${path}?${params.toString()}`
}
