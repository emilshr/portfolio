import type { Metadata } from 'next'

import { BentoGallery } from '@/components/gallery/BentoGallery'
import { buildPageMetadata } from '@/lib/metadata'
import { getGalleryItems } from '@/lib/payload'

export const metadata: Metadata = buildPageMetadata({
  title: 'Gallery',
  description: 'Photographs from every journey.',
  path: '/gallery',
})

export default async function GalleryPage() {
  const items = await getGalleryItems()

  return (
    <div className="mx-auto w-full max-w-6xl px-[clamp(1.5rem,5vw,4rem)] py-[var(--space-12)] md:py-[var(--space-16)]">
      <header className="mb-[var(--space-10)]">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Gallery</h1>
        <p className="mt-[var(--space-3)] max-w-2xl text-muted-foreground">
          Moments from the road — select any media item to explore fullscreen.
        </p>
      </header>
      <BentoGallery items={items} />
    </div>
  )
}
