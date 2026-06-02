"use client"

import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { cn } from "../lib/utils"

export type BentoGridProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode
}

export type BentoCardProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode
}

export function BentoGrid({ children, className, ...props }: BentoGridProps) {
  return (
    <div
      className={cn("grid w-full auto-rows-[8rem] grid-cols-1 gap-3 md:grid-cols-4 md:gap-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function BentoCard({ children, className, ...props }: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
