import Link from 'next/link'

import type { Post } from '@repo/payload-types'
import type { SiteSettingsData } from '@/utilities/getSiteSettings'

import { sectionHeading } from './classNames'
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
    <section className="mb-6">
      {heading ? <h2 className={sectionHeading}>{heading}</h2> : null}
      <PostListItems posts={posts} settings={settings} />
      {showLink && (
        <p className="mt-2 m-0">
          <Link
            href="/posts"
            className="text-(length:--font-size-s) text-(--text-secondary) transition-colors duration-150 hover:text-(--text-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--text-secondary)_50%,transparent)]"
          >
            View all posts
          </Link>
        </p>
      )}
    </section>
  )
}
