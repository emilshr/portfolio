'use client'

import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-[var(--space-16)] border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-3 px-[clamp(1.5rem,5vw,4rem)] py-[var(--space-8)]">
        <p className="inline-flex h-5 items-center font-display text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
          © {year} BurntClutchProject
        </p>
        <ThemeToggle className="shrink-0" />
      </div>
    </footer>
  )
}
