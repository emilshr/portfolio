const getPrimaryProductionURL = () => {
  const rawValue = process.env.RAILWAY_PROJECT_PRODUCTION_URLS

  if (!rawValue) {
    return null
  }

  const firstValidURL = rawValue
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => (/^https?:\/\//i.test(value) ? value : `https://${value}`))
    .find((value) => {
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    })

  return firstValidURL || null
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
