'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function Main({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const topLevelSegment = pathname.replace(/^\//, '')
  const isTopLevelRoute = topLevelSegment.length > 0 && !topLevelSegment.includes('/')
  const nonTravelTopLevelRoutes = new Set(['gallery', 'posts', 'articles', 'vehicles'])
  const isTravelDetail = isTopLevelRoute && !nonTravelTopLevelRoutes.has(topLevelSegment)
  const shouldOverlayHero = isHome || isTravelDetail

  return <main className={shouldOverlayHero ? undefined : 'pt-16'}>{children}</main>
}
