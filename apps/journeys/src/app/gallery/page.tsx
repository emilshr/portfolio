import type { Metadata } from 'next'

import { GalleryCollectionCard } from '@/components/gallery/GalleryCollectionCard'
import { buildPageMetadata, formatPageTitle } from '@/lib/metadata'
import { getGallerySettings, getPublishedGalleryCollections } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGallerySettings()
  return buildPageMetadata({
    title: settings?.meta?.title ?? formatPageTitle('Gallery'),
    description: settings?.meta?.description || 'Photographs from every journey.',
    path: '/gallery',
  })
}

export default async function GalleryPage() {
  const collections = await getPublishedGalleryCollections()

  return (
    <div className="page-container py-12 md:py-16">
      <header className="mb-10">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Gallery</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Photo collections from trips and expeditions.
        </p>
      </header>
      {collections.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <GalleryCollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No gallery collections yet.</p>
      )}
    </div>
  )
}
