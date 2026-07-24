/**
 * One-time migration:
 * Convert article/vehicle/gallery-collection gallery arrays from `{ media }` rows → media ID arrays
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

  payload.logger.info(
    `Done. articles=${articlesMigrated}, vehicles=${vehiclesMigrated}, gallery-collections=${collectionsMigrated}`,
  )

  process.exit(0)
}

migrate().catch((error) => {
  console.error(error)
  process.exit(1)
})
