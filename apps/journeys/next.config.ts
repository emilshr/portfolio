import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

function parseHostname(urlString: string | undefined): string | null {
  if (!urlString) return null
  try {
    const normalized = urlString.startsWith('http') ? urlString : `https://${urlString}`
    return new URL(normalized).hostname
  } catch {
    return null
  }
}

const payloadApiUrl = process.env.PAYLOAD_API_URL || 'http://localhost:3000/api'
const payloadOrigin = payloadApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '')
const r2Hostname = parseHostname(process.env.NEXT_PUBLIC_MEDIA_HOST || process.env.R2_PUBLIC_URL)

const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = []

if (r2Hostname) {
  remotePatterns.push({
    hostname: r2Hostname,
    protocol: 'https',
  })
}

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(dirname, '../..'),
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
