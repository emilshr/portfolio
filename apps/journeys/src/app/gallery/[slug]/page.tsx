import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { GalleryCollectionDetail } from '@/components/gallery/GalleryCollectionDetail'
import { galleryCollectionMetadata } from '@/lib/metadata'
import { getGalleryCollectionBySlug, mapGalleryCollectionImages } from '@/lib/payload'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const collection = await getGalleryCollectionBySlug(slug)
  if (!collection) return {}
  return galleryCollectionMetadata(collection)
}

export default async function GalleryCollectionPage({ params }: PageProps) {
  const { slug } = await params
  const collection = await getGalleryCollectionBySlug(slug)

  if (!collection) {
    notFound()
  }

  const images = mapGalleryCollectionImages(collection)

  return <GalleryCollectionDetail collection={collection} images={images} />
}
