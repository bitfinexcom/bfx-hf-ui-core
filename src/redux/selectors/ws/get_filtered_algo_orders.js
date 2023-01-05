import _isEmpty from 'lodash/isEmpty'
import _reduce from 'lodash/reduce'
import { createSelector } from 'reselect'
import memoizeOne from 'memoize-one'

import { getCurrentModeAlgoOrders } from './get_algo_orders'

const getFilteredAlgoOrders = createSelector(
  getCurrentModeAlgoOrders,
  (orders) => memoizeOne(activeFilter => {
    if (_isEmpty(activeFilter)) {
      return orders
    }

    return _reduce(orders, (acc, o) => {
      if (o?.args?.symbol === activeFilter?.wsID) {
        acc[o?.gid] = o
      }
      return acc
    }, {})
  }),
)

export default getFilteredAlgoOrders
