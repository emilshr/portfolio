import { getPublicPayload, PUBLIC_PAYLOAD_QUERY } from '@/utilities/payloadPublicQuery'

import { WorkExperience } from '@/components/chiri/WorkExperience'
import type { WorkExperienceBlock as WorkExperienceBlockProps } from '@repo/payload-types'
import { getSiteSettings } from '@/utilities/getSiteSettings'

export const WorkExperienceBlockComponent: React.FC<WorkExperienceBlockProps> = async ({
  heading,
  limit,
}) => {
  const payload = await getPublicPayload()
  const settings = await getSiteSettings()

  const { docs } = await payload.find({
    collection: 'experiences',
    sort: 'order',
    limit: limit ?? 100,
    depth: 1,
    ...PUBLIC_PAYLOAD_QUERY,
  })

  return <WorkExperience experiences={docs} settings={settings} heading={heading ?? 'Work'} />
}
