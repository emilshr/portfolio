/**
 * One-time migration: copies `travels` documents into `articles`.
 *
 * Run BEFORE removing the Travels collection from payload.config.ts:
 *   pnpm migrate:travels-to-articles
 *
 * Temporarily re-add the Travels collection to payload.config if it has already been removed.
 */
import { config as dotenvConfig } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import type { Article } from '@repo/payload-types'
import { getPayload } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenvConfig({ path: path.resolve(dirname, '../.env') })

type TravelDoc = {
  id: string
  slug: string
  title: string
  subtitle?: string | null
  excerpt?: string | null
  heroImage?: string | null
  coverImage?: string | null
  location?: Article['location']
  tripDates?: Article['tripDates']
  gallery?: Article['gallery']
  content?: Article['content']
  meta?: Article['meta']
  publishedAt?: string | null
  lastUpdatedAt?: string | null
  featured?: boolean | null
  _status?: 'draft' | 'published' | null
}

async function migrate() {
  const { default: config } = await import('../src/payload.config.js')
  const payload = await getPayload({ config })

  const { docs: existingArticles } = await payload.find({
    collection: 'articles',
    depth: 0,
    limit: 1000,
    pagination: false,
    draft: true,
    overrideAccess: true,
    select: { slug: true },
  })

  const existingSlugs = new Set(existingArticles.map((a) => a.slug))

  // Legacy collection — may not exist in generated types after Travels is removed from config.
  const { docs: travels } = await payload.find({
    collection: 'travels' as 'articles',
    depth: 0,
    limit: 1000,
    pagination: false,
    draft: true,
    overrideAccess: true,
  })

  let migrated = 0
  let skipped = 0

  for (const travel of travels as TravelDoc[]) {
    const alreadyMigrated = existingArticles.some(
      (a) => a.slug === travel.slug && a.id !== travel.id,
    )

    if (alreadyMigrated) {
      payload.logger.info(
        `Skipping travel ${travel.id} (${travel.slug}): article with same slug exists`,
      )
      skipped++
      continue
    }

    let slug = travel.slug
    if (existingSlugs.has(slug)) {
      let suffix = 2
      while (existingSlugs.has(`${travel.slug}-${suffix}`)) {
        suffix++
      }
      slug = `${travel.slug}-${suffix}`
      payload.logger.warn(`Slug conflict for "${travel.slug}" → using "${slug}"`)
    }

    existingSlugs.add(slug)

    const articleData = {
      title: travel.title,
      subtitle: travel.subtitle ?? undefined,
      excerpt: travel.excerpt ?? undefined,
      heroImage: travel.heroImage ?? undefined,
      coverImage: travel.coverImage ?? undefined,
      location: travel.location ?? undefined,
      tripDates: travel.tripDates ?? undefined,
      gallery: travel.gallery ?? undefined,
      content: travel.content,
      meta: travel.meta ?? undefined,
      publishedAt: travel.publishedAt ?? undefined,
      lastUpdatedAt: travel.lastUpdatedAt ?? undefined,
      featured: travel.featured ?? false,
      slug,
    }

    const createOptions = {
      collection: 'articles' as const,
      overrideAccess: true,
      context: { disableRevalidate: true },
    }

    if (travel._status === 'published') {
      await payload.create({
        ...createOptions,
        data: { ...articleData, _status: 'published' as const },
      })
    } else {
      await payload.create({
        ...createOptions,
        draft: true,
        data: articleData,
      })
    }

    migrated++
    payload.logger.info(`Migrated travel "${travel.title}" → article (slug: ${slug})`)
  }

  payload.logger.info(
    `Done. Migrated ${migrated}, skipped ${skipped} of ${travels.length} travels.`,
  )
  process.exit(0)
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
