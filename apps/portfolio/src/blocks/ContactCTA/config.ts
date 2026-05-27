import type { Block } from 'payload'

import { link } from '@/fields/link'

export const ContactCTABlock: Block = {
  slug: 'contactCTA',
  interfaceName: 'ContactCTABlock',
  labels: {
    singular: 'Contact CTA',
    plural: 'Contact CTAs',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Contact',
    },
    {
      name: 'useGlobalLinks',
      type: 'checkbox',
      defaultValue: true,
      label: 'Use contact links from Site Settings',
    },
    {
      name: 'links',
      type: 'array',
      admin: {
        condition: (_, siblingData) => !siblingData?.useGlobalLinks,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        link({ disableLabel: true }),
      ],
    },
  ],
}
