import type { Metadata } from 'next'

import { BentoGallery } from '@/components/gallery/BentoGallery'
import { buildPageMetadata } from '@/lib/metadata'
import { getGalleryItems, getGallerySettings } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGallerySettings()
  return buildPageMetadata({
    title: settings?.meta?.title || 'Gallery',
    description: settings?.meta?.description || 'Photographs from every journey.',
    path: '/gallery',
  })
}

export default async function GalleryPage() {
  const items = await getGalleryItems()

  return (
    <div className="page-container py-12 md:py-16">
      <header className="mb-10">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Gallery</h1>
      </header>
      <BentoGallery items={items} />
    </div>
  )
}
