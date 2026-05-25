import { themeConfig } from '@/config'
import type { DateFormat } from '@/types'

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const VALID_SEPARATORS = ['.', '-', '/']

/**
 * @param date
 * @param format
 * @param hideYear when true, the year is omitted from the formatted output
 * @returns
 */
export function formatDate(date: Date, format?: string, hideYear = false): string {
  const formatStr = (format || themeConfig.date.dateFormat).trim()
  const configSeparator = themeConfig.date.dateSeparator || '-'

  const separator = VALID_SEPARATORS.includes(configSeparator.trim()) ? configSeparator.trim() : '.'

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const monthName = MONTHS_EN[date.getMonth()]

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

export const SUPPORTED_DATE_FORMATS: readonly DateFormat[] = [
  'YYYY-MM-DD',
  'MM-DD-YYYY',
  'DD-MM-YYYY',
  'MONTH DAY YYYY',
  'DAY MONTH YYYY'
] as const
