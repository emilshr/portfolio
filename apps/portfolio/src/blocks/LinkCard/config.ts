import type { Block } from 'payload'

export const LinkCard: Block = {
  slug: 'linkCard',
  interfaceName: 'LinkCardBlock',
  labels: {
    singular: 'Link Card',
    plural: 'Link Cards',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
    },
  ],
}
