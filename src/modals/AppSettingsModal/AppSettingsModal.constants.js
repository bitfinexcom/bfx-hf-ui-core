import { isElectronApp } from '../../redux/config'

export const SETTINGS_TABS = {
  Beta: 'appSettings.betaTab',
  General: 'appSettings.generalTab',
  TradingMode: 'appSettings.tradingModeTab',
  Keys: 'appSettings.apiKeys',
  Appearance: 'appSettings.appearanceTab',
  About: 'appSettings.aboutTab',
}

export const WEB_SETTINGS_TABS = [SETTINGS_TABS.Appearance, SETTINGS_TABS.About]

export const DEFAULT_TAB = isElectronApp ? SETTINGS_TABS.General : SETTINGS_TABS.Appearance

export const TERMS_CONDITIONS_URL = 'https://www.bitfinex.com/legal/general/api-terms'

export const PRIVACY_POLICY_URL = 'https://www.bitfinex.com/legal/privacy'
