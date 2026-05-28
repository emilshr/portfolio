const normalizeURL = (value: string): string | null => {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  const valueWithProtocol = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`

  try {
    return new URL(valueWithProtocol).toString().replace(/\/$/, '')
  } catch {
    return null
  }
}

const normalizeOrigin = (value: string): string | null => {
  const normalizedURL = normalizeURL(value)

  if (!normalizedURL) {
    return null
  }

  try {
    return new URL(normalizedURL).origin
  } catch {
    return null
  }
}

export const getRailwayProductionURLs = (): string[] => {
  const rawValue = process.env.RAILWAY_PROJECT_PRODUCTION_URLS

  if (!rawValue) {
    return []
  }

  return rawValue
    .split(',')
    .map((value) => normalizeURL(value))
    .filter((value): value is string => Boolean(value))
}

export const getPrimaryProductionURL = (): string | null => {
  const urls = getRailwayProductionURLs()
  return urls[0] ?? null
}

export const getAllowedOrigins = (): string[] => {
  const journeysURL = process.env.JOURNEYS_SITE_URL
  const rawOrigins = [
    process.env.NEXT_PUBLIC_SERVER_URL,
    journeysURL,
    ...getRailwayProductionURLs(),
  ]
  const originSet = new Set<string>()

  for (const value of rawOrigins) {
    if (!value) continue
    const origin = normalizeOrigin(value)
    if (origin) originSet.add(origin)
  }

  return Array.from(originSet)
}
