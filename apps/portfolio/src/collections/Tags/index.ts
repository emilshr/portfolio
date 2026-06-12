import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
import { slugField } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'slug', 'updatedAt'],
    group: 'Journeys',
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField({ fieldToUse: 'name' }),
  ],
}
