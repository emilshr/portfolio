import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { getGalleryFolderId } from '@/utilities/galleryFolder'
import { revalidateJourneys } from '@/utilities/revalidateJourneys'

function resolveFolderId(folder: unknown): string | null {
  if (!folder) return null
  if (typeof folder === 'string') return folder
  if (typeof folder === 'object' && folder !== null && 'id' in folder) {
    return String((folder as { id: string }).id)
  }
  return null
}

export const revalidateGalleryFolderMedia: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (req.context.disableRevalidate) {
    return doc
  }

  const galleryFolderId = await getGalleryFolderId(req)
  if (!galleryFolderId) return doc

  const currentFolder = resolveFolderId(doc.folder)
  const previousFolder = resolveFolderId(previousDoc?.folder)

  if (currentFolder === galleryFolderId || previousFolder === galleryFolderId) {
    await revalidateJourneys({ tags: ['gallery'] })
  }

  return doc
}

export const revalidateGalleryFolderMediaDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  if (req.context.disableRevalidate) {
    return doc
  }

  const galleryFolderId = await getGalleryFolderId(req)
  if (!galleryFolderId) return doc

  if (resolveFolderId(doc?.folder) === galleryFolderId) {
    await revalidateJourneys({ tags: ['gallery'] })
  }

  return doc
}
