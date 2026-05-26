'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type HoverFocusContextValue = {
  hoveredId: string | null
  setHoveredId: (id: string | null) => void
}

const HoverFocusContext = createContext<HoverFocusContextValue | null>(null)

function useHoverFocus() {
  const ctx = useContext(HoverFocusContext)
  if (!ctx) {
    throw new Error('Hover focus components must be used within HoverFocusProvider')
  }
  return ctx
}

type ProviderProps = {
  children: ReactNode
  className?: string
}

export function HoverFocusProvider({ children, className }: ProviderProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <HoverFocusContext.Provider value={{ hoveredId, setHoveredId }}>
      <div className={className} onMouseLeave={() => setHoveredId(null)}>
        {children}
      </div>
    </HoverFocusContext.Provider>
  )
}

type ItemProps = {
  id: string
  children: ReactNode
  className?: string
}

export function HoverFocusItem({ id, children, className }: ItemProps) {
  const { setHoveredId } = useHoverFocus()

  return (
    <li className={className} onMouseEnter={() => setHoveredId(id)}>
      {children}
    </li>
  )
}

const tone = {
  primary: {
    idle: { color: 'var(--text-primary)', opacity: 1 },
    active: { color: 'var(--text-primary)', opacity: 1 },
    muted: { color: 'var(--text-secondary)', opacity: 0.75 },
  },
  secondary: {
    idle: { color: 'var(--text-secondary)', opacity: 0.75 },
    active: { color: 'var(--text-primary)', opacity: 1 },
    muted: { color: 'var(--text-secondary)', opacity: 0.75 },
  },
} as const

type TextVariant = keyof typeof tone

type TextProps = {
  itemId: string
  variant?: TextVariant
  className?: string
  children: ReactNode
  as?: 'p' | 'span'
}

function useHoverFocusAnimate(itemId: string, variant: TextVariant) {
  const { hoveredId } = useHoverFocus()
  const reducedMotion = useReducedMotion()
  const hasHover = hoveredId !== null
  const isActive = hoveredId === itemId
  const state = !hasHover ? 'idle' : isActive ? 'active' : 'muted'

  return {
    animate: tone[variant][state],
    transition: reducedMotion ? { duration: 0 } : { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
  }
}

export function HoverFocusText({
  itemId,
  variant = 'primary',
  className,
  children,
  as = 'p',
}: TextProps) {
  const motionProps = useHoverFocusAnimate(itemId, variant)

  if (as === 'span') {
    return (
      <motion.span className={className} {...motionProps}>
        {children}
      </motion.span>
    )
  }

  return (
    <motion.p className={className} {...motionProps}>
      {children}
    </motion.p>
  )
}
