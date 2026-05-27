'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { SiteSettingsData } from '@/utilities/getSiteSettings'
import { cn } from '@/utilities/ui'

import { ThemeToggle } from './ThemeToggle'

type Props = {
  settings: SiteSettingsData
}

const titleLayerBase =
  'inline-block transition-[opacity,filter] duration-400 ease-in-out'

export function Header({ settings }: Props) {
  const pathname = usePathname()
  const nav = pathname.replace(/\/$/, '') || '/'
  const isPosts = nav === '/posts'

  return (
    <header>
      <nav className="flex items-center justify-between">
        <div className="relative inline-block min-h-[1.25em] min-w-12 font-bold text-(--text-primary)">
          <Link
            href="/"
            className={cn(
              titleLayerBase,
              'font-bold text-(--text-primary) no-underline',
              isPosts
                ? 'pointer-events-none absolute left-0 top-0 opacity-0 blur-sm'
                : 'relative opacity-100 blur-none',
            )}
          >
            {settings.site.title}
          </Link>
          <span
            className={cn(
              titleLayerBase,
              isPosts
                ? 'relative opacity-100 blur-none'
                : 'pointer-events-none absolute left-0 top-0 opacity-0 blur-sm',
            )}
          >
            Posts
          </span>
        </div>
        {settings.general.themeToggle && <ThemeToggle />}
      </nav>
    </header>
  )
}
