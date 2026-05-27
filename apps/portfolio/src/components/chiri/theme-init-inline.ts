export const CHIRI_THEME_FOUC_STYLES = `
:root { --bg: #ffffff; }
html.dark { --bg: #1c1c1c; }
html { background-color: var(--bg); color-scheme: light; }
html.dark { color-scheme: dark; }
@media (prefers-color-scheme: dark) {
  html:not(.light) { --bg: #1c1c1c; color-scheme: dark; }
}
`
