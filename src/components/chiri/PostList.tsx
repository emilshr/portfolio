import Link from 'next/link'

import type { Post } from '@/payload-types'
import type { SiteSettingsData } from '@/utilities/getSiteSettings'
import { PostListItems } from './PostListItems'

type Props = {
  posts: Post[]
  settings: SiteSettingsData
  heading?: string
  showViewAll?: boolean
  totalCount?: number
  limit?: number
}

export function PostList({
  posts,
  settings,
  heading,
  showViewAll = false,
  totalCount,
  limit = posts.length,
}: Props) {
  const total = totalCount ?? posts.length
  const showLink = showViewAll && total > limit

  return (
    <section className="chiri-post-list mb-6">
      {heading ? <h2 className="section-heading">{heading}</h2> : null}
      <PostListItems posts={posts} settings={settings} />
      {showLink && (
        <p className="view-all">
          <Link href="/posts">View all posts</Link>
        </p>
      )}
    </section>
  )
}
