import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateSiteSettings: GlobalAfterChangeHook = ({ req }) => {
  if (req.context?.disableRevalidate) return

  revalidatePath('/', 'layout')
  revalidatePath('/posts')
  revalidateTag('global_site-settings', 'max')
}
