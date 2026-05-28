import Link from 'next/link'

import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/gallery', label: 'Gallery' },
  { href: '/posts', label: 'Posts' },
]

export function SiteHeader() {
  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 border-b border-border/60',
        'bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/50',
      )}
    >
      <div className="container-content flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-display text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          Journeys
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex h-11 min-h-11 items-center px-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
