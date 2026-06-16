import { config as dotenvConfig } from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

import type { Page, Post } from '@repo/payload-types'
import { getPayload } from 'payload'

type SeedRichText = Post['content']

function toRichText(markdown: string): SeedRichText {
  return markdownToLexical(markdown) as SeedRichText
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const astroContentRoot = path.resolve(dirname, '../seed-data')

dotenvConfig({ path: path.resolve(dirname, '../.env') })

import { markdownToLexical } from '../src/utilities/markdownToLexical.js'

const fresh = process.argv.includes('--fresh')

const seedContext = { disableRevalidate: true }

async function seed() {
  const { default: config } = await import('../src/payload.config.js')
  const payload = await getPayload({ config })

  payload.logger.info('— Seeding portfolio...')

  const collections = ['pages', 'posts', 'experiences', 'media'] as const

  if (fresh) {
    for (const collection of collections) {
      await payload.db.deleteMany({ collection, req: {} as never, where: {} })
      if (payload.collections[collection].config.versions) {
        await payload.db.deleteVersions({ collection, req: {} as never, where: {} })
      }
    }
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'changeme'

  const existingUsers = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
  })

  let adminUser = existingUsers.docs[0]
  if (!adminUser) {
    adminUser = await payload.create({
      collection: 'users',
      context: seedContext,
      data: {
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        roles: ['admin'],
      },
    })
    payload.logger.info(`Created admin user: ${adminEmail}`)
  } else if (!adminUser.roles?.includes('admin')) {
    adminUser = await payload.update({
      collection: 'users',
      id: adminUser.id,
      context: seedContext,
      data: {
        roles: ['admin'],
      },
    })
    payload.logger.info(`Promoted existing user to admin: ${adminEmail}`)
  }

  // Site settings
  await payload.updateGlobal({
    slug: 'site-settings',
    context: seedContext,
    data: {
      site: {
        website: 'https://emilshr.com/',
        title: 'Emil',
        author: 'Emil',
        description: 'I specialize in building things for the web.',
        language: 'en-US',
      },
      general: {
        contentWidth: '35rem',
        centeredLayout: true,
        themeToggle: true,
        postListDottedDivider: false,
        footer: true,
        fadeAnimation: true,
      },
      date: {
        dateFormat: 'DAY MONTH YYYY',
        dateSeparator: '.',
        dateOnRight: true,
      },
      post: {
        readingTime: true,
        toc: true,
        imageViewer: true,
        copyCode: true,
        linkCard: true,
      },
      contactLinks: {
        calCom: 'https://cal.eu/emil-sharier',
        linkedin: 'https://www.linkedin.com/in/emilsharier',
        github: 'https://github.com/emilshr',
      },
    },
  })

  // Experiences
  const experiencesDir = path.join(astroContentRoot, 'experiences')
  const experienceFiles = fs.readdirSync(experiencesDir).filter((f) => f.endsWith('.md'))

  for (const file of experienceFiles) {
    const raw = fs.readFileSync(path.join(experiencesDir, file), 'utf-8')
    const { data, content } = matter(raw)
    const slug = file.replace(/\.mdx?$/, '')

    const existing = await payload.find({
      collection: 'experiences',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const expData = {
      title: data.title,
      company: data.company,
      url: data.url,
      from: data.from,
      to: data.to,
      order: data.order,
      slug,
      description: toRichText(content.trim()),
      _status: 'published' as const,
    }

    if (existing.docs[0]) {
      await payload.update({
        collection: 'experiences',
        id: existing.docs[0].id,
        context: seedContext,
        data: expData,
      })
    } else {
      await payload.create({
        collection: 'experiences',
        context: seedContext,
        data: expData,
      })
    }
    payload.logger.info(`Experience: ${slug}`)
  }

  // Posts
  const postsDir = path.join(astroContentRoot, 'posts')
  const postFiles = fs
    .readdirSync(postsDir)
    .filter((f) => (f.endsWith('.md') || f.endsWith('.mdx')) && !f.startsWith('_'))

  for (const file of postFiles) {
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8')
    const { data, content } = matter(raw)
    const slug = file.replace(/\.mdx?$/, '')

    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const publishedAtSource = data.publishedAt ?? data.pubDate
    if (!publishedAtSource) {
      throw new Error(`Post "${slug}" is missing publishedAt in frontmatter`)
    }

    const postData = {
      title: data.title,
      slug,
      lastUpdatedAt: data.lastUpdatedAt || undefined,
      content: toRichText(content.trim()),
      _status: 'published' as const,
      publishedAt: new Date(publishedAtSource).toISOString(),
    }

    if (existing.docs[0]) {
      await payload.update({
        collection: 'posts',
        id: existing.docs[0].id,
        context: seedContext,
        data: postData,
      })
    } else {
      await payload.create({
        collection: 'posts',
        context: seedContext,
        data: postData,
      })
    }
    payload.logger.info(`Post: ${slug}`)
  }

  // About content for home page
  const aboutPath = path.join(astroContentRoot, 'about/about.md')
  const aboutRaw = fs.readFileSync(aboutPath, 'utf-8')
  const { content: aboutContent } = matter(aboutRaw)
  const aboutLexical = toRichText(aboutContent.replace(/<!--[\s\S]*?-->/g, '').trim())

  const homeLayout: NonNullable<Page['layout']> = [
    {
      blockType: 'about',
      heading: 'Emil',
      subheading: 'I specialize in building things for the web.',
      content: aboutLexical,
    },
    {
      blockType: 'postList',
      heading: 'Posts',
      limit: 5,
      showViewAll: true,
    },
    {
      blockType: 'workExperience',
      heading: 'Work',
    },
    {
      blockType: 'contactCTA',
      heading: 'Connect',
      useGlobalLinks: true,
    },
  ]

  const existingHome = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })

  const homeData = {
    title: 'Home',
    slug: 'home',
    layout: homeLayout,
    _status: 'published' as const,
    publishedAt: new Date().toISOString(),
  }

  if (existingHome.docs[0]) {
    await payload.update({
      collection: 'pages',
      id: existingHome.docs[0].id,
      context: seedContext,
      data: homeData,
    })
  } else {
    await payload.create({
      collection: 'pages',
      context: seedContext,
      data: homeData,
    })
  }

  payload.logger.info('— Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
