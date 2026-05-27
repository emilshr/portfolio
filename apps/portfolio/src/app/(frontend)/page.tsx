import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'

import { generateMeta } from '@/utilities/generateMeta'

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()
  const page = await queryPageBySlug({ slug: 'home', draft })

  if (!page) {
    return <PayloadRedirects url="/" />
  }

  return (
    <>
      <PayloadRedirects disableNotFound url="/" />
      <RenderBlocks blocks={page.layout} />
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPageBySlug({ slug: 'home', draft: false })
  return generateMeta({ doc: page })
}

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
