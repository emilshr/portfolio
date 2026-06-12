import { SiteHeader } from '@/components/layout/SiteHeader'
import { getJourneysSettings } from '@/lib/payload'

export async function SiteHeaderLoader() {
  const settings = await getJourneysSettings()

  return <SiteHeader menuItems={settings.headerMenu ?? []} />
}
