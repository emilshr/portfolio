'use client'

import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

function getPayloadServerURL(): string {
  const apiUrl =
    process.env.NEXT_PUBLIC_PAYLOAD_API_URL?.replace(/\/api\/?$/, '') ||
    'http://localhost:3000'
  return apiUrl.replace(/\/$/, '')
}

export function LivePreviewListener() {
  const router = useRouter()
  return <PayloadLivePreview refresh={router.refresh} serverURL={getPayloadServerURL()} />
}
