import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { BackButton } from '@/components/chiri/BackButton'
import { postListUl } from '@/components/chiri/classNames'
import { HoverFocusProvider } from '@/components/chiri/hoverFocusList'
import { PostListRow } from '@/components/chiri/PostListRow'
import type { PostListByYearBlock as PostListByYearBlockProps } from '@repo/payload-types'
import { getSiteSettings } from '@/utilities/getSiteSettings'

export const PostListByYearBlockComponent: React.FC<PostListByYearBlockProps> = async () => {
  const payload = await getPayload({ config: configPromise })
  const settings = await getSiteSettings()

  const { docs } = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    limit: 100,
    depth: 0,
    select: {
      title: true,
      slug: true,
      publishedAt: true,
    },
    where: { _status: { equals: 'published' } },
  })

  const groups = docs.reduce(
    (acc, post) => {
      const year = post.publishedAt
        ? new Date(post.publishedAt).getFullYear().toString()
        : 'Unknown'
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
    <section className="posts-archive">
      <BackButton />
      <HoverFocusProvider>
        {groups.map(({ year, posts }) => (
          <section key={year} className="mb-10">
            <h2 className="m-0 mb-2 font-(length:--font-weight-bold) text-(length:--font-size-m)">
              {year}
            </h2>
            <ul className={postListUl}>
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
