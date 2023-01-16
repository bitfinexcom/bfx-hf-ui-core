import React from 'react'
import { StoreProvider as UfxStoreProvider } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import useAuthToken from '../../hooks/useAuthToken'
import HFUI from '../HFUI'
import CrashHandler from '../CrashHandler'

import ruTrans from '../../locales/ufx-ui/ru-RU.json'
import twTrans from '../../locales/ufx-ui/zh-TW.json'
import cnTrans from '../../locales/ufx-ui/zh-CN.json'
import esTrans from '../../locales/ufx-ui/es-EM.json'
import trTrans from '../../locales/ufx-ui/tr-TR.json'
// add en.json again even though already present in ufx-ui, so can be set as source file for crowdin
import enTrans from '../../locales/ufx-ui/en.json'

const translations = {
  en: enTrans,
  ru: ruTrans,
  cn: cnTrans,
  tw: twTrans,
  es: esTrans,
  tr: trTrans,
}

const HFUIWrapper = () => {
  useAuthToken()
  const { i18n } = useTranslation()

  const i18nMappedKey = i18n.getMappedLanguageKey()

  const timezoneOffset = -(new Date().getTimezoneOffset())
  const config = {
    timezoneOffset,
    translations,
    lang: i18nMappedKey,
  }

  return (
    <UfxStoreProvider value={config}>
      <CrashHandler>
        <HFUI />
      </CrashHandler>
    </UfxStoreProvider>
  )
}

export default HFUIWrapper
