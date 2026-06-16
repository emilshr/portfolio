import { Feed } from 'feed'
import sanitizeHtml from 'sanitize-html'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

import { getPublicPayload, PUBLIC_PAYLOAD_QUERY } from './payloadPublicQuery'
import { getSiteSettings } from './getSiteSettings'
import { getServerSideURL } from './getURL'

export async function generateFeedInstance() {
  const settings = await getSiteSettings()
  const siteUrl = getServerSideURL()
  const payload = await getPublicPayload()

  const { docs: posts } = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    limit: 1000,
    depth: 0,
    select: {
      title: true,
      slug: true,
      content: true,
      publishedAt: true,
    },
    ...PUBLIC_PAYLOAD_QUERY,
  })

  const feed = new Feed({
    title: settings.site.title,
    description: settings.site.description,
    id: siteUrl,
    link: siteUrl,
    language: settings.site.language,
    copyright: `Copyright © ${new Date().getFullYear()} ${settings.site.author}`,
    updated: new Date(),
    generator: 'Payload Portfolio Feed',
    feedLinks: {
      rss: `${siteUrl}/rss.xml`,
      atom: `${siteUrl}/atom.xml`,
    },
    author: {
      name: settings.site.author,
      link: siteUrl,
    },
  })

  for (const post of posts) {
    const postUrl = `${siteUrl}/${post.slug}`
    let cleanHtml = ''

    if (post.content) {
      const html = convertLexicalToHTML({
        data: post.content,
      })
      cleanHtml = sanitizeHtml(html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          a: ['href', 'title', 'target', 'rel'],
          img: ['src', 'alt', 'title', 'width', 'height'],
        },
      })
    }

    const plainText = sanitizeHtml(cleanHtml, { allowedTags: [], allowedAttributes: {} })
      .replace(/\s+/g, ' ')
      .trim()
    const description = plainText.length > 200 ? `${plainText.slice(0, 200)}...` : plainText

    feed.addItem({
      title: post.title,
      id: postUrl,
      link: postUrl,
      description,
      content: cleanHtml,
      date: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      published: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    })
  }

  return feed
}

export async function generateRSS() {
  const feed = await generateFeedInstance()
  const rssXml = feed
    .rss2()
    .replace(
      '<?xml version="1.0" encoding="utf-8"?>',
      '<?xml version="1.0" encoding="utf-8"?>\n<?xml-stylesheet type="text/xsl" href="/feeds/rss-style.xsl"?>',
    )
  return new Response(rssXml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}

export async function generateAtom() {
  const feed = await generateFeedInstance()
  const atomXml = feed
    .atom1()
    .replace(
      '<?xml version="1.0" encoding="utf-8"?>',
      '<?xml version="1.0" encoding="utf-8"?>\n<?xml-stylesheet type="text/xsl" href="/feeds/atom-style.xsl"?>',
    )
  return new Response(atomXml, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  })
}
