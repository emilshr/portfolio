'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function Main({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return <main className={isHome ? undefined : 'pt-16'}>{children}</main>
}
