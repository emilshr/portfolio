'use client'

import { useEffect } from 'react'

import { ErrorPage } from '@/components/chiri/ErrorPage'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const isDev = process.env.NODE_ENV === 'development'
  const detail = error.digest ?? error.message

  return (
    <ErrorPage
      code="500"
      title="Something went wrong"
      message="An unexpected error occurred. You can try again or return home."
      detail={isDev && detail ? detail : undefined}
    >
      <button
        type="button"
        className="cursor-pointer border-none bg-transparent p-0 font-inherit text-(length:--font-size-s) tracking-(--spacing-m) text-(--text-secondary) no-underline hover:text-(--text-primary)"
        onClick={reset}
      >
        Try again
      </button>
    </ErrorPage>
  )
}
