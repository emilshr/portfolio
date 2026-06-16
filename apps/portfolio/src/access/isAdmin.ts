import type { User } from '@repo/payload-types'

export function isAdmin(user: User | null | undefined): boolean {
  return Boolean(user?.roles?.includes('admin'))
}
