// install these dependencies manually in projects that require i18n.js
// refer https://github.com/bitfinexcom/bfxuilib/blob/master/functions/i18n.spa.js

import i18n from 'i18next'
import backend from 'i18next-xhr-backend'
import detector from 'i18next-browser-languagedetector'
import _findKey from 'lodash/findKey'
import { initReactI18next } from 'react-i18next'
import {
  ru, es, tr, zhCN, zhTW, enUS,
} from 'date-fns/locale'
import { registerLocale } from 'react-datepicker'

const { REACT_APP_ENV } = process.env

export const LANGUAGES = {
  en: 'en-US',
  es: 'es-EM',
  ru: 'ru-RU',
  tr: 'tr-TR',
  cn: 'zh-CN',
  tw: 'zh-TW',
}

export const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Español',
  ru: 'Русский',
  // tr: 'Türk',
  cn: '中文 (简化)',
  tw: '中文 (繁體)',
}

export const LANGUAGES_CHART_TABLE = {
  en: 'en',
  es: 'es',
  ru: 'ru',
  tr: 'tr',
  cn: 'zh',
  tw: 'zh_TW',
}

registerLocale(LANGUAGES.en, enUS)
registerLocale(LANGUAGES.ru, ru)
registerLocale(LANGUAGES.es, es)
registerLocale(LANGUAGES.tr, tr)
registerLocale(LANGUAGES.tw, zhTW)
registerLocale(LANGUAGES.cn, zhCN)

export const LOCAL_STORAGE_I18N_KEY = 'HF_LOCALE'

i18n
  .use(backend)
  .use(detector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      order: ['querystring', 'cookie', 'localStorage'],
      lookupCookie: 'bfx_locale',
      lookupQuerystring: 'locale',
      lookupLocalStorage: LOCAL_STORAGE_I18N_KEY,
      cookieDomain: '.bitfinex.com',
      caches: ['cookie', 'localStorage'],
    },

    parseMissingKeyHandler: (key) => {
      if (i18n.isInitialized) {
        // eslint-disable-next-line no-console
        console.warn(`Missing translation for ${key}`)
      }
      return key
    },
    // use en if detected lng is not available
    fallbackLng: LANGUAGES.en,

    ns: ['translations'],
    defaultNS: 'translations',

    debug: REACT_APP_ENV === 'development',

    react: {
      useSuspense: false,
      //   bindI18n: 'languageChanged loaded',
      //   bindStore: 'added removed',
      //   nsMode: 'default'
    },

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

i18n.getMappedLanguageKey = function getMappedLanguageKey() {
  return _findKey(LANGUAGES, (value) => value === this.language)
}

export default i18n
