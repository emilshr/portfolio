import type { Access } from 'payload'

import type { User } from '@repo/payload-types'

import { isAdmin } from './isAdmin'

export const adminOnly: Access<User> = ({ req: { user } }) => {
  return isAdmin(user)
}
