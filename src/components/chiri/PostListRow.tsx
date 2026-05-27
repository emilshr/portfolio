'use client'

import Link from 'next/link'

import type { Post } from '@/payload-types'
import type { SiteSettingsData } from '@/utilities/getSiteSettings'
import { cn } from '@/utilities/ui'

import {
  listDivider,
  listDottedDivider,
  postItemRow,
  postItemRowDateLeft,
  postItemTitle,
  postListLink,
} from './classNames'
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
  const dividerClass = dottedDivider ? listDottedDivider : listDivider

  return (
    <HoverFocusItem id={id}>
      <Link href={`/${post.slug}`} className={postListLink}>
        <div
          className={cn(postItemRow, !dateOnRight && postItemRowDateLeft)}
        >
          {!dateOnRight && post.pubDate && (
            <HoverFocusText itemId={id} variant="secondary" className="date">
              <FormattedDate date={post.pubDate} settings={settings} hideYear={hideYear} />
            </HoverFocusText>
          )}
          <HoverFocusText itemId={id} variant="primary" className={postItemTitle}>
            {post.title}
          </HoverFocusText>
          {dateOnRight && <div className={dividerClass} aria-hidden />}
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
