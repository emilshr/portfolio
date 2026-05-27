import { config as dotenvConfig } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import { getPayload } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenvConfig({ path: path.resolve(dirname, '../.env') })

type PostWithPubDate = {
  id: string
  pubDate?: string | null
  publishedAt?: string | null
}

async function migrate() {
  const { default: config } = await import('../src/payload.config.js')
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 1000,
    pagination: false,
    draft: true,
    overrideAccess: true,
    select: {
      pubDate: true,
      publishedAt: true,
    },
  })

  let updated = 0

  for (const doc of docs as PostWithPubDate[]) {
    if (!doc.pubDate) continue

    const publishedAt = doc.publishedAt ? new Date(doc.publishedAt) : null
    const pubDate = new Date(doc.pubDate)

    const shouldUsePubDate = !publishedAt || publishedAt.getTime() !== pubDate.getTime()

    if (!shouldUsePubDate) continue

    await payload.update({
      collection: 'posts',
      id: doc.id,
      data: {
        publishedAt: pubDate.toISOString(),
      },
      overrideAccess: true,
    })

    updated++
    payload.logger.info(`Migrated post ${doc.id}: pubDate → publishedAt`)
  }

  payload.logger.info(`Done. Updated ${updated} of ${docs.length} posts.`)
  process.exit(0)
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
