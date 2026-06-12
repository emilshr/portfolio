'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function Main({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const topLevelSegment = pathname.replace(/^\//, '')
  const isTopLevelRoute = topLevelSegment.length > 0 && !topLevelSegment.includes('/')
  const isArticleDetail = pathname.startsWith('/articles/') && pathname !== '/articles'
  const isGalleryDetail = pathname.startsWith('/gallery/') && pathname !== '/gallery'
  const nonArticleDetailTopLevelRoutes = new Set(['gallery', 'articles', 'vehicles'])
  const isLegacyTravelDetail =
    isTopLevelRoute && !nonArticleDetailTopLevelRoutes.has(topLevelSegment)
  const shouldOverlayHero = isHome || isArticleDetail || isGalleryDetail || isLegacyTravelDetail

  return <main className={shouldOverlayHero ? undefined : 'pt-16'}>{children}</main>
}
