import type { CollectionConfig } from 'payload'

/** Compound indexes for draft/publish collections queried by status and date. */
export const publishedAtStatusIndexes: NonNullable<CollectionConfig['indexes']> = [
  {
    fields: ['_status', 'publishedAt'],
  },
]

/** Featured articles listing on journeys home. */
export const featuredArticleIndexes: NonNullable<CollectionConfig['indexes']> = [
  {
    fields: ['featured', '_status', 'publishedAt'],
  },
]
