export function ThemeManager() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root { --bg: #ffffff; }
          html.dark { --bg: #1c1c1c; }
          html { background-color: var(--bg); color-scheme: light; }
          html.dark { color-scheme: dark; }
        `,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function () {
            if (window.ThemeManager && window.ThemeManager.initialized) return;
            window.ThemeManager = {
              STORAGE_KEY: 'chiri-theme',
              initialized: false,
              getSystemTheme() {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              },
              getStoredTheme() {
                try { return localStorage.getItem(this.STORAGE_KEY); } catch { return null; }
              },
              setStoredTheme(theme) {
                try {
                  if (theme === 'system') localStorage.removeItem(this.STORAGE_KEY);
                  else localStorage.setItem(this.STORAGE_KEY, theme);
                } catch (e) { console.warn('Failed to store theme:', e); }
              },
              getEffectiveTheme() {
                const stored = this.getStoredTheme();
                return stored || this.getSystemTheme();
              },
              isUsingSystemTheme() { return this.getStoredTheme() === null; },
              applyTheme(theme) {
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(theme);
                document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
              },
              toggle() {
                const current = this.getEffectiveTheme();
                const newTheme = current === 'dark' ? 'light' : 'dark';
                this.setStoredTheme(newTheme);
                this.applyTheme(newTheme);
              },
              init() {
                if (this.initialized) return;
                this.applyTheme(this.getEffectiveTheme());
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                  const t = e.matches ? 'dark' : 'light';
                  this.setStoredTheme(t);
                  this.applyTheme(t);
                });
                this.initialized = true;
              },
            };
            window.ThemeManager.init();
          })();
        `,
        }}
      />
    </>
  )
}
