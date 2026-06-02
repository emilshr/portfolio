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
      admin: {
        description: 'Section heading shown above the featured journeys list.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional supporting copy shown below the section heading.',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: {
        description: 'How many featured journeys to display.',
      },
    },
  ],
}
