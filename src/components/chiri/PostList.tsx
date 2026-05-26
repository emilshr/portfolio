import Link from 'next/link'

import type { Post } from '@/payload-types'
import type { SiteSettingsData } from '@/utilities/getSiteSettings'
import { PostListItems } from './PostListItems'

type Props = {
  posts: Post[]
  settings: SiteSettingsData
  showViewAll?: boolean
  totalCount?: number
  limit?: number
}

export function PostList({
  posts,
  settings,
  showViewAll = false,
  totalCount,
  limit = posts.length,
}: Props) {
  const total = totalCount ?? posts.length
  const showLink = showViewAll && total > limit

  return (
    <div className="chiri-post-list mb-6">
      <PostListItems posts={posts} settings={settings} />
      {showLink && (
        <p className="view-all">
          <Link href="/posts">View all posts</Link>
        </p>
      )}
    </div>
  )
}
