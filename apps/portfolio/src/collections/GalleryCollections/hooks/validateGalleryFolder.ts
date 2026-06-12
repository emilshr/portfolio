import type { CollectionBeforeChangeHook } from 'payload'

async function getGalleryFolderId(
  req: Parameters<CollectionBeforeChangeHook>[0]['req'],
): Promise<string | null> {
  const settings = await req.payload.findGlobal({
    slug: 'gallery-settings',
    depth: 0,
    overrideAccess: true,
  })

  const folder = settings?.folder
  if (!folder) return null
  return typeof folder === 'object' ? folder.id : folder
}

function getMediaId(media: unknown): string | null {
  if (!media) return null
  if (typeof media === 'string') return media
  if (typeof media === 'object' && media !== null && 'id' in media) {
    return String((media as { id: string }).id)
  }
  return null
}

export const validateGalleryFolder: CollectionBeforeChangeHook = async ({ data, req }) => {
  const folderId = await getGalleryFolderId(req)
  if (!folderId) {
    throw new Error(
      'Gallery Settings must have a media folder configured before adding gallery collections.',
    )
  }

  const mediaIds = new Set<string>()

  if (data?.coverImage) {
    const coverId = getMediaId(data.coverImage)
    if (coverId) mediaIds.add(coverId)
  }

  if (Array.isArray(data?.images)) {
    for (const entry of data.images) {
      const mediaId = getMediaId(entry?.media)
      if (mediaId) mediaIds.add(mediaId)
    }
  }

  if (mediaIds.size === 0) {
    return data
  }

  const mediaResult = await req.payload.find({
    collection: 'media',
    depth: 0,
    limit: mediaIds.size,
    pagination: false,
    overrideAccess: true,
    where: {
      id: { in: Array.from(mediaIds) },
    },
    select: {
      folder: true,
    },
  })

  for (const media of mediaResult.docs) {
    const mediaFolder =
      typeof media.folder === 'object' && media.folder !== null ? media.folder.id : media.folder

    if (mediaFolder !== folderId) {
      throw new Error(
        'All gallery collection images must belong to the folder configured in Gallery Settings.',
      )
    }
  }

  return data
}
