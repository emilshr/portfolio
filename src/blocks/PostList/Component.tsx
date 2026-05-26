import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { PostList } from '@/components/chiri/PostList'
import type { PostListBlock as PostListBlockProps } from '@/payload-types'
import { getSiteSettings } from '@/utilities/getSiteSettings'

export const PostListBlockComponent: React.FC<PostListBlockProps> = async ({
  limit = 5,
  showViewAll,
}) => {
  const payload = await getPayload({ config: configPromise })
  const settings = await getSiteSettings()

  const { docs, totalDocs } = await payload.find({
    collection: 'posts',
    sort: '-pubDate',
    limit: limit ?? 5,
    depth: 0,
    where: { _status: { equals: 'published' } },
  })

  return (
    <PostList
      posts={docs}
      settings={settings}
      showViewAll={showViewAll ?? true}
      totalCount={totalDocs}
    />
  )
}
