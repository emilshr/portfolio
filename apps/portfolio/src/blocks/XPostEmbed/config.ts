import type { Block } from 'payload'

export const XPostEmbed: Block = {
  slug: 'xPostEmbed',
  interfaceName: 'XPostEmbedBlock',
  labels: {
    singular: 'X Post Embed',
    plural: 'X Post Embeds',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Full URL to the X/Twitter post',
      },
    },
  ],
}
