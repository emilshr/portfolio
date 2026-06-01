'use client'

import { useReducedMotion } from 'motion/react'
import { annotate } from 'rough-notation'
import type { RoughAnnotation } from 'rough-notation/lib/model'
import Link from 'next/link'
import {
  useCallback,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'

function highlightColor(homeOverCover: boolean): string {
  return homeOverCover
    ? 'color-mix(in srgb, white 28%, transparent)'
    : 'color-mix(in srgb, var(--muted-foreground) 22%, transparent)'
}

type HeaderNavHighlightLinkProps = {
  children: ReactNode
  homeOverCover: boolean
  className?: string
} & (
  | ({ href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'className'>)
  | ({
      href: string
      external: true
    } & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className'>)
)

export function HeaderNavHighlightLink({
  children,
  homeOverCover,
  className,
  href,
  ...rest
}: HeaderNavHighlightLinkProps) {
  const prefersReducedMotion = useReducedMotion()
  const labelRef = useRef<HTMLSpanElement>(null)
  const annotationRef = useRef<RoughAnnotation | null>(null)
  const color = highlightColor(homeOverCover)

  const removeAnnotation = useCallback(() => {
    annotationRef.current?.remove()
    annotationRef.current = null
  }, [])

  const showHighlight = useCallback(() => {
    if (prefersReducedMotion) return

    const element = labelRef.current
    if (!element) return

    if (!annotationRef.current) {
      annotationRef.current = annotate(element, {
        type: 'highlight',
        color,
        strokeWidth: 1.5,
        animationDuration: 600,
        iterations: 1,
        padding: 2,
        multiline: false,
      })
    }

    annotationRef.current.show()
  }, [color, prefersReducedMotion])

  const hideHighlight = useCallback(() => {
    annotationRef.current?.hide()
  }, [])

  useEffect(() => {
    removeAnnotation()
  }, [color, removeAnnotation])

  useEffect(() => removeAnnotation, [removeAnnotation])

  const label = (
    <span ref={labelRef} className="relative inline-block bg-transparent">
      {children}
    </span>
  )

  const hoverHandlers = {
    onMouseEnter: showHighlight,
    onMouseLeave: hideHighlight,
    onFocus: showHighlight,
    onBlur: hideHighlight,
  }

  if ('external' in rest && rest.external) {
    const { external: _external, ...anchorRest } = rest
    return (
      <a
        href={href}
        className={className}
        {...hoverHandlers}
        {...anchorRest}
      >
        {label}
      </a>
    )
  }

  const linkRest = rest as Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'className'>

  return (
    <Link href={href} className={className} {...hoverHandlers} {...linkRest}>
      {label}
    </Link>
  )
}
