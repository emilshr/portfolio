import type { Block } from 'payload'

export const WorkExperienceBlock: Block = {
  slug: 'workExperience',
  interfaceName: 'WorkExperienceBlock',
  labels: {
    singular: 'Work Experience',
    plural: 'Work Experience sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Work',
    },
    {
      name: 'limit',
      type: 'number',
      min: 1,
      admin: {
        description: 'Leave empty to show all experiences',
      },
    },
  ],
}
