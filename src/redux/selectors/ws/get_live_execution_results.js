import _get from 'lodash/get'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS
const EMPTY_OBJ = {}

const getLiveExecutionResults = (state) => _get(state, `${path}.execution.results`, EMPTY_OBJ)

export const getStrategyPositions = createSelector(
  [getLiveExecutionResults],
  (results) => results?.positions,
)

export default getLiveExecutionResults
