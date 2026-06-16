import { getPublicPayload, PUBLIC_PAYLOAD_QUERY } from '@/utilities/payloadPublicQuery'

import { PostList } from '@/components/chiri/PostList'
import type { PostListBlock as PostListBlockProps } from '@repo/payload-types'
import { getSiteSettings } from '@/utilities/getSiteSettings'

export const PostListBlockComponent: React.FC<PostListBlockProps> = async ({
  heading = 'Posts',
  limit = 5,
  showViewAll,
}) => {
  const payload = await getPublicPayload()
  const settings = await getSiteSettings()

  const { docs, totalDocs } = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    limit: limit ?? 5,
    depth: 0,
    ...PUBLIC_PAYLOAD_QUERY,
  })

  const listLimit = limit ?? 5

  if (totalDocs === 0) {
    return null
  }

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
