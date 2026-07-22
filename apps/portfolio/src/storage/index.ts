import { s3Storage } from '@payloadcms/storage-s3'
import type { Plugin } from 'payload'

const useR2 =
  process.env.R2_BUCKET &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_ENDPOINT

/** Public CDN URL (R2 custom domain). When unset, Payload proxies private bucket objects. */
const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '') || undefined

export const storagePlugins: Plugin[] = useR2
  ? [
      s3Storage({
        collections: {
          media: publicUrl
            ? {
                disablePayloadAccessControl: true,
                generateFileURL: ({ filename, prefix }) => {
                  const key = prefix ? `${prefix}/${filename}` : filename
                  return `${publicUrl}/${key}`
                },
              }
            : true,
        },
        clientUploads: true,
        signedDownloads: !publicUrl,
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
