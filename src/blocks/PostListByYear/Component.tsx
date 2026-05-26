import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { HoverFocusProvider } from '@/components/chiri/hoverFocusList'
import { PostListRow } from '@/components/chiri/PostListRow'
import type { PostListByYearBlock as PostListByYearBlockProps } from '@/payload-types'
import { getSiteSettings } from '@/utilities/getSiteSettings'

export const PostListByYearBlockComponent: React.FC<PostListByYearBlockProps> = async ({
  heading,
}) => {
  const payload = await getPayload({ config: configPromise })
  const settings = await getSiteSettings()

  const { docs } = await payload.find({
    collection: 'posts',
    sort: '-pubDate',
    limit: 1000,
    depth: 0,
    where: { _status: { equals: 'published' } },
  })

  const groups = docs.reduce(
    (acc, post) => {
      const year = post.pubDate ? new Date(post.pubDate).getFullYear().toString() : 'Unknown'
      const existing = acc.find((g) => g.year === year)
      if (existing) existing.posts.push(post)
      else acc.push({ year, posts: [post] })
      return acc
    },
    [] as { year: string; posts: typeof docs }[],
  )

  const dotted = settings.general.postListDottedDivider
  const dateOnRight = settings.date.dateOnRight

  return (
    <section className="posts-archive chiri-posts-archive chiri-post-list">
      {heading && <h1 className="page-title">{heading}</h1>}
      <HoverFocusProvider>
        {groups.map(({ year, posts }) => (
          <section key={year} className="year-section">
            <h2 className="year-heading">{year}</h2>
            <ul>
              {posts.map((post) => (
                <PostListRow
                  key={post.id}
                  post={post}
                  settings={settings}
                  dateOnRight={dateOnRight}
                  dottedDivider={dotted}
                  hideYear
                />
              ))}
            </ul>
          </section>
        ))}
      </HoverFocusProvider>
    </section>
  )
}
