import _get from 'lodash/get'
import _values from 'lodash/values'

import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'
import { getShowAOsHistory } from '../ao'
import { getCurrentMode } from '../ui'
import getAlgoOrdersHistory from './get_algo_orders_history'

const path = REDUCER_PATHS.WS

const EMPTY_OBJ = {}

const getAllAlgoOrders = (state) => _get(state, `${path}.algoOrders`, EMPTY_OBJ)

export const getAllAlgoOrdersArray = createSelector(
  getAllAlgoOrders,
  ({ paper, main }) => _values({ ...paper, ...main }),
)

export const getCurrentModeAlgoOrders = createSelector(
  [getAllAlgoOrders, getAlgoOrdersHistory, getShowAOsHistory, getCurrentMode],
  (algoOrders, historyAOs, showHistory, currentMode) => _get(showHistory ? historyAOs : algoOrders, currentMode, EMPTY_OBJ),
)
