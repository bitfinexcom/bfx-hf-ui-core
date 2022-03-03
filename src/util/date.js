import { isValid } from 'date-fns'
import { LANGUAGES } from '../locales/i18n'

export const isValidDate = (date) => isValid(new Date(date))

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
