import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { PostList } from '@/components/chiri/PostList'
import type { PostListBlock as PostListBlockProps } from '@repo/payload-types'
import { getSiteSettings } from '@/utilities/getSiteSettings'

export const PostListBlockComponent: React.FC<PostListBlockProps> = async ({
  heading = 'Posts',
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

  const listLimit = limit ?? 5

  return (
    <PostList
      posts={docs}
      settings={settings}
      heading={heading ?? 'Posts'}
      showViewAll={showViewAll ?? true}
      totalCount={totalDocs}
      limit={listLimit}
    />
  )
}
