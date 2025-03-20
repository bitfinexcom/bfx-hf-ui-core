import _get from 'lodash/get'
import _includes from 'lodash/includes'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.UI

const EMPTY_OBJ = {}

export const DEFAULT_RECONNECTION_TIME = 30 * 1000
export const MAX_RECONNECTION_TIME = 600 * 1000

export const SETTINGS_KEYS = {
  SHOW_ALGO_PAUSE_INFO: 'showAlgoPauseInfo',
  SHOW_ONLY_FAVORITE_PAIRS: 'showOnlyFavoritePairs',
  THEME: 'theme',
  HIDE_ON_CLOSE: 'hideOnClose',
  FULLSCREEN: 'fullScreen',
  AUTO_RESUME_AOS: 'autoResumeAOs',
  PACKET_WD_DELAY: 'packetWDDelay',
  TIMESTAMP_FORMAT: 'timestampFormat',
}

export const THEMES = {
  DARK: 'Dark',
  LIGHT: 'Light',
}

const getDefaultTheme = () => {
  const lsTheme = localStorage.getItem(SETTINGS_KEYS.THEME)

  if (_includes(THEMES, lsTheme)) {
    return lsTheme
  }

  return THEMES.DARK
}

const getSettings = (state) => _get(state, `${path}.settings`, EMPTY_OBJ)

export const getShowOnlyFavoritePairsSetting = createSelector(
  getSettings,
  (settings) => _get(settings, SETTINGS_KEYS.SHOW_ONLY_FAVORITE_PAIRS, false),
)

export const getShowAlgoPauseInfoSetting = createSelector(
  getSettings,
  (settings) => _get(settings, SETTINGS_KEYS.SHOW_ALGO_PAUSE_INFO, true),
)

export const getThemeSetting = createSelector(
  getSettings,
  (settings) => _get(settings, SETTINGS_KEYS.THEME, getDefaultTheme()),
)

export const getShouldHideOnClose = createSelector(
  getSettings,
  (settings) => _get(settings, SETTINGS_KEYS.HIDE_ON_CLOSE, false),
)

export const getIsFullscreen = createSelector(
  getSettings,
  (settings) => _get(settings, SETTINGS_KEYS.FULLSCREEN, true),
)

export const getReconnectionTime = createSelector(
  getSettings,
  (settings) => _get(settings, SETTINGS_KEYS.PACKET_WD_DELAY, DEFAULT_RECONNECTION_TIME),
)

export const getIsAutoResumeAOs = createSelector(
  getSettings,
  (settings) => _get(settings, SETTINGS_KEYS.AUTO_RESUME_AOS, false),
)

export const getTimestampFormat = createSelector(
  getSettings,
  (settings) => _get(settings, SETTINGS_KEYS.TIMESTAMP_FORMAT, ''),
)

export default getSettings
