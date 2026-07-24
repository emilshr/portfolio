import type { UploadField } from 'payload'

import { galleryFolderFilterOptions } from '../utilities/galleryFolder'

type GalleryMediaFieldOptions = {
  name?: string
  label?: string
  description?: string
}

/**
 * Multi-select upload field scoped to the Gallery Settings folder.
 * Supports selecting existing folder media and attaching newly uploaded files.
 */
export function galleryMediaField({
  name = 'gallery',
  label = 'Gallery',
  description = 'Select existing media from the Gallery folder, or upload new files into that folder (Media library → Gallery folder), then select them here.',
}: GalleryMediaFieldOptions = {}): UploadField {
  return {
    name,
    type: 'upload',
    relationTo: 'media',
    hasMany: true,
    label,
    displayPreview: true,
    filterOptions: galleryFolderFilterOptions,
    admin: {
      description,
    },
  }
}
