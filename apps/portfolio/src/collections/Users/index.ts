import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'
import { adminOrSelf } from '../../access/adminOrSelf'
import { authenticated } from '../../access/authenticated'
import { isAdmin } from '../../access/isAdmin'
import type { User } from '@repo/payload-types'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: adminOnly,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['editor'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      required: true,
      saveToJWT: true,
      access: {
        update: ({ req: { user } }) => isAdmin(user as User | null),
      },
    },
  ],
  timestamps: true,
}
