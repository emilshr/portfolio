export const getJourneysSiteURL = (): string => {
  const url = process.env.JOURNEYS_SITE_URL || 'https://burntclutchproject.com'
  return url.replace(/\/$/, '')
}
