import Link from 'next/link'

import type { Post } from '@/payload-types'
import type { SiteSettingsData } from '@/utilities/getSiteSettings'
import { PostListItems } from './PostListItems'

type Props = {
  posts: Post[]
  settings: SiteSettingsData
  showViewAll?: boolean
  totalCount?: number
}

export function PostList({ posts, settings, showViewAll = false, totalCount }: Props) {
  const showLink = showViewAll && (totalCount ?? posts.length) > 5

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
