import React from 'react'
import { useInjectBfxData } from '@ufx-ui/bfx-containers'
import { StoreProvider as UfxStoreProvider } from '@ufx-ui/core'
import { useSelector } from 'react-redux'
import useAuthToken from '../../hooks/useAuthToken'
import HFUI from '../HFUI'
import CrashHandler from '../CrashHandler'
import { getCurrentLanguage } from '../../redux/selectors/ui'

import ruTrans from '../../locales/ufx-ui/ru.json'
import esTrans from '../../locales/ufx-ui/es.json'
import trTrans from '../../locales/ufx-ui/tr.json'
import twTrans from '../../locales/ufx-ui/tw.json'
import cnTrans from '../../locales/ufx-ui/cn.json'
// add en.json again even though already present in ufx-ui, so can be set as source file for crowdin
import enTrans from '../../locales/ufx-ui/en.json'

const translations = {
  en: enTrans,
  ru: ruTrans,
  es: esTrans,
  cn: cnTrans,
  tw: twTrans,
  tr: trTrans,
}

const HFUIWrapper = () => {
  useInjectBfxData()
  useAuthToken()
  const language = useSelector(getCurrentLanguage)

  const timezoneOffset = -(new Date().getTimezoneOffset())
  const config = {
    timezoneOffset,
    translations,
    lang: language,
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
