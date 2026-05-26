import Link from 'next/link'

import type { Post } from '@/payload-types'
import type { SiteSettingsData } from '@/utilities/getSiteSettings'
import { FormattedDate } from './FormattedDate'

type Props = {
  posts: Post[]
  settings: SiteSettingsData
  showViewAll?: boolean
  totalCount?: number
}

export function PostList({ posts, settings, showViewAll = false, totalCount }: Props) {
  const showLink = showViewAll && (totalCount ?? posts.length) > 5
  const dotted = settings.general.postListDottedDivider
  const dateOnRight = settings.date.dateOnRight

  return (
    <div className="chiri-post-list">
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/${post.slug}`}>
              <div className={`post-item ${!dateOnRight ? 'date-left' : ''}`}>
                {!dateOnRight && post.pubDate && (
                  <p className="date">
                    <FormattedDate date={post.pubDate} settings={settings} />
                  </p>
                )}
                <p className="title">{post.title}</p>
                {dateOnRight && <div className={dotted ? 'dotted-divider' : 'divider'} />}
                {dateOnRight && post.pubDate && (
                  <p className="date">
                    <FormattedDate date={post.pubDate} settings={settings} />
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {showLink && (
        <p className="view-all">
          <Link href="/posts">View all posts</Link>
        </p>
      )}
      <div className="placeholder" />
    </div>
  )
}
