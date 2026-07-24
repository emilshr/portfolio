/**
 * Removes the published "Archive" Gallery Collection created by migrate-gallery-has-many.
 * Does not delete any media files — only the gallery-collections document.
 *
 *   pnpm delete:archive-gallery
 */
import { config as dotenvConfig } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import { getPayload } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenvConfig({ path: path.resolve(dirname, '../.env') })

const ARCHIVE_SLUG = 'archive'
const ARCHIVE_TITLE = 'Archive'

async function deleteArchive() {
  const { default: config } = await import('../src/payload.config.js')
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'gallery-collections',
    depth: 0,
    limit: 10,
    pagination: false,
    draft: true,
    overrideAccess: true,
    where: {
      slug: { equals: ARCHIVE_SLUG },
    },
  })

  if (docs.length === 0) {
    payload.logger.info(`No gallery collection with slug "${ARCHIVE_SLUG}" found — nothing to delete`)
    process.exit(0)
  }

  for (const doc of docs) {
    const title = typeof doc.title === 'string' ? doc.title : ''
    if (title !== ARCHIVE_TITLE) {
      payload.logger.warn(
        `Skipping ${doc.id} (slug=${ARCHIVE_SLUG}, title="${title}"): title is not "${ARCHIVE_TITLE}"`,
      )
      continue
    }

    await payload.delete({
      collection: 'gallery-collections',
      id: doc.id,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })

    payload.logger.info(`Deleted Gallery Collection "${ARCHIVE_TITLE}" (${doc.id})`)
  }

  process.exit(0)
}

deleteArchive().catch((error) => {
  console.error(error)
  process.exit(1)
})
