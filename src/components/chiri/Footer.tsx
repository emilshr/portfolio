import type { SiteSettingsData } from '@/utilities/getSiteSettings'

type Props = {
  settings: SiteSettingsData
}

export function Footer({ settings }: Props) {
  if (!settings.general.footer) return null

  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 text-(length:--font-size-s) font-(length:--font-weight-light) leading-loose text-(--text-secondary) opacity-75">
      <div className="flex w-full items-center justify-between">
        <div className="copyright">
          <span className="date">© {year}</span> {settings.site.author}
        </div>
        <div className="powered-by">
          Built with{' '}
          <a href="https://payloadcms.com" className="text-(--text-secondary) no-underline">
            Payload
          </a>
        </div>
      </div>
    </footer>
  )
}
