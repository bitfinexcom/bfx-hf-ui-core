import _get from 'lodash/get'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.UI

export const getFeatureFlags = (state) => _get(state, `${path}.featureFlags`)

export const getIsRecurringAOVisible = createSelector(
  getFeatureFlags,
  (flags) => flags?.recurring_AOs,
)

export default getFeatureFlags
