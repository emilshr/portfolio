import type { CollectionBeforeChangeHook } from 'payload'

import { validateGalleryMediaInFolder } from '../../../hooks/validateGalleryMediaInFolder'

export const validateGalleryFolder: CollectionBeforeChangeHook = validateGalleryMediaInFolder({
  fieldName: 'images',
  alsoCheck: ['coverImage'],
  requireFolderConfigured: true,
})
