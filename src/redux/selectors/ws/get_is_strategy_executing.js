import _get from 'lodash/get'
import _includes from 'lodash/includes'

import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS

const EMPTY_ARRAY = []

const getIsStrategyExecuting = (state) => (strategyId) => {
  const executingStrategies = _get(state, `${path}.execution.executing`, EMPTY_ARRAY)
  return _includes(executingStrategies, strategyId)
}

export default getIsStrategyExecuting
