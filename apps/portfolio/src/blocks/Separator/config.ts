import type { Block } from 'payload'

export const SeparatorBlock: Block = {
  slug: 'separator',
  interfaceName: 'SeparatorBlock',
  labels: {
    singular: 'Separator',
    plural: 'Separators',
  },
  fields: [
    {
      name: 'orientation',
      type: 'select',
      defaultValue: 'horizontal',
      options: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
      ],
      required: true,
    },
    {
      name: 'spacing',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
      required: true,
    },
  ],
}
