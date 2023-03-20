import { isValid, format } from 'date-fns'
import i18n, { LANGUAGES } from '../locales/i18n'

export const isValidDate = (date) => {
  if (!date) {
    return false
  }
  return isValid(new Date(date))
}

export const getWeekDayString = (date) => {
  if (!isValidDate(date)) {
    return null
  }
  return new Date(date).toLocaleString(i18n.language, { weekday: 'long' })
}

export const getDateInShortFormat = (date) => {
  if (!isValidDate(date)) {
    return null
  }
  return new Date(date).toLocaleString(i18n.language, {
    day: '2-digit',
    month: '2-digit',
  })
}

export const getLocalDateFormat = (lang) => {
  switch (lang) {
    case LANGUAGES.ru:
    case LANGUAGES.tr:
    case LANGUAGES.es:
      return 'd MMMM yyyy, HH:mm'
    case LANGUAGES.cn:
    case LANGUAGES.tw:
      return 'yyyy MMMM d, HH:mm'

    default:
      return 'MMMM d, yyyy h:mm aa'
  }
}

export const safelyFormatTime = (timestampFormat) => (date) => {
  const formatedInLocalFormat = new Date(date).toLocaleString()
  if (!timestampFormat) {
    return formatedInLocalFormat
  }
  try {
    return format(date, timestampFormat)
  } catch (error) {
    console.warn(error)
    return formatedInLocalFormat
  }
}
