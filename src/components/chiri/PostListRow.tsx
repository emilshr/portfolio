'use client'

import Link from 'next/link'

import type { Post } from '@/payload-types'
import type { SiteSettingsData } from '@/utilities/getSiteSettings'
import { FormattedDate } from './FormattedDate'
import { HoverFocusItem, HoverFocusText } from './hoverFocusList'

type Props = {
  post: Post
  settings: SiteSettingsData
  dateOnRight: boolean
  dottedDivider: boolean
  hideYear?: boolean
}

export function PostListRow({ post, settings, dateOnRight, dottedDivider, hideYear }: Props) {
  const id = String(post.id)

  return (
    <HoverFocusItem id={id}>
      <Link href={`/${post.slug}`}>
        <div className={`post-item ${!dateOnRight ? 'date-left' : ''}`}>
          {!dateOnRight && post.pubDate && (
            <HoverFocusText itemId={id} variant="secondary" className="date">
              <FormattedDate date={post.pubDate} settings={settings} hideYear={hideYear} />
            </HoverFocusText>
          )}
          <HoverFocusText itemId={id} variant="primary" className="title">
            {post.title}
          </HoverFocusText>
          {dateOnRight && (
            <div className={dottedDivider ? 'dotted-divider' : 'divider'} />
          )}
          {dateOnRight && post.pubDate && (
            <HoverFocusText itemId={id} variant="secondary" className="date">
              <FormattedDate date={post.pubDate} settings={settings} hideYear={hideYear} />
            </HoverFocusText>
          )}
        </div>
      </Link>
    </HoverFocusItem>
  )
}
