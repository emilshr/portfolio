import type { Post, ArchiveBlock as ArchiveBlockProps } from '@repo/payload-types'

import { getPublicPayload, PUBLIC_PAYLOAD_QUERY } from '@/utilities/payloadPublicQuery'
import React from 'react'
import RichText from '@/components/RichText'

import { PostList } from '@/components/chiri/PostList'
import { getSiteSettings } from '@/utilities/getSiteSettings'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, introContent, limit: limitFromProps, populateBy, selectedDocs } = props

  const limit = limitFromProps || 10
  const settings = await getSiteSettings()

  let posts: Post[] = []

  if (populateBy === 'collection') {
    const payload = await getPublicPayload()

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 0,
      limit,
      sort: '-publishedAt',
      ...PUBLIC_PAYLOAD_QUERY,
    })

    posts = fetchedPosts.docs
  } else if (selectedDocs?.length) {
    posts = selectedDocs
      .map((post) => (typeof post.value === 'object' ? post.value : null))
      .filter(Boolean) as Post[]
  }

  return (
    <div id={id ? `block-${id}` : undefined}>
      {introContent && <RichText data={introContent} enableGutter={false} enableProse />}
      <PostList posts={posts} settings={settings} />
    </div>
  )
}
