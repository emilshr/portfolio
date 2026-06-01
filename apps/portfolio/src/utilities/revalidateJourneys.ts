type RevalidateJourneysArgs = {
  tags: string[]
}

export const revalidateJourneys = async ({ tags }: RevalidateJourneysArgs): Promise<void> => {
  const url = process.env.JOURNEYS_REVALIDATE_URL
  const secret = process.env.REVALIDATE_SECRET

  if (!url || !secret) {
    if (process.env.VERCEL_ENV === 'production') {
      console.warn(
        '[portfolio] JOURNEYS_REVALIDATE_URL or REVALIDATE_SECRET is unset; journeys cache will not bust on CMS saves.',
      )
    }
    return
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': secret,
      },
      body: JSON.stringify({ tags }),
    })

    if (!response.ok) {
      console.warn(
        `[portfolio] Journeys revalidation failed (${response.status}):`,
        await response.text(),
      )
    }
  } catch (error) {
    console.warn('[portfolio] Journeys revalidation request failed:', error)
  }
}
