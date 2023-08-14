import { createSelector } from 'reselect'
import _get from 'lodash/get'
import { getCurrentStrategy } from '../ui'
import { getStrategiesBacktests } from '.'

const getCurrentStrategyBacktestsList = createSelector(
  [getCurrentStrategy, getStrategiesBacktests],
  ({ id }, strategiesBacktests) => {
    return _get(strategiesBacktests, id, null)
  },
)

export default getCurrentStrategyBacktestsList
