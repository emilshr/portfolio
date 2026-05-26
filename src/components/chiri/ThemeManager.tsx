import { CHIRI_THEME_FOUC_STYLES } from './theme-init-inline'

export function ThemeManager() {
  return <style dangerouslySetInnerHTML={{ __html: CHIRI_THEME_FOUC_STYLES }} />
}
