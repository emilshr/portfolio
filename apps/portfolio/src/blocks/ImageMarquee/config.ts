import type { Block } from 'payload'

export const ImageMarqueeBlock: Block = {
  slug: 'imageMarquee',
  interfaceName: 'ImageMarqueeBlock',
  labels: {
    singular: 'Image Marquee',
    plural: 'Image Marquees',
  },
  fields: [
    {
      name: 'images',
      type: 'array',
      labels: { singular: 'Image', plural: 'Images' },
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          admin: {
            description: 'Optional override; defaults to media alt text.',
          },
        },
      ],
    },
    {
      name: 'baseVelocity',
      type: 'number',
      defaultValue: 5,
      admin: {
        description: 'Base scroll speed for the marquee row.',
      },
    },
    {
      name: 'direction',
      type: 'select',
      defaultValue: '1',
      options: [
        { label: 'Left to right', value: '1' },
        { label: 'Right to left', value: '-1' },
      ],
    },
  ],
}
