'use client'

import { cn } from '@/utilities/ui'

import { useChiriTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggle } = useChiriTheme()

  return (
    <button
      type="button"
      className="flex cursor-pointer items-center border-none bg-transparent p-1 text-(--text-secondary)"
      aria-label="Toggle theme"
      aria-pressed={theme === 'dark'}
      onClick={toggle}
    >
      <svg
        className={cn(theme === 'dark' && 'hidden')}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
      >
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
      <svg
        className={cn(theme === 'light' && 'hidden')}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
      >
        <path
          d="M12.5 9.5a5 5 0 0 1-7-7 6 6 0 1 0 7 7z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
