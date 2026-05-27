import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { PostLayout } from '@/components/chiri/PostLayout'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'

import { generateMeta } from '@/utilities/generateMeta'
import { getSiteSettings } from '@/utilities/getSiteSettings'

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug

  if (decodedSlug === 'posts') {
    return <PayloadRedirects url="/posts" />
  }

  const post = await queryPostBySlug({ slug: decodedSlug, draft })
  if (post) {
    const settings = await getSiteSettings()
    return <PostLayout post={post} settings={settings} />
  }

  const page = await queryPageBySlug({ slug: decodedSlug, draft })

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

  const post = await queryPostBySlug({ slug: decodedSlug, draft: false })
  if (post) return generateMeta({ doc: post })

  const page = await queryPageBySlug({ slug: decodedSlug, draft: false })
  return generateMeta({ doc: page })
}

const queryPostBySlug = cache(async ({ slug, draft }: { slug: string; draft: boolean }) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    draft,
    depth: 1,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
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

const queryPageBySlug = cache(async ({ slug, draft }: { slug: string; draft: boolean }) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    draft,
    depth: 1,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
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
