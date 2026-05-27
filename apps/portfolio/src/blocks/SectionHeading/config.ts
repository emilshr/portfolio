import type { Block } from 'payload'

export const SectionHeadingBlock: Block = {
  slug: 'sectionHeading',
  interfaceName: 'SectionHeadingBlock',
  labels: {
    singular: 'Section Heading',
    plural: 'Section Headings',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
  ],
}
