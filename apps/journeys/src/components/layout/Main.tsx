'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function Main({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isTravelDetail = /^\/(?!gallery$|posts$)[^/]+$/.test(pathname)
  const shouldOverlayHero = isHome || isTravelDetail

  return <main className={shouldOverlayHero ? undefined : 'pt-16'}>{children}</main>
}
