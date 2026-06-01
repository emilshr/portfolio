'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

const INSTAGRAM_URL = 'https://www.instagram.com/burntclutchproject/'

const navLinkClass =
  'inline-flex h-11 min-h-11 items-center px-2 text-sm uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md sm:px-3'

export function SiteHeader() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [pastCover, setPastCover] = useState(false)

  useEffect(() => {
    if (!isHome) {
      setPastCover(false)
      return
    }

    const sentinel = document.getElementById('hero-cover-sentinel')
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastCover(!entry.isIntersecting)
      },
      { rootMargin: '-64px 0px 0px 0px', threshold: 0 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [isHome])

  const homeOverCover = isHome && !pastCover

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
        homeOverCover
          ? 'border-transparent bg-transparent'
          : 'border-b border-border/60 bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/50',
      )}
    >
      <div className="mx-auto grid h-16 w-full max-w-6xl grid-cols-3 items-center gap-4 px-[clamp(1.5rem,5vw,4rem)]">
        <div className="flex justify-start sm:justify-end">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              navLinkClass,
              homeOverCover
                ? 'text-white/90 hover:text-white'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Instagram
          </a>
        </div>

        <div className="flex justify-center">
          <Link
            href="/"
            className={cn(
              'font-display text-sm font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm sm:text-base',
              homeOverCover ? 'text-white hover:text-white/90' : 'text-foreground',
            )}
          >
            BurntClutchProject
          </Link>
        </div>

        <div className="flex justify-end sm:justify-start">
          <Link
            href="/gallery"
            className={cn(
              navLinkClass,
              homeOverCover
                ? 'text-white/90 hover:text-white'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Gallery
          </Link>
        </div>
      </div>
    </header>
  )
}
