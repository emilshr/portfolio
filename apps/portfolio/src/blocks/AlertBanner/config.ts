import type { Block } from 'payload'

import { link } from '@/fields/link'

export const AlertBanner: Block = {
  slug: 'alertBanner',
  interfaceName: 'AlertBannerBlock',
  labels: {
    singular: 'Alert Banner',
    plural: 'Alert Banners',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
    },
    link({ disableLabel: true, appearances: false }),
  ],
}
