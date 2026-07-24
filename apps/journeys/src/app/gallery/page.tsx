import type { Metadata } from 'next'

import { GalleryInfiniteGrid } from '@/components/gallery/GalleryInfiniteGrid'
import { buildPageMetadata, formatPageTitle } from '@/lib/metadata'
import { getGalleryFolderMediaPage, getGallerySettings } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGallerySettings()
  return buildPageMetadata({
    title: settings?.meta?.title ?? formatPageTitle('Gallery'),
    description: settings?.meta?.description || 'Photographs from every journey.',
    path: '/gallery',
  })
}

export default async function GalleryPage() {
  const settings = await getGallerySettings()
  const folderConfigured = Boolean(settings?.folder)
  const firstPage = await getGalleryFolderMediaPage({ page: 1 })

  return (
    <div className="page-container py-12 md:py-16">
      <header className="mb-10">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Gallery</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Photographs from trips and expeditions.
        </p>
      </header>

      {!folderConfigured ? (
        <p className="text-muted-foreground">
          Gallery folder is not configured yet. Set a media folder in Gallery Settings, then upload
          photos there.
        </p>
      ) : (
        <GalleryInfiniteGrid
          initialItems={firstPage.items}
          initialHasNextPage={firstPage.hasNextPage}
          initialPage={firstPage.page}
        />
      )}
    </div>
  )
}
