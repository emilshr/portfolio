'use client'

import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from 'react'

import {
  getEffectiveTheme,
  initThemeOnClient,
  toggleTheme,
  type ChiriTheme,
} from '@/lib/chiri-theme'

type ThemeContextValue = {
  theme: ChiriTheme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

type Props = {
  children: ReactNode
  initialTheme?: ChiriTheme
}

export function ThemeProvider({ children, initialTheme }: Props) {
  const [theme, setTheme] = useState<ChiriTheme>(initialTheme ?? 'light')

  useLayoutEffect(() => {
    initThemeOnClient()
    setTheme(getEffectiveTheme())
  }, [])

  const toggle = () => {
    setTheme(toggleTheme())
  }

  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>
}

export function useChiriTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useChiriTheme must be used within ThemeProvider')
  }
  return context
}
