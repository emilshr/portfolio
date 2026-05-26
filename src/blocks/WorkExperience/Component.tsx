import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { WorkExperience } from '@/components/chiri/WorkExperience'
import type { WorkExperienceBlock as WorkExperienceBlockProps } from '@/payload-types'
import { getSiteSettings } from '@/utilities/getSiteSettings'

export const WorkExperienceBlockComponent: React.FC<WorkExperienceBlockProps> = async ({
  heading,
  limit,
}) => {
  const payload = await getPayload({ config: configPromise })
  const settings = await getSiteSettings()

  const { docs } = await payload.find({
    collection: 'experiences',
    sort: 'order',
    limit: limit ?? 100,
    depth: 1,
    where: { _status: { equals: 'published' } },
  })

  return <WorkExperience experiences={docs} settings={settings} heading={heading ?? 'Work'} />
}
