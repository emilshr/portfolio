import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateSiteSettings: GlobalAfterChangeHook = ({ req }) => {
  if (req.context?.disableRevalidate) return

  revalidatePath('/', 'layout')
  revalidatePath('/posts')
}
