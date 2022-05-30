import _some from 'lodash/some'
import { createSelector } from 'reselect'

import getActiveStrategies from './get_active_strategies'

const getIsStrategyExecuting = (strategyId) => createSelector([getActiveStrategies], (executingStrategies) => {
  if (!strategyId) {
    return false
  }

  return _some(
    executingStrategies,
    (strategy) => strategy && strategy.id === strategyId,
  )
})

export default getIsStrategyExecuting
