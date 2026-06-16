import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPrimaryProductionURL, getProductionURLs } from './src/utilities/siteURLs'
import { validateProductionEnv } from './src/env'

validateProductionEnv()

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
import { redirects } from './redirects'

const primaryProductionURL = getPrimaryProductionURL()
const productionURLs = getProductionURLs()
const NEXT_PUBLIC_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  primaryProductionURL ||
  process.env.__NEXT_PRIVATE_ORIGIN ||
  'http://localhost:3000'

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui'],
  // Temporarily required on Windows until Next.js fixes Turbopack Sass resolution.
  // See: https://github.com/vercel/next.js/issues/86431
  sassOptions: {
    loadPaths: ['./node_modules/@payloadcms/ui/dist/scss/'],
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    qualities: [75, 85, 100],
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL, ...productionURLs].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
        }
      }),
      ...(process.env.R2_PUBLIC_URL
        ? (() => {
            const url = new URL(process.env.R2_PUBLIC_URL)
            return [
              {
                hostname: url.hostname,
                protocol: url.protocol.replace(':', '') as 'http' | 'https',
              },
            ]
          })()
        : []),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  turbopack: {
    root: path.resolve(dirname, '../..'),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
