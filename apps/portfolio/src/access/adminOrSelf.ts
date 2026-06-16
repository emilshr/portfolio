import type { Access } from 'payload'

import type { User } from '@repo/payload-types'

import { isAdmin } from './isAdmin'

export const adminOrSelf: Access<User> = ({ req: { user } }) => {
  if (!user) return false
  if (isAdmin(user)) return true

  return {
    id: {
      equals: user.id,
    },
  }
}
