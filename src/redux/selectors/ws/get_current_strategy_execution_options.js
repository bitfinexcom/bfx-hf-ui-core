import _get from 'lodash/get'
import { createSelector } from 'reselect'
import { getRunningStrategiesMapping } from '.'

import { getStrategyId } from '../ui'
import getActiveStrategies from './get_active_strategies'

const EMPTY_OBJ = {}

const getCurrentStrategyExecutionOptions = createSelector(
  [getStrategyId, getActiveStrategies, getRunningStrategiesMapping],
  (strategyId, strategies, strategiesMapping) => {
    const executionId = _get(strategiesMapping, strategyId, null)
    return _get(strategies, executionId, EMPTY_OBJ)
  },
)

export default getCurrentStrategyExecutionOptions
