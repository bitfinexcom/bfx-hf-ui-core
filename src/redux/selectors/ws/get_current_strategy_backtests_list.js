import { createSelector } from 'reselect'
import _get from 'lodash/get'
import _isArray from 'lodash/isArray'
import _map from 'lodash/map'
import { getCurrentStrategy } from '../ui'
import { getBacktestHistory } from '.'

const getCurrentStrategyBacktestsList = createSelector(
  [getCurrentStrategy, getBacktestHistory],
  ({ id }, backtestHistory) => {
    const { mappedKeysByStrategyIds, backtestResults } = backtestHistory
    const mappedKeys = _get(mappedKeysByStrategyIds, id, null)

    if (!_isArray(mappedKeys)) {
      return mappedKeys
    }
    return _map(mappedKeys, (executionId) => {
      return _get(backtestResults, executionId, {})
    })
  },
)

export default getCurrentStrategyBacktestsList
