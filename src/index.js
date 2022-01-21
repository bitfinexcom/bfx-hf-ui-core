import React from 'react'
import ReactDOM from 'react-dom'
import { I18nextProvider } from 'react-i18next'
import Debug from 'debug'
import Manifest from '../package.json'

import StoreWrapper from './StoreWrapper'
import HFUIWrapper from './components/HFUIWrapper'
import i18n from './locales/i18n'
import { isElectronApp } from './redux/config'

import './passive_listener_fix'
import './index.css'

console.log(`bfx-hf-ui-core v${Manifest.version}`)

const debug = Debug('hfui:main')
const LOCAL_STORAGE_VERSION_KEY = 'HFUI_LS_VERSION'
const LOCAL_STORAGE_VERSION = 2

if (isElectronApp) {
  document.body.classList.add('electron')
} else {
  document.body.classList.add('hosted')
}

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

ReactDOM.render((
  <StoreWrapper>
    <I18nextProvider i18n={i18n}>
      <HFUIWrapper />
    </I18nextProvider>
  </StoreWrapper>
), document.getElementById('root'))
