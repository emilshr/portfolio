/**
 * Ensures preview redirects stay on the same origin.
 * Rejects protocol-relative (`//evil`), backslash, and absolute off-site URLs.
 */
export function getSafePreviewRedirect(path: string, requestOrigin: string): string | null {
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
    return null
  }

  try {
    const resolved = new URL(path, requestOrigin)
    if (resolved.origin !== requestOrigin) {
      return null
    }
    return `${resolved.pathname}${resolved.search}${resolved.hash}`
  } catch {
    return null
  }
}

export function isSafePreviewPath(path: string, requestOrigin: string): boolean {
  return getSafePreviewRedirect(path, requestOrigin) !== null
}
