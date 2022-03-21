import { isElectronApp } from '../../redux/config'

export const SETTINGS_TABS = {
  General: 'appSettings.generalTab',
  TradingMode: 'appSettings.tradingModeTab',
  Keys: 'appSettings.apiKeys',
  Appearance: 'appSettings.appearanceTab',
  About: 'appSettings.aboutTab',
}

export const WEB_SETTINGS_TABS = [SETTINGS_TABS.Appearance, SETTINGS_TABS.About]

export const DEFAULT_TAB = isElectronApp ? SETTINGS_TABS.General : SETTINGS_TABS.Appearance
