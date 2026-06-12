'use client'

import dynamic from 'next/dynamic'

import type { Experience } from '@repo/payload-types'
import type { SiteSettingsData } from '@/utilities/getSiteSettings'

const WorkExperienceClient = dynamic(
  () => import('@/components/chiri/WorkExperience.client').then((mod) => mod.WorkExperienceClient),
  {
    ssr: false,
    loading: () => <section className="work-experience h-48 animate-pulse rounded-lg bg-muted" />,
  },
)

type Props = {
  experiences: Experience[]
  settings: SiteSettingsData
  heading?: string
}

export function WorkExperience(props: Props) {
  return <WorkExperienceClient {...props} />
}
