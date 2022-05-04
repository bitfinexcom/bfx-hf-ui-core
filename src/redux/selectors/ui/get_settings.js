import _get from 'lodash/get'
import _includes from 'lodash/includes'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.UI

const EMPTY_OBJ = {}

export const SETTINGS_KEYS = {
  DMS: 'dms',
  GA: 'ga',
  SHOW_ALGO_PAUSE_INFO: 'showAlgoPauseInfo',
  SHOW_ONLY_FAVORITE_PAIRS: 'showOnlyFavoritePairs',
  REBOOT_AUTOMATICALLY: 'rebootAutomatically',
  THEME: 'theme',
  JOIN_BETA_PROGRAM: 'joinBetaProgram',
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

export const getDMSSetting = createSelector(
  getSettings,
  (settings) => _get(settings, SETTINGS_KEYS.DMS, false),
)

export const getGASetting = createSelector(
  getSettings,
  (settings) => _get(settings, SETTINGS_KEYS.GA, true),
)

export const getThemeSetting = createSelector(
  getSettings,
  (settings) => _get(settings, SETTINGS_KEYS.THEME, getDefaultTheme()),
)

export const getRebootSetting = createSelector(
  getSettings,
  (settings) => _get(settings, SETTINGS_KEYS.REBOOT_AUTOMATICALLY, false),
)

export const getIsBetaVersion = createSelector(
  getSettings,
  (settings) => _get(settings, SETTINGS_KEYS.JOIN_BETA_PROGRAM, true),
)

export default getSettings
