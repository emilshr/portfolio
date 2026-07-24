/**
 * One-time migration:
 * 1. Convert article/vehicle/gallery-collection gallery arrays from `{ media }` rows → media ID arrays
 * 2. If no gallery collections exist, seed a published "Archive" collection from Gallery Settings folder media
 *
 *   pnpm migrate:gallery-has-many
 */
import { config as dotenvConfig } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import { getPayload } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenvConfig({ path: path.resolve(dirname, '../.env') })

function getMediaId(media: unknown): string | null {
  if (!media) return null
  if (typeof media === 'string') return media
  if (typeof media === 'object' && media !== null && 'id' in media) {
    return String((media as { id: string }).id)
  }
  return null
}

function extractMediaIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  const ids: string[] = []
  for (const entry of value) {
    if (typeof entry === 'string') {
      ids.push(entry)
      continue
    }
    if (entry && typeof entry === 'object') {
      if ('media' in entry) {
        const id = getMediaId((entry as { media: unknown }).media)
        if (id) ids.push(id)
        continue
      }
      const id = getMediaId(entry)
      if (id) ids.push(id)
    }
  }
  return ids
}

function needsArrayRowMigration(value: unknown): boolean {
  if (!Array.isArray(value) || value.length === 0) return false
  return value.some((item) => typeof item === 'object' && item !== null && 'media' in item)
}

async function migrateCollectionField({
  payload,
  collection,
  fieldName,
}: {
  payload: Awaited<ReturnType<typeof getPayload>>
  collection: 'articles' | 'vehicles' | 'gallery-collections'
  fieldName: 'gallery' | 'images'
}): Promise<number> {
  const { docs } = await payload.find({
    collection,
    depth: 0,
    limit: 1000,
    pagination: false,
    draft: true,
    overrideAccess: true,
  })

  let migrated = 0

  for (const doc of docs) {
    const raw = (doc as Record<string, unknown>)[fieldName]
    if (!needsArrayRowMigration(raw)) continue

    const mediaIds = extractMediaIds(raw)
    const isDraft = doc._status !== 'published'

    await payload.update({
      collection,
      id: doc.id,
      data: {
        [fieldName]: mediaIds,
      },
      draft: isDraft,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })

    payload.logger.info(
      `Migrated ${collection}/${doc.id} ${fieldName}: ${mediaIds.length} media id(s)`,
    )
    migrated++
  }

  return migrated
}

async function seedArchiveCollection(
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<boolean> {
  const { totalDocs } = await payload.count({
    collection: 'gallery-collections',
    overrideAccess: true,
  })

  if (totalDocs > 0) {
    payload.logger.info(`Skipping Archive seed: ${totalDocs} gallery collection(s) already exist`)
    return false
  }

  const settings = await payload.findGlobal({
    slug: 'gallery-settings',
    depth: 0,
    overrideAccess: true,
  })

  const folder = settings?.folder
  const folderId = typeof folder === 'object' && folder !== null ? folder.id : folder

  if (!folderId) {
    payload.logger.warn('Skipping Archive seed: Gallery Settings folder is not configured')
    return false
  }

  const { docs: media } = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 500,
    pagination: false,
    overrideAccess: true,
    where: {
      folder: { equals: folderId },
    },
    sort: '-createdAt',
  })

  if (media.length === 0) {
    payload.logger.warn('Skipping Archive seed: no media in Gallery Settings folder')
    return false
  }

  const mediaIds = media.map((item) => item.id)
  const coverImage = mediaIds[0]

  await payload.create({
    collection: 'gallery-collections',
    data: {
      title: 'Archive',
      slug: 'archive',
      excerpt: 'Photographs from trips and expeditions.',
      coverImage,
      images: mediaIds,
      publishedAt: new Date().toISOString(),
      _status: 'published',
    },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })

  payload.logger.info(`Seeded published Gallery Collection "Archive" with ${mediaIds.length} media`)
  return true
}

async function migrate() {
  const { default: config } = await import('../src/payload.config.js')
  const payload = await getPayload({ config })

  const articlesMigrated = await migrateCollectionField({
    payload,
    collection: 'articles',
    fieldName: 'gallery',
  })
  const vehiclesMigrated = await migrateCollectionField({
    payload,
    collection: 'vehicles',
    fieldName: 'gallery',
  })
  const collectionsMigrated = await migrateCollectionField({
    payload,
    collection: 'gallery-collections',
    fieldName: 'images',
  })

  const seeded = await seedArchiveCollection(payload)

  payload.logger.info(
    `Done. articles=${articlesMigrated}, vehicles=${vehiclesMigrated}, gallery-collections=${collectionsMigrated}, archiveSeeded=${seeded}`,
  )

  process.exit(0)
}

migrate().catch((error) => {
  console.error(error)
  process.exit(1)
})
