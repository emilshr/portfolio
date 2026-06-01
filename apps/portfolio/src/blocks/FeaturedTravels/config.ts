import type { Block } from 'payload'

export const FeaturedTravelsBlock: Block = {
  slug: 'featuredTravels',
  interfaceName: 'FeaturedTravelsBlock',
  labels: {
    singular: 'Featured Travels',
    plural: 'Featured Travels',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Featured journeys',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      min: 1,
      max: 12,
    },
  ],
}
