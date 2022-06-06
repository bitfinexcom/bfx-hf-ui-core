import _some from 'lodash/some'
import { createSelector } from 'reselect'
import { getStrategyId } from '../ui'

import getActiveStrategies from './get_active_strategies'

const getIsCurrentStrategyExecuting = createSelector([getActiveStrategies, getStrategyId], (executingStrategies, strategyId) => {
  if (!strategyId) {
    return false
  }

  return _some(
    executingStrategies,
    (strategy) => strategy && strategy.id === strategyId,
  )
})

export default getIsCurrentStrategyExecuting
