import _get from 'lodash/get'
import _some from 'lodash/some'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.UI

export const getFeatureFlags = (state) => _get(state, `${path}.featureFlags`)

export const getStrategiesFeatureFlags = createSelector(
  getFeatureFlags,
  (allFlags) => allFlags?.strategy_editor,
)

export const getIsStrategiesLiveExecVisible = createSelector(
  getStrategiesFeatureFlags,
  (strategiesFlags) => strategiesFlags?.live_execution,
)

export const getIsStrategiesTabVisible = createSelector(
  getStrategiesFeatureFlags,
  (strategiesFlags) => _some(strategiesFlags, (flag) => flag === true),
)

export const getIsRecurringAOVisible = createSelector(
  getFeatureFlags,
  (flags) => flags?.recurring_AOs,
)

export default getFeatureFlags
