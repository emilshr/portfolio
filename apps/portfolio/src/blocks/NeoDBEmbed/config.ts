import type { Block } from 'payload'

export const NeoDBEmbed: Block = {
  slug: 'neodbEmbed',
  interfaceName: 'NeoDBEmbedBlock',
  labels: {
    singular: 'NeoDB Embed',
    plural: 'NeoDB Embeds',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
    },
  ],
}
