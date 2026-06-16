import RichText from '@/components/RichText'
import type { Post } from '@repo/payload-types'
import type { SiteSettingsData } from '@/utilities/getSiteSettings'

import { BackButton } from './BackButton'
import { FormattedDate } from './FormattedDate'

type Props = {
  post: Post
  settings: SiteSettingsData
  readingTime?: string
}

export function PostLayout({ post, settings, readingTime }: Props) {
  return (
    <article className="post-container">
      <div className="prose">
        <BackButton />
        <div className="title">
          <h1 className="mb-1 mt-0">{post.title}</h1>
          <div className="date text-(length:--font-size-s) text-(--text-secondary)">
            {post.publishedAt && <FormattedDate date={post.publishedAt} settings={settings} />}
            {settings.post.readingTime && readingTime && (
              <span className="reading-time">
                <span className="separator">·</span>
                {readingTime}
              </span>
            )}
            {post.lastUpdatedAt && (
              <span className="last-updated">
                <span className="separator">·</span>
                <span className="label">Updated</span>
                <FormattedDate date={post.lastUpdatedAt} settings={settings} />
              </span>
            )}
          </div>
        </div>
        <div className="content">
          {post.content && (
            <RichText data={post.content} enableGutter={false} enableProse className="prose" />
          )}
        </div>
      </div>
    </article>
  )
}
