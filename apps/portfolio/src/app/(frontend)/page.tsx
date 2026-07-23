import type { Metadata } from 'next'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { User } from '@repo/payload-types'
import { generateMeta } from '@/utilities/generateMeta'
import { getDocumentQueryAccess } from '@/utilities/getDocumentQueryAccess'

export default async function HomePage() {
  const access = await getDocumentQueryAccess()
  const page = await queryPageBySlug({
    slug: 'home',
    draft: access.draft,
    user: access.user,
  })

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

const queryPageBySlug = cache(
  async ({ slug, draft, user }: { slug: string; draft: boolean; user?: User }) => {
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
  },
)
