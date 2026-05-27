import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { PostListByYearBlockComponent } from '@/blocks/PostListByYear/Component'
import { getSiteSettings } from '@/utilities/getSiteSettings'

export default async function PostsArchivePage() {
  return <PostListByYearBlockComponent blockType="postListByYear" heading="Posts" />
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: `Posts · ${settings.site.title}`,
    description: settings.site.description,
  }
}
