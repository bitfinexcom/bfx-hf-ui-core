import _get from 'lodash/get'
import { createSelector } from 'reselect'

import { REDUCER_PATHS } from '../../config'
import { getStrategyId } from '../ui'

const path = REDUCER_PATHS.WS

const EMPTY_OBJ = {}

const getExecutionOptions = (state) => _get(state, `${path}.execution.options`, EMPTY_OBJ)

const getCurrentStrategyExecutionOptions = createSelector(
  [getStrategyId, getExecutionOptions],
  (strategyId, options) => _get(options, strategyId, EMPTY_OBJ),
)

export default getCurrentStrategyExecutionOptions
