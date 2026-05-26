'use client'

import { ProgressProvider } from '@bprogress/next/app'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider
      height="2px"
      color="var(--text-primary)"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  )
}
