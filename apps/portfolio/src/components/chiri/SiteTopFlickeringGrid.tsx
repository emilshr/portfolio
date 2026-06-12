'use client'

import dynamic from 'next/dynamic'

const SiteTopFlickeringGridClient = dynamic(
  () =>
    import('@/components/chiri/SiteTopFlickeringGrid.client').then(
      (mod) => mod.SiteTopFlickeringGridClient,
    ),
  { ssr: false },
)

export function SiteTopFlickeringGrid() {
  return <SiteTopFlickeringGridClient />
}
