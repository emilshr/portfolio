import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { getPayloadApiUrl } from '@/lib/env'

export type PreviewSearchParams = {
  path: string
  previewSecret: string
}

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')
  const previewSecret = searchParams.get('previewSecret')

  if (!previewSecret || previewSecret !== process.env.PREVIEW_SECRET) {
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  if (!path?.startsWith('/')) {
    return new Response('Insufficient search params', { status: 404 })
  }

  const apiUrl = getPayloadApiUrl()
  if (!apiUrl) {
    return new Response('Payload API is not configured', { status: 500 })
  }

  const meResponse = await fetch(`${apiUrl}/users/me`, {
    headers: {
      cookie: req.headers.get('cookie') ?? '',
    },
    cache: 'no-store',
  })

  if (!meResponse.ok) {
    const draft = await draftMode()
    draft.disable()
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  const draft = await draftMode()
  draft.enable()
  redirect(path)
}
