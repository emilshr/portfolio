type RevalidateJourneysArgs = {
  tags: string[]
}

export const revalidateJourneys = async ({ tags }: RevalidateJourneysArgs): Promise<void> => {
  const url = process.env.JOURNEYS_REVALIDATE_URL
  const secret = process.env.REVALIDATE_SECRET

  if (!url || !secret) {
    return
  }

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': secret,
      },
      body: JSON.stringify({ tags }),
    })
  } catch {
    // Journeys revalidation is best-effort; do not block CMS saves.
  }
}
