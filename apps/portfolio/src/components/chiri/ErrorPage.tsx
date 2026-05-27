import type { ReactNode } from 'react'

import { BackButton } from './BackButton'

type Props = {
  code: '404' | '500'
  title: string
  message: string
  detail?: string
  children?: ReactNode
}

export function ErrorPage({ code, title, message, detail, children }: Props) {
  return (
    <section className="flex min-h-[min(50vh,24rem)] flex-1 flex-col justify-center py-8">
      <p
        className="m-0 mb-2 text-5xl font-(length:--font-weight-light) leading-none tracking-(--spacing-s) text-(--text-secondary)"
        aria-hidden="true"
      >
        {code}
      </p>
      <h1 className="m-0 mb-2 text-(length:--font-size-l) font-(length:--font-weight-bold) tracking-(--spacing-m)">
        {title}
      </h1>
      <p className="m-0 max-w-md text-(length:--font-size-s) leading-relaxed text-(--text-secondary)">
        {message}
      </p>
      {detail && (
        <p className="mt-3 max-w-md break-words font-(family-name:--mono) text-(length:--font-size-s) leading-normal text-(--text-tertiary)">
          {detail}
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
        {children}
        <BackButton href="/" label="Home" className="m-0" />
      </div>
    </section>
  )
}
