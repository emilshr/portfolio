'use client'

import type { Post } from '@/payload-types'
import type { SiteSettingsData } from '@/utilities/getSiteSettings'

import { postListUl } from './classNames'
import { HoverFocusProvider } from './hoverFocusList'
import { PostListRow } from './PostListRow'

type Props = {
  posts: Post[]
  settings: SiteSettingsData
  hideYear?: boolean
}

export function PostListItems({ posts, settings, hideYear }: Props) {
  const dotted = settings.general.postListDottedDivider
  const dateOnRight = settings.date.dateOnRight

  return (
    <HoverFocusProvider>
      <ul className={postListUl}>
        {posts.map((post) => (
          <PostListRow
            key={post.id}
            post={post}
            settings={settings}
            dateOnRight={dateOnRight}
            dottedDivider={dotted}
            hideYear={hideYear}
          />
        ))}
      </ul>
    </HoverFocusProvider>
  )
}
