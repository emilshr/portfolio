'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

const themes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-11 w-[7.5rem] rounded-full bg-muted/60" aria-hidden />
  }

  return (
    <fieldset className="inline-flex items-center gap-0.5 rounded-full border border-border bg-muted/50 p-1">
      <legend className="sr-only">Theme</legend>
      {themes.map(({ value, label, icon: Icon }) => {
        const active = theme === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              'inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2.5 text-sm transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
            aria-pressed={active}
            aria-label={label}
            title={label}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </button>
        )
      })}
    </fieldset>
  )
}
