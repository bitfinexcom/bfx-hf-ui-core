import _get from 'lodash/get'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'
import { getCurrentMode } from '../ui'

const path = REDUCER_PATHS.AOS
const EMPTY_OBJ = {}

const getAlgoOrderTable = (state) => {
  return _get(state, `${path}.algoOrderTable`, EMPTY_OBJ)
}

const getIsInitialAlgoOrderFetch = createSelector(
  getAlgoOrderTable,
  getCurrentMode,
  (algoOrderTable, currentMode) => _get(algoOrderTable, `${currentMode}.isInitialFetch`, true),
)

export default getIsInitialAlgoOrderFetch
