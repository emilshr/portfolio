'use client'

import { ProgressProvider } from '@bprogress/next/app'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ProgressProvider
      height="2px"
      color="var(--foreground)"
      options={{ showSpinner: false }}
      shallowRouting
    >
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </ProgressProvider>
  )
}
