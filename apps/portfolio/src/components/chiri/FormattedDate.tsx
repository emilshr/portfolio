import type { SiteSettingsData } from '@/utilities/getSiteSettings'
import { formatDate } from '@/utilities/formatDate'

type Props = {
  date: Date | string
  settings: SiteSettingsData
  hideYear?: boolean
}

export function FormattedDate({ date, settings, hideYear = false }: Props) {
  const html = formatDate(date, settings, hideYear)
  return <span className="font-features" dangerouslySetInnerHTML={{ __html: html }} />
}
