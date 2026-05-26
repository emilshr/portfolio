import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { FormattedDate } from '@/components/chiri/FormattedDate'
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
    <section className="posts-archive chiri-posts-archive">
      {heading && <h1 className="page-title">{heading}</h1>}
      {groups.map(({ year, posts }) => (
        <section key={year} className="year-section">
          <h2 className="year-heading">{year}</h2>
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`/${post.slug}`}>
                  <div className={`post-item ${!dateOnRight ? 'date-left' : ''}`}>
                    {!dateOnRight && post.pubDate && (
                      <p className="date">
                        <FormattedDate date={post.pubDate} settings={settings} hideYear />
                      </p>
                    )}
                    <p className="title">{post.title}</p>
                    {dateOnRight && <div className={dotted ? 'dotted-divider' : 'divider'} />}
                    {dateOnRight && post.pubDate && (
                      <p className="date">
                        <FormattedDate date={post.pubDate} settings={settings} hideYear />
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  )
}
