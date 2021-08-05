import _isEmpty from 'lodash/isEmpty'
import _filter from 'lodash/filter'
import { createSelector } from 'reselect'
import memoizeOne from 'memoize-one'

import getAlgoOrders from './get_algo_orders'

const getFilteredAlgoOrders = createSelector(
  getAlgoOrders,
  (orders) => memoizeOne(activeFilter => {
    if (_isEmpty(activeFilter)) {
      return orders
    }

    return _filter(orders, o => o?.args?.symbol === activeFilter?.wsID)
  }),
)

export default getFilteredAlgoOrders
