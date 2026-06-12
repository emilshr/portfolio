import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const payloadApiUrl =
  process.env.PAYLOAD_API_URL ||
  process.env.NEXT_PUBLIC_PAYLOAD_API_URL ||
  'http://localhost:3000/api'

if (
  process.env.VERCEL_ENV === 'production' &&
  !process.env.PAYLOAD_API_URL &&
  !process.env.NEXT_PUBLIC_PAYLOAD_API_URL
) {
  throw new Error(
    'journeys production build requires PAYLOAD_API_URL or NEXT_PUBLIC_PAYLOAD_API_URL (e.g. https://emilshr.com/api).',
  )
}

function parseHostname(urlString: string | undefined): string | null {
  if (!urlString) return null
  try {
    const normalized = urlString.startsWith('http') ? urlString : `https://${urlString}`
    return new URL(normalized).hostname
  } catch {
    return null
  }
}

const payloadOrigin = payloadApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '')
const r2Hostname = parseHostname(process.env.NEXT_PUBLIC_MEDIA_HOST || process.env.R2_PUBLIC_URL)
const mediaBaseHostname = parseHostname(process.env.NEXT_PUBLIC_MEDIA_BASE_URL)

const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = []

if (r2Hostname) {
  remotePatterns.push({
    hostname: r2Hostname,
    protocol: 'https',
  })
}

if (mediaBaseHostname) {
  remotePatterns.push({
    hostname: mediaBaseHostname,
    protocol: 'https',
  })
}

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui'],
  turbopack: {
    root: path.resolve(dirname, '../..'),
  },
  async redirects() {
    return [
      {
        source: '/posts',
        destination: '/articles',
        permanent: true,
      },
      {
        source: '/posts/:path*',
        destination: '/articles/:path*',
        permanent: true,
      },
      {
        source: '/:slug((?!gallery|articles|vehicles|api|_next)[^/]+)',
        destination: '/articles/:slug',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/media/:path*',
        destination: `${payloadOrigin}/api/media/:path*`,
      },
    ]
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    remotePatterns,
  },
}

export default nextConfig
