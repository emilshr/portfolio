import { s3Storage } from '@payloadcms/storage-s3'
import type { Plugin } from 'payload'

const useR2 =
  process.env.R2_BUCKET &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_ENDPOINT

const r2PublicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '') || null

const isVideoFilename = (filename: string | undefined): boolean =>
  Boolean(filename && /\.(mp4|webm|mov|m4v)$/i.test(filename))

/**
 * Public images should not use R2 presigned redirects: Next.js image optimization
 * rejects those absolute `*.r2.cloudflarestorage.com` URLs (INVALID_IMAGE_OPTIMIZE_REQUEST).
 * Prefer a public CDN URL when configured; otherwise proxy images through Payload and only
 * sign video downloads.
 */
export const storagePlugins: Plugin[] = useR2
  ? [
      s3Storage({
        collections: {
          media: r2PublicUrl
            ? {
                disablePayloadAccessControl: true,
                generateFileURL: ({ filename, prefix }) => {
                  const key = [prefix, filename].filter(Boolean).join('/')
                  return `${r2PublicUrl}/${key}`
                },
              }
            : {
                signedDownloads: {
                  shouldUseSignedURL: ({ filename }) => isVideoFilename(filename),
                },
              },
        },
        clientUploads: true,
        bucket: process.env.R2_BUCKET!,
        config: {
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
          },
          region: 'auto',
          endpoint: process.env.R2_ENDPOINT,
          forcePathStyle: true,
        },
      }),
    ]
  : []

export const useLocalMediaStorage = !useR2
