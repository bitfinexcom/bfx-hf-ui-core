import React from 'react'
import { isElectronApp } from '../../redux/config'
import AppSettingsModalAbout from './AppSettingsModal.About'
import AppSettingsModalApiKeys from './AppSettingsModal.ApiKeys'
import AppSettingsModalAppSettings from './AppSettingsModal.AppSettings'
import AppSettingsModalBeta from './AppSettingsModal.Beta'
import AppSettingsModalGeneral from './AppSettingsModal.General'

export const SETTINGS_TABS = {
  Beta: 'betaTab',
  General: 'generalTab',
  Keys: 'apiKeys',
  AppSettings: 'appSettingsTab',
  About: 'aboutTab',
}

export const SETTINGS_TABS_COMPONENTS = {
  [SETTINGS_TABS.Beta]: <AppSettingsModalBeta />,
  [SETTINGS_TABS.General]: <AppSettingsModalGeneral />,
  [SETTINGS_TABS.Keys]: <AppSettingsModalApiKeys />,
  [SETTINGS_TABS.AppSettings]: <AppSettingsModalAppSettings />,
  [SETTINGS_TABS.About]: <AppSettingsModalAbout />,
}

export const WEB_SETTINGS_TABS = [SETTINGS_TABS.AppSettings, SETTINGS_TABS.About]

export const DEFAULT_TAB = isElectronApp ? SETTINGS_TABS.General : SETTINGS_TABS.AppSettings

export const TERMS_CONDITIONS_URL = 'https://www.bitfinex.com/legal/general/api-terms'

export const PRIVACY_POLICY_URL = 'https://www.bitfinex.com/legal/privacy'
