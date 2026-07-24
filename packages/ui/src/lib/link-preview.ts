import type { HTMLAttributeAnchorTarget } from "react"

/** True when a URL can be screenshot-previewed via Microlink. */
export function isPreviewableUrl(url: string | null | undefined): url is string {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

/** Blocks javascript:/data: and other non-navigable schemes for plain anchors. */
export function isSafeHref(url: string | null | undefined): url is string {
  if (!url) return false
  if (url.startsWith("#") || url.startsWith("/") || url.startsWith("?")) return true
  if (url.startsWith("mailto:") || url.startsWith("tel:")) return true
  return isPreviewableUrl(url)
}

export function externalLinkRel(
  target: HTMLAttributeAnchorTarget | undefined,
  rel: string | undefined,
): string | undefined {
  if (target !== "_blank") return rel
  const tokens = new Set((rel ?? "").split(/\s+/).filter(Boolean))
  tokens.add("noopener")
  tokens.add("noreferrer")
  return Array.from(tokens).join(" ")
}
