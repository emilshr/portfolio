"use client"

import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react"
import { encode } from "qss"
import { useState, type HTMLAttributeAnchorTarget, type MouseEvent, type ReactNode } from "react"

import { externalLinkRel } from "../lib/link-preview"
import { cn } from "../lib/utils"

const SPRING_CONFIG = { stiffness: 100, damping: 15 } as const

type LinkPreviewProps = {
  children: ReactNode
  url: string
  className?: string
  width?: number
  height?: number
  target?: HTMLAttributeAnchorTarget
  rel?: string
} & ({ isStatic: true; imageSrc: string } | { isStatic?: false; imageSrc?: never })

export function LinkPreview({
  children,
  url,
  className,
  width = 200,
  height = 125,
  target,
  rel,
  isStatic = false,
  imageSrc = "",
}: LinkPreviewProps) {
  const src = isStatic
    ? imageSrc
    : `https://api.microlink.io/?${encode({
        url,
        screenshot: true,
        meta: false,
        embed: "screenshot.url",
        colorScheme: "dark",
        "viewport.isMobile": true,
        "viewport.deviceScaleFactor": 1,
        "viewport.width": width * 3,
        "viewport.height": height * 3,
      })}`

  const [isOpen, setOpen] = useState(false)
  const [hasLoadedPreview, setHasLoadedPreview] = useState(false)
  const reduceMotion = useReducedMotion()

  const x = useMotionValue(0)
  const translateX = useSpring(x, SPRING_CONFIG)
  const resolvedRel = externalLinkRel(target, rel)

  const handleMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion) return
    const targetRect = event.currentTarget.getBoundingClientRect()
    const eventOffsetX = event.clientX - targetRect.left
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2
    x.set(offsetFromCenter)
  }

  return (
    <HoverCardPrimitive.Root
      openDelay={50}
      closeDelay={100}
      onOpenChange={(open) => {
        setOpen(open)
        if (open) setHasLoadedPreview(true)
      }}
    >
      <HoverCardPrimitive.Trigger
        onMouseMove={handleMouseMove}
        className={cn(className)}
        href={url}
        target={target}
        rel={resolvedRel}
      >
        {children}
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          className="z-[100] [transform-origin:var(--radix-hover-card-content-transform-origin)]"
          side="top"
          align="center"
          sideOffset={10}
          collisionPadding={8}
        >
          <AnimatePresence>
            {isOpen ? (
              <motion.div
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.6 }}
                animate={
                  reduceMotion
                    ? { opacity: 1 }
                    : {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        },
                      }
                }
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.6 }}
                className="rounded-xl shadow-xl"
                style={reduceMotion ? undefined : { x: translateX }}
              >
                <a
                  href={url}
                  target={target}
                  rel={resolvedRel}
                  className="block rounded-xl border-2 border-transparent bg-white p-1 shadow hover:border-neutral-200 dark:hover:border-neutral-800"
                  style={{ fontSize: 0 }}
                  tabIndex={-1}
                >
                  {hasLoadedPreview ? (
                    <img
                      src={isStatic ? imageSrc : src}
                      width={width}
                      height={height}
                      className="rounded-lg"
                      alt=""
                    />
                  ) : null}
                </a>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  )
}
