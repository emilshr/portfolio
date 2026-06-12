'use client'

import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-border">
      <div className="page-container flex flex-col items-center justify-between gap-x-4 gap-y-3 py-8 sm:flex-row">
        <p className="inline-flex h-5 items-center font-display text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
          © {year} BurntClutchProject
        </p>
        <ThemeToggle className="shrink-0" />
      </div>
    </footer>
  )
}
