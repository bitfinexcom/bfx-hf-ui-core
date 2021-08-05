import _get from 'lodash/get'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.UI

const EMPTY_OBJ = {}

export const SHOW_ONLY_FAV_PAIRS_KEY = 'showOnlyFavoritePairs'

const getSettings = (state) => _get(state, `${path}.settings`, EMPTY_OBJ)

export const getShowOnlyFavoritePairs = createSelector(
  getSettings,
  (settings) => {
    return _get(settings, SHOW_ONLY_FAV_PAIRS_KEY, false)
  },
)

export default getSettings
