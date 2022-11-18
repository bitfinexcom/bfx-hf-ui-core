import _get from 'lodash/get'
import _values from 'lodash/values'

import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'
import { getCurrentMode } from '../ui'

const path = REDUCER_PATHS.WS

const EMPTY_OBJ = {}

const getAllAlgoOrders = (state) => _get(state, `${path}.algoOrders`, EMPTY_OBJ)

export const getAllAlgoOrdersArray = createSelector(
  getAllAlgoOrders,
  ({ paper, main }) => _values({ ...paper, ...main }),
)

export const getCurrentModeAlgoOrders = createSelector(
  getAllAlgoOrders,
  getCurrentMode,
  (algoOrders, currentMode) => _get(algoOrders, currentMode, EMPTY_OBJ),
)
