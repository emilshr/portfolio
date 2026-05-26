'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import type { SiteSettingsData } from '@/utilities/getSiteSettings'
import { ThemeToggle } from './ThemeToggle'

type Props = {
  settings: SiteSettingsData
}

export function Header({ settings }: Props) {
  const pathname = usePathname()

  useEffect(() => {
    const nav = pathname.replace(/\/$/, '') || '/'
    document.documentElement.dataset.navPage = nav === '/posts' ? 'posts' : 'home'
  }, [pathname])

  return (
    <header>
      <nav>
        <div className="site-title">
          <Link href="/" className="title-layer title-home">
            {settings.site.title}
          </Link>
          <span className="title-layer title-posts">Posts</span>
        </div>
        {settings.general.themeToggle && <ThemeToggle />}
      </nav>
    </header>
  )
}
