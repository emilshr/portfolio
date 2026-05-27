export const THEME_STORAGE_KEY = 'chiri-theme'
export const THEME_COOKIE_NAME = 'chiri-theme'

export type ChiriTheme = 'light' | 'dark'

export function isChiriTheme(value: string | null | undefined): value is ChiriTheme {
  return value === 'light' || value === 'dark'
}

export function getSystemTheme(): ChiriTheme {
  if (typeof window === 'undefined') {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getStoredTheme(): ChiriTheme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isChiriTheme(stored) ? stored : null
  } catch {
    return null
  }
}

export function getEffectiveTheme(): ChiriTheme {
  return getStoredTheme() ?? getSystemTheme()
}

export function applyThemeClass(theme: ChiriTheme) {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(theme)
  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }))
}

export function persistTheme(theme: ChiriTheme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch (e) {
    console.warn('Failed to store theme:', e)
  }
  document.cookie = `${THEME_COOKIE_NAME}=${theme};path=/;max-age=31536000;SameSite=Lax`
  applyThemeClass(theme)
}

export function toggleTheme(): ChiriTheme {
  const next = getEffectiveTheme() === 'dark' ? 'light' : 'dark'
  persistTheme(next)
  return next
}

export function initThemeOnClient() {
  applyThemeClass(getEffectiveTheme())

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (getStoredTheme() !== null) return
    applyThemeClass(e.matches ? 'dark' : 'light')
  })
}
