import { isValid, format } from 'date-fns'
import Debug from 'debug'
import i18n, { DATE_FNS_LOCALES, LANGUAGES } from '../locales/i18n'

const debug = Debug('hfui:date-utils')

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
  return format(new Date(date), 'do')
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
  if (!isValidDate(date)) {
    return null
  }
  const formatedInLocalFormat = new Date(date).toLocaleString()
  if (!timestampFormat) {
    return formatedInLocalFormat
  }
  try {
    const i18nMappedKey = i18n.getMappedLanguageKey()
    return format(new Date(date), timestampFormat, {
      locale: DATE_FNS_LOCALES[i18nMappedKey],
    })
  } catch (error) {
    debug('Error in formatting date', date, timestampFormat, error)
    return formatedInLocalFormat
  }
}
