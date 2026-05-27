import type { Block } from 'payload'

export const GitHubEmbed: Block = {
  slug: 'githubEmbed',
  interfaceName: 'GitHubEmbedBlock',
  labels: {
    singular: 'GitHub Embed',
    plural: 'GitHub Embeds',
  },
  fields: [
    {
      name: 'repo',
      type: 'text',
      required: true,
      admin: {
        description: 'Repository in owner/repo format',
      },
    },
  ],
}
