'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { HeaderNavHighlightLink } from '@/components/layout/HeaderNavHighlight'
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
      <div className="mx-auto grid h-16 w-full max-w-6xl grid-cols-3 items-center gap-0.5 sm:gap-4 px-0 sm:px-[clamp(1.5rem,5vw,4rem)]">
        <div className="flex justify-start sm:justify-end">
          <HeaderNavHighlightLink
            href={INSTAGRAM_URL}
            external
            target="_blank"
            rel="noopener noreferrer"
            homeOverCover={homeOverCover}
            className={cn(
              navLinkClass,
              homeOverCover
                ? 'text-white/90 hover:text-white'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Instagram
          </HeaderNavHighlightLink>
        </div>

        <div className="flex justify-center">
          <HeaderNavHighlightLink
            href="/"
            homeOverCover={homeOverCover}
            className={cn(
              'inline-flex h-11 min-h-11 items-center px-2 font-display text-sm font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm sm:text-base sm:px-3',
              homeOverCover ? 'text-white hover:text-white/90' : 'text-foreground',
            )}
          >
            BurntClutchProject
          </HeaderNavHighlightLink>
        </div>

        <div className="flex justify-end sm:justify-start">
          <HeaderNavHighlightLink
            href="/gallery"
            homeOverCover={homeOverCover}
            className={cn(
              navLinkClass,
              homeOverCover
                ? 'text-white/90 hover:text-white'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Gallery
          </HeaderNavHighlightLink>
        </div>
      </div>
    </header>
  )
}
