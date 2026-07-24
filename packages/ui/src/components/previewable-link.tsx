import type { HTMLAttributeAnchorTarget, ReactNode } from "react"

import { externalLinkRel, isPreviewableUrl, isSafeHref } from "../lib/link-preview"
import { LinkPreview } from "./link-preview"

type PreviewableLinkProps = {
  href: string
  children: ReactNode
  className?: string
  target?: HTMLAttributeAnchorTarget
  rel?: string
}

/**
 * Server-Component-safe wrapper: only absolute http(s) URLs become a client
 * LinkPreview island. Internal / mailto / tel / hash links stay plain anchors.
 */
export function PreviewableLink({
  href,
  children,
  className,
  target,
  rel,
}: PreviewableLinkProps) {
  const resolvedRel = externalLinkRel(target, rel)

  if (isPreviewableUrl(href)) {
    return (
      <LinkPreview url={href} className={className} target={target} rel={resolvedRel}>
        {children}
      </LinkPreview>
    )
  }

  if (!isSafeHref(href)) {
    return <span className={className}>{children}</span>
  }

  return (
    <a href={href} className={className} target={target} rel={resolvedRel}>
      {children}
    </a>
  )
}

export { isPreviewableUrl, isSafeHref } from "../lib/link-preview"
