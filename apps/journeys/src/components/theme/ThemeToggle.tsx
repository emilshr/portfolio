'use client'

import { LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

const themes = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'Auto' },
] as const

type ThemeValue = (typeof themes)[number]['value']

type ThemeToggleProps = {
  className?: string
}

const labelClass =
  'relative inline-flex h-5 items-center px-0.5 text-xs uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm'

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const prefersReducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div
        className={cn(
          'inline-flex h-5 items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground/40 select-none',
          className,
        )}
        aria-hidden
      >
        Light · Dark · Auto
      </div>
    )
  }

  const activeTheme = (theme ?? 'light') as ThemeValue

  return (
    <LayoutGroup id="journeys-theme">
      <div
        role="group"
        aria-label="Color theme"
        className={cn('inline-flex items-center gap-2', className)}
      >
        {themes.map((option, index) => {
          const active = activeTheme === option.value

          return (
            <span key={option.value} className="inline-flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden className="select-none text-muted-foreground/25">
                  ·
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => setTheme(option.value)}
                className={cn(
                  labelClass,
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                aria-pressed={active}
                aria-label={`${option.label} theme`}
                title={`${option.label} theme`}
              >
                {option.label}
                {active ? (
                  prefersReducedMotion ? (
                    <span
                      className="absolute inset-x-0 bottom-0 h-px bg-foreground"
                      aria-hidden
                    />
                  ) : (
                    <motion.span
                      layoutId="journeys-theme-underline"
                      className="absolute inset-x-0 bottom-0 h-px bg-foreground"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      aria-hidden
                    />
                  )
                ) : null}
              </button>
            </span>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
