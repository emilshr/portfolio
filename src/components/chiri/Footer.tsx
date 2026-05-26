import type { SiteSettingsData } from '@/utilities/getSiteSettings'

type Props = {
  settings: SiteSettingsData
}

export function Footer({ settings }: Props) {
  if (!settings.general.footer) return null

  const year = new Date().getFullYear()

  return (
    <footer className="chiri-footer">
      <div className="footer-content">
        <div className="copyright">
          <span className="date">© {year}</span> {settings.site.author}
        </div>
        <div className="powered-by">
          Built with <a href="https://payloadcms.com">Payload</a>
        </div>
      </div>
    </footer>
  )
}
