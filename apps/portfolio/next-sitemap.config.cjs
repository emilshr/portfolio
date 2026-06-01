const normalizeURL = (value) => {
  const trimmed = value.trim()
  if (!trimmed) return null
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    return new URL(withProtocol).toString().replace(/\/$/, '')
  } catch {
    return null
  }
}

const vercelHostToURL = (host) => {
  if (!host) return null
  return normalizeURL(host)
}

const getPrimaryProductionURL = () => {
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    const normalized = normalizeURL(process.env.NEXT_PUBLIC_SERVER_URL)
    if (normalized) return normalized
  }

  const productionList = process.env.PRODUCTION_URLS
  if (productionList) {
    for (const value of productionList.split(',')) {
      const normalized = normalizeURL(value)
      if (normalized) return normalized
    }
  }

  const vercelProduction = vercelHostToURL(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  if (vercelProduction) return vercelProduction

  const vercelPreview = vercelHostToURL(process.env.VERCEL_URL)
  if (vercelPreview) return vercelPreview

  return null
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || getPrimaryProductionURL() || 'https://example.com'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/posts-sitemap.xml', '/pages-sitemap.xml', '/*', '/posts/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
    ],
    additionalSitemaps: [`${SITE_URL}/pages-sitemap.xml`, `${SITE_URL}/posts-sitemap.xml`],
  },
}
