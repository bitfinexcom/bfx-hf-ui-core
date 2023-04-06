import React from 'react'
import AppSettingsModalAbout from './AppSettingsModal.About'
import AppSettingsModalApiKeys from './AppSettingsModal.ApiKeys'
import AppSettingsModalAppSettings from './AppSettingsModal.AppSettings'
import AppSettingsModalBeta from './AppSettingsModal.Beta'
import AppSettingsModalGeneral from './AppSettingsModal.General'
import AppSettingsModalAnalytics from './AppSettingsModal.Analytics'

export const SETTINGS_TABS = {
  Beta: 'betaTab',
  General: 'generalTab',
  Keys: 'apiKeys',
  AppSettings: 'appSettingsTab',
  Analytics: 'analyticsTab',
  About: 'aboutTab',
}

export const SETTINGS_TABS_COMPONENTS = {
  [SETTINGS_TABS.Beta]: <AppSettingsModalBeta />,
  [SETTINGS_TABS.General]: <AppSettingsModalGeneral />,
  [SETTINGS_TABS.Keys]: <AppSettingsModalApiKeys />,
  [SETTINGS_TABS.AppSettings]: <AppSettingsModalAppSettings />,
  [SETTINGS_TABS.Analytics]: <AppSettingsModalAnalytics />,
  [SETTINGS_TABS.About]: <AppSettingsModalAbout />,
}

export const DEFAULT_TAB = SETTINGS_TABS.General

export const TERMS_CONDITIONS_URL = 'https://www.bitfinex.com/legal/general/api-terms'

export const PRIVACY_POLICY_URL = 'https://www.bitfinex.com/legal/privacy'
