import _get from 'lodash/get'

import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'
import { getCurrentMode } from '../ui'

const path = REDUCER_PATHS.WS

const EMPTY_OBJ = {}

const getAllAlgoOrders = (state) => _get(state, `${path}.algoOrders`, EMPTY_OBJ)

const getAlgoOrders = createSelector(
  getAllAlgoOrders,
  getCurrentMode,
  (algoOrders, currentMode) => _get(algoOrders, currentMode, EMPTY_OBJ),
)

export default getAlgoOrders
