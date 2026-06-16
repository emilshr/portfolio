import { revalidateTag } from 'next/cache'

import type { CollectionSlug } from 'payload'

export function revalidateDocumentCacheTags(
  collection: CollectionSlug,
  doc: { id?: string; slug?: string | null },
): void {
  if (doc.slug) {
    revalidateTag(`${collection}_${doc.slug}`, 'max')
  }

  if (doc.id) {
    revalidateTag(`${collection}_id_${doc.id}`, 'max')
  }
}
