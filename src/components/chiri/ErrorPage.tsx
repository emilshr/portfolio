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
    <section className="chiri-error-page">
      <p className="chiri-error-page__code" aria-hidden="true">
        {code}
      </p>
      <h1 className="chiri-error-page__title">{title}</h1>
      <p className="chiri-error-page__message">{message}</p>
      {detail && <p className="chiri-error-page__detail">{detail}</p>}
      <div className="chiri-error-page__actions">
        {children}
        <BackButton href="/" label="Home" />
      </div>
    </section>
  )
}
