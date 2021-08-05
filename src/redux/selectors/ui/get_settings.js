import _get from 'lodash/get'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.UI

const EMPTY_OBJ = {}

export const SETTINGS = {
  DMS: 'dms',
  GA: 'ga',
  SHOW_ALGO_PAUSE_INFO: 'showAlgoPauseInfo',
  SHOW_ONLY_FAVORITE_PAIRS: 'showOnlyFavoritePairs',
}

const getSettings = (state) => _get(state, `${path}.settings`, EMPTY_OBJ)

export const getShowOnlyFavoritePairsSetting = createSelector(
  getSettings,
  (settings) => _get(settings, SETTINGS.SHOW_ONLY_FAVORITE_PAIRS, false),
)

export const getShowAlgoPauseInfoSetting = createSelector(
  getSettings,
  (settings) => _get(settings, SETTINGS.SHOW_ALGO_PAUSE_INFO, true),
)

export const getDMSSetting = createSelector(
  getSettings,
  (settings) => _get(settings, SETTINGS.DMS, true),
)

export const getGASetting = createSelector(
  getSettings,
  (settings) => _get(settings, SETTINGS.GA, true),
)

export default getSettings
