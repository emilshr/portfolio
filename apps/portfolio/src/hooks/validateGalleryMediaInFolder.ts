import type { CollectionBeforeChangeHook } from 'payload'

import {
  assertMediaBelongsToGalleryFolder,
  collectMediaIds,
  getMediaId,
} from '../utilities/galleryFolder'

type ValidateGalleryMediaOptions = {
  /** Field that holds hasMany media IDs (or legacy `{ media }` rows). */
  fieldName: 'gallery' | 'images'
  /** Also validate these single upload fields (e.g. coverImage). */
  alsoCheck?: string[]
  /** Throw if Gallery Settings has no folder (gallery-collections). */
  requireFolderConfigured?: boolean
}

/**
 * Ensures gallery media (and optional cover) live in the Gallery Settings folder.
 */
export function validateGalleryMediaInFolder({
  fieldName,
  alsoCheck = [],
  requireFolderConfigured = false,
}: ValidateGalleryMediaOptions): CollectionBeforeChangeHook {
  return async ({ data, req }) => {
    if (!data) return data

    const mediaIds = new Set<string>(collectMediaIds(data[fieldName]))

    for (const key of alsoCheck) {
      const id = getMediaId(data[key])
      if (id) mediaIds.add(id)
    }

    await assertMediaBelongsToGalleryFolder(req, Array.from(mediaIds), {
      requireFolderConfigured,
    })

    return data
  }
}
