import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '@repo/payload-types'

import { revalidateDocumentCacheTags } from '@/utilities/revalidateDocumentCache'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidatePath('/')
      revalidateTag('posts-sitemap', 'max')
      revalidateDocumentCacheTags('posts', doc)
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath('/')
      revalidateTag('posts-sitemap', 'max')
      revalidateDocumentCacheTags('posts', previousDoc)
    }

    if (previousDoc.slug !== doc.slug) {
      revalidateDocumentCacheTags('posts', previousDoc)
      revalidateDocumentCacheTags('posts', doc)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/${doc?.slug}`

    revalidatePath(path)
    revalidatePath('/')
    revalidateTag('posts-sitemap', 'max')
    if (doc) {
      revalidateDocumentCacheTags('posts', doc)
    }
  }

  return doc
}
