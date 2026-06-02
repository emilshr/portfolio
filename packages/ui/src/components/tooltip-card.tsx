"use client"

import type { ReactNode } from "react"

import { cn } from "../lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

type TooltipCardProps = {
  children: ReactNode
  content: ReactNode
  disabled?: boolean
  side?: "top" | "right" | "bottom" | "left"
  className?: string
  contentClassName?: string
}

export function TooltipCard({
  children,
  content,
  disabled = false,
  side = "top",
  className,
  contentClassName,
}: TooltipCardProps) {
  if (disabled) {
    return <>{children}</>
  }

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          className={cn(
            "max-w-xs rounded-lg border border-border bg-card px-3 py-2 text-left text-xs text-muted-foreground shadow-lg",
            className,
            contentClassName,
          )}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
