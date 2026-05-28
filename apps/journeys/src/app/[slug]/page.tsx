import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { TravelDetail } from '@/components/travels/TravelDetail'
import { travelMetadata } from '@/lib/metadata'
import { getPublishedTravels, getTravelBySlug } from '@/lib/payload'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const travels = await getPublishedTravels()
    return travels.map((travel) => ({ slug: travel.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const travel = await getTravelBySlug(slug)
  if (!travel) return {}
  return travelMetadata(travel)
}

export default async function TravelPage({ params }: PageProps) {
  const { slug } = await params
  const travel = await getTravelBySlug(slug)

  if (!travel) {
    notFound()
  }

  return <TravelDetail travel={travel} />
}
