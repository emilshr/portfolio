import type { PayloadRequest, Where } from 'payload'

export async function getGalleryFolderId(req: PayloadRequest): Promise<string | null> {
  const settings = await req.payload.findGlobal({
    slug: 'gallery-settings',
    depth: 0,
    overrideAccess: true,
  })

  const folder = settings?.folder
  if (!folder) return null
  return typeof folder === 'object' ? folder.id : folder
}

/** Restrict upload/relationship pickers to the Gallery Settings media folder. */
export async function galleryFolderFilterOptions({
  req,
}: {
  req: PayloadRequest
}): Promise<Where | false> {
  const folderId = await getGalleryFolderId(req)
  if (!folderId) return false
  return { folder: { equals: folderId } }
}

export function getMediaId(media: unknown): string | null {
  if (!media) return null
  if (typeof media === 'string') return media
  if (typeof media === 'object' && media !== null && 'id' in media) {
    return String((media as { id: string }).id)
  }
  return null
}

/**
 * Collect media IDs from a hasMany upload value, or a legacy array of `{ media }` rows.
 */
export function collectMediaIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  const ids: string[] = []
  for (const entry of value) {
    if (typeof entry === 'string') {
      ids.push(entry)
      continue
    }
    if (entry && typeof entry === 'object') {
      if ('media' in entry) {
        const id = getMediaId((entry as { media: unknown }).media)
        if (id) ids.push(id)
        continue
      }
      const id = getMediaId(entry)
      if (id) ids.push(id)
    }
  }
  return ids
}

export async function assertMediaBelongsToGalleryFolder(
  req: PayloadRequest,
  mediaIds: string[],
  options?: { requireFolderConfigured?: boolean },
): Promise<void> {
  const requireFolder = options?.requireFolderConfigured ?? false
  const folderId = await getGalleryFolderId(req)

  if (!folderId) {
    if (requireFolder) {
      throw new Error(
        'Gallery Settings must have a media folder configured before adding gallery media.',
      )
    }
    return
  }

  if (mediaIds.length === 0) return

  const uniqueIds = Array.from(new Set(mediaIds))
  const mediaResult = await req.payload.find({
    collection: 'media',
    depth: 0,
    limit: uniqueIds.length,
    pagination: false,
    overrideAccess: true,
    where: {
      id: { in: uniqueIds },
    },
    select: {
      folder: true,
    },
  })

  for (const media of mediaResult.docs) {
    const mediaFolder =
      typeof media.folder === 'object' && media.folder !== null ? media.folder.id : media.folder

    if (mediaFolder !== folderId) {
      throw new Error('All gallery media must belong to the folder configured in Gallery Settings.')
    }
  }
}
