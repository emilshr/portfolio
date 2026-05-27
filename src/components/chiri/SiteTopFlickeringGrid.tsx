'use client'

import { useEffect, useState } from 'react'

import { FlickeringGrid } from '@/components/ui/flickering-grid'

import { useChiriTheme } from './ThemeProvider'

const GRID_COLORS = {
  light: 'rgba(0, 0, 0, 0.2)',
  dark: 'rgba(255, 255, 255, 0.15)',
} as const

export function SiteTopFlickeringGrid() {
  const { theme } = useChiriTheme()
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(media.matches)

    const onChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches)
    }

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return (
    <div
      aria-hidden
      className="site-top-flickering-grid pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 z-0 w-screen overflow-hidden h-[min(7.5rem,15vh)] md:h-[min(9.5rem,18vh)]"
    >
      <FlickeringGrid
        className="size-full"
        squareSize={4}
        gridGap={6}
        flickerChance={reduceMotion ? 0 : 0.1}
        maxOpacity={0.25}
        color={GRID_COLORS[theme]}
      />
    </div>
  )
}
