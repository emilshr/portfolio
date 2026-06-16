const journeysSiteURL = (): string => {
  return (process.env.JOURNEYS_SITE_URL || 'http://localhost:3001').replace(/\/$/, '')
}

type JourneysPreviewPathArgs = {
  path: string
}

export const generateJourneysPreviewPath = ({ path }: JourneysPreviewPathArgs): string | null => {
  if (!path.startsWith('/')) {
    return null
  }

  const previewSecret = process.env.PREVIEW_SECRET
  if (!previewSecret) {
    return null
  }

  const encodedParams = new URLSearchParams({
    path,
    previewSecret,
  })

  return `${journeysSiteURL()}/next/preview?${encodedParams.toString()}`
}
