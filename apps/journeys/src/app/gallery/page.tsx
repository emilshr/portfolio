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
    <div className="mx-auto w-full max-w-6xl px-[clamp(1.5rem,5vw,4rem)] py-[var(--space-12)] md:py-[var(--space-16)]">
      <header className="mb-[var(--space-10)]">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Gallery</h1>
      </header>
      <BentoGallery items={items} />
    </div>
  )
}
