'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'

import { HeaderNavHighlightLink } from '@/components/layout/HeaderNavHighlight'
import type { HeaderMenuItem } from '@/lib/payload'
import { cn } from '@/lib/utils'

const fallbackMenuItems: HeaderMenuItem[] = [
  { id: 'fallback-gallery', label: 'Gallery', url: '/gallery', openInNewTab: false },
  {
    id: 'fallback-instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/burntclutchproject/',
    openInNewTab: true,
  },
]

const solidHeaderClass =
  'border-b border-border/60 bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/50'

type SiteHeaderProps = {
  menuItems: HeaderMenuItem[]
}

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url)
}

export function SiteHeader({ menuItems }: SiteHeaderProps) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isTravelDetail = /^\/(?!gallery$|posts$)[^/]+$/.test(pathname)
  const isOverlayHeroRoute = isHome || isTravelDetail
  const [pastCover, setPastCover] = useState(false)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const overlayMenuItems = useMemo(
    () => (menuItems.length ? menuItems : fallbackMenuItems),
    [menuItems],
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  useEffect(() => {
    if (!isOverlayHeroRoute) {
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
  }, [isOverlayHeroRoute, pathname])

  const overCover = isOverlayHeroRoute && !pastCover
  const heroOverlayHeader = overCover && mounted && resolvedTheme === 'dark' && !menuOpen

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
          heroOverlayHeader ? 'border-transparent bg-transparent' : solidHeaderClass,
        )}
      >
        <div className="relative mx-auto grid h-16 w-full max-w-6xl grid-cols-1 items-center px-0 sm:px-[clamp(1.5rem,5vw,4rem)]">
          <div className="absolute left-0 top-0 z-10 flex h-16 items-center justify-start">
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="site-fullscreen-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className={cn(
                'inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                heroOverlayHeader
                  ? 'text-white/90 hover:bg-white/10 hover:text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
              <span className="relative block h-4 w-5">
                <span
                  className={cn(
                    'absolute left-0 top-0.5 h-0.5 w-5 rounded-full bg-current transition-transform duration-300',
                    menuOpen && 'translate-y-[6px] rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition-opacity duration-300',
                    menuOpen && 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-[13px] h-0.5 w-5 rounded-full bg-current transition-transform duration-300',
                    menuOpen && '-translate-y-[6px] -rotate-45',
                  )}
                />
              </span>
            </button>
          </div>

          <div className="flex justify-center">
            <HeaderNavHighlightLink
              href="/"
              heroOverlay={heroOverlayHeader}
              className={cn(
                'inline-flex h-11 min-h-11 items-center px-2 font-display text-sm font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm sm:text-base sm:px-3',
                heroOverlayHeader ? 'text-white hover:text-white/90' : 'text-foreground',
              )}
            >
              BurntClutchProject
            </HeaderNavHighlightLink>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="site-fullscreen-menu"
            key="site-fullscreen-menu"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-30 bg-background/95 backdrop-blur-md"
          >
            <motion.nav
              aria-label="Site menu"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
              transition={
                prefersReducedMotion
                  ? undefined
                  : {
                      duration: 0.3,
                      ease: 'easeOut',
                      staggerChildren: 0.06,
                      delayChildren: 0.06,
                    }
              }
              className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 pt-16"
            >
              <ul className="flex w-full max-w-xl flex-col items-center gap-4 text-center sm:gap-6">
                {overlayMenuItems.map((item) => {
                  const external = isExternalUrl(item.url)
                  const shouldOpenInNewTab = external || Boolean(item.openInNewTab)
                  const linkClass = cn(
                    'inline-flex rounded-sm px-2 py-1 font-display text-[clamp(2rem,8vw,4.5rem)] leading-none tracking-tight text-foreground transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    'justify-center',
                  )
                  return (
                    <motion.li
                      key={item.id}
                      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
                      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                      transition={prefersReducedMotion ? undefined : { duration: 0.24, ease: 'easeOut' }}
                      className="w-full"
                    >
                      {external ? (
                        <HeaderNavHighlightLink
                          href={item.url}
                          external
                          target={shouldOpenInNewTab ? '_blank' : undefined}
                          rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
                          heroOverlay={false}
                          className={linkClass}
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.label}
                        </HeaderNavHighlightLink>
                      ) : (
                        <HeaderNavHighlightLink
                          href={item.url}
                          heroOverlay={false}
                          className={linkClass}
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.label}
                        </HeaderNavHighlightLink>
                      )}
                    </motion.li>
                  )
                })}
              </ul>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
