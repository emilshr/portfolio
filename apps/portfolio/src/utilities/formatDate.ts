import type { SiteSettingsData } from './getSiteSettings'

const MONTHS_EN = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const VALID_SEPARATORS = ['.', '-', '/']

export function formatDate(
  date: Date | string,
  settings: SiteSettingsData,
  hideYear = false,
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const formatStr = (settings.date.dateFormat || 'DAY MONTH YYYY').trim()
  const configSeparator = settings.date.dateSeparator || '-'
  const separator = VALID_SEPARATORS.includes(configSeparator.trim()) ? configSeparator.trim() : '.'

  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const monthName = MONTHS_EN[d.getMonth()]
  const pad = (num: number) => String(num).padStart(2, '0')

  switch (formatStr) {
    case 'YYYY-MM-DD':
      return hideYear
        ? `${pad(month)}${separator}${pad(day)}`
        : `${year}${separator}${pad(month)}${separator}${pad(day)}`
    case 'MM-DD-YYYY':
      return hideYear
        ? `${pad(month)}${separator}${pad(day)}`
        : `${pad(month)}${separator}${pad(day)}${separator}${year}`
    case 'DD-MM-YYYY':
      return hideYear
        ? `${pad(day)}${separator}${pad(month)}`
        : `${pad(day)}${separator}${pad(month)}${separator}${year}`
    case 'MONTH DAY YYYY':
      return hideYear
        ? `<span class="month">${monthName}</span> ${day}`
        : `<span class="month">${monthName}</span> ${day} ${year}`
    case 'DAY MONTH YYYY':
      return hideYear
        ? `${day} <span class="month">${monthName}</span>`
        : `${day} <span class="month">${monthName}</span> ${year}`
    default:
      return hideYear
        ? `${pad(month)}${separator}${pad(day)}`
        : `${year}${separator}${pad(month)}${separator}${pad(day)}`
  }
}
