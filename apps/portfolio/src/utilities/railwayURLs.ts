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
