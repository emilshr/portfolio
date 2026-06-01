/**
 * Payload REST API base URL (includes `/api` suffix).
 * Accepts server-only or public env — Vercel projects often set only one.
 */
export function getPayloadApiUrl(): string | undefined {
  const raw = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_API_URL
  if (!raw?.trim()) return undefined
  return raw.trim().replace(/\/$/, '')
}

export function isProductionDeploy(): boolean {
  return (
    process.env.VERCEL_ENV === 'production' ||
    (process.env.NODE_ENV === 'production' && process.env.VERCEL === '1')
  )
}
