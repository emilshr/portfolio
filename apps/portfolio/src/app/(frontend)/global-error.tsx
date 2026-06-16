'use client'

import { ErrorPage } from '@/components/chiri/ErrorPage'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <ErrorPage code="500" title="Something went wrong" message="An unexpected error occurred.">
          <button type="button" onClick={reset} className="text-(length:--font-size-s) underline">
            Try again
          </button>
        </ErrorPage>
      </body>
    </html>
  )
}
