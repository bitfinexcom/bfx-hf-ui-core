import _get from 'lodash/get'
import { createSelector } from 'reselect'

import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.UI

const EMPTY_OBJ = {}

export const MAX_ORDER_COUNT_SETTING = 'te_limit_order_*'
const MAX_ORDER_COUNT = 'te_limit_order_cnt'
const MAX_ORDER_COUNT_SYMBOL = 'te_limit_order_symbol_cnt'

const getCoreSettings = (state) => _get(state, `${path}.coreSettings`, EMPTY_OBJ)

const MAX_ORDERS = {
  [MAX_ORDER_COUNT]: 2500,
  [MAX_ORDER_COUNT_SYMBOL]: 250,
}

const findOrderCountValue = (settings, key) => Number(_get(settings, [MAX_ORDER_COUNT_SETTING, key]))

export const getMaxOrderCount = createSelector(
  getCoreSettings,
  (settings) => findOrderCountValue(settings, MAX_ORDER_COUNT),
)

export const getMaxOrderCountSymbol = createSelector(
  getCoreSettings,
  (settings) => findOrderCountValue(settings, MAX_ORDER_COUNT_SYMBOL),
)

export const getMaxOrderCounts = createSelector(
  getMaxOrderCount,
  getMaxOrderCountSymbol,
  (total, pair) => ({
    total: total || MAX_ORDERS[MAX_ORDER_COUNT],
    pair: pair || MAX_ORDERS[MAX_ORDER_COUNT_SYMBOL],
  }),
)

export default getCoreSettings
