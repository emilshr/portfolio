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

const vercelHostToURL = (host: string | undefined): string | null => {
  if (!host) return null
  return normalizeURL(host)
}

export const getProductionURLs = (): string[] => {
  const urls: string[] = []

  const explicit = process.env.NEXT_PUBLIC_SERVER_URL
  if (explicit) {
    const normalized = normalizeURL(explicit)
    if (normalized) urls.push(normalized)
  }

  const productionList = process.env.PRODUCTION_URLS
  if (productionList) {
    for (const value of productionList.split(',')) {
      const normalized = normalizeURL(value)
      if (normalized) urls.push(normalized)
    }
  }

  const vercelProduction = vercelHostToURL(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  if (vercelProduction) urls.push(vercelProduction)

  const vercelPreview = vercelHostToURL(process.env.VERCEL_URL)
  if (vercelPreview) urls.push(vercelPreview)

  return [...new Set(urls)]
}

export const getPrimaryProductionURL = (): string | null => {
  const urls = getProductionURLs()
  return urls[0] ?? null
}

export const getAllowedOrigins = (): string[] => {
  const journeysURL = process.env.JOURNEYS_SITE_URL
  const rawOrigins = [process.env.NEXT_PUBLIC_SERVER_URL, journeysURL, ...getProductionURLs()]
  const originSet = new Set<string>()

  for (const value of rawOrigins) {
    if (!value) continue
    const origin = normalizeOrigin(value)
    if (origin) originSet.add(origin)
  }

  return Array.from(originSet)
}
