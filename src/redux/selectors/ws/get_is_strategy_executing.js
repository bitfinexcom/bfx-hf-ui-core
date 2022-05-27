import _get from 'lodash/get'
import _some from 'lodash/some'

import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS

const getIsStrategyExecuting = (state) => (strategyId) => {
  if (!strategyId) {
    return false
  }
  const executingStrategies = _get(state, `${path}.execution.activeStrategies`, {})
  return _some(executingStrategies, strategy => strategy && strategy.id === strategyId)
}

export default getIsStrategyExecuting
