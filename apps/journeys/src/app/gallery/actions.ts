'use server'

import { getGalleryFolderMediaPage, type GalleryFolderMediaPage } from '@/lib/payload'

export async function loadGalleryPage(page: number): Promise<GalleryFolderMediaPage> {
  if (!Number.isFinite(page) || page < 2) {
    return { items: [], hasNextPage: false, page: 1, totalDocs: 0 }
  }

  return getGalleryFolderMediaPage({ page: Math.floor(page) })
}
