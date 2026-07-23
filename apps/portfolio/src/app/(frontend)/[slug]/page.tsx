import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { PostLayout } from '@/components/chiri/PostLayout'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { User } from '@repo/payload-types'
import { generateMeta } from '@/utilities/generateMeta'
import { getDocumentQueryAccess } from '@/utilities/getDocumentQueryAccess'
import { getSiteSettings } from '@/utilities/getSiteSettings'

type Args = {
  params: Promise<{ slug?: string }>
}

type SlugQueryArgs = {
  slug: string
  draft: boolean
  user?: User
}

export default async function Page({ params: paramsPromise }: Args) {
  const [{ slug = 'home' }, access] = await Promise.all([paramsPromise, getDocumentQueryAccess()])
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug

  if (decodedSlug === 'posts') {
    return <PayloadRedirects url="/posts" />
  }

  const queryArgs: SlugQueryArgs = {
    slug: decodedSlug,
    draft: access.draft,
    user: access.user,
  }

  const [post, page, settings] = await Promise.all([
    queryPostBySlug(queryArgs),
    queryPageBySlug(queryArgs),
    getSiteSettings(),
  ])

  if (post) {
    return <PostLayout post={post} settings={settings} />
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  return (
    <>
      <PayloadRedirects disableNotFound url={url} />
      <RenderBlocks blocks={page.layout} />
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const queryArgs: SlugQueryArgs = { slug: decodedSlug, draft: false }

  const [post, page] = await Promise.all([queryPostBySlug(queryArgs), queryPageBySlug(queryArgs)])

  if (post) return generateMeta({ doc: post })
  return generateMeta({ doc: page })
}

const queryPostBySlug = cache(async ({ slug, draft, user }: SlugQueryArgs) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    draft,
    depth: 1,
    limit: 1,
    pagination: false,
    overrideAccess: false,
    ...(user ? { user } : {}),
    select: {
      createdAt: true,
      title: true,
      slug: true,
      lastUpdatedAt: true,
      content: true,
      meta: true,
      publishedAt: true,
      updatedAt: true,
    },
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})

const queryPageBySlug = cache(async ({ slug, draft, user }: SlugQueryArgs) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    draft,
    depth: 1,
    limit: 1,
    pagination: false,
    overrideAccess: false,
    ...(user ? { user } : {}),
    select: {
      title: true,
      slug: true,
      layout: true,
      meta: true,
      publishedAt: true,
      updatedAt: true,
    },
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
