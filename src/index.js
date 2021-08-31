import React from 'react'
import ReactDOM from 'react-dom'
import { StoreProvider as UfxStoreProvider } from '@ufx-ui/core'
import { I18nextProvider } from 'react-i18next'
import { useInjectBfxData } from '@ufx-ui/bfx-containers'
import Debug from 'debug'
import Manifest from '../package.json'

import HFUI from './components/HFUI'
import CrashHandler from './components/CrashHandler'
import StoreWrapper from './StoreWrapper'
import useAuthToken from './hooks/useAuthToken'
import i18n from './locales/i18n'

import './passive_listener_fix'
import './index.css'

console.log(`bfx-hf-ui-core v${Manifest.version}`)

const debug = Debug('hfui:main')
const LOCAL_STORAGE_VERSION_KEY = 'HFUI_LS_VERSION'
const LOCAL_STORAGE_VERSION = 2

if (localStorage) {
  const version = +localStorage.getItem(LOCAL_STORAGE_VERSION_KEY)

  if (!version || version < LOCAL_STORAGE_VERSION) {
    localStorage.clear()
    localStorage.setItem(LOCAL_STORAGE_VERSION_KEY, LOCAL_STORAGE_VERSION)
    localStorage.debug = 'hfui:*'
    debug('local storage version mis-match, cleared')
    window.location.reload()
  } else {
    debug('local storage DB version %s', version)
  }
}

debug('boot version %s', Manifest.version)

const timezoneOffset = -(new Date().getTimezoneOffset())
const config = {
  timezoneOffset,
}

const HFUIWrapper = () => {
  useAuthToken()

  return (
    <CrashHandler>
      <HFUI />
    </CrashHandler>
  )
}

ReactDOM.render((
  <StoreWrapper>
    <UfxStoreProvider value={config}>
      <I18nextProvider i18n={i18n}>
        <HFUIWrapper />
      </I18nextProvider>
    </UfxStoreProvider>
  </StoreWrapper>
), document.getElementById('root'))
