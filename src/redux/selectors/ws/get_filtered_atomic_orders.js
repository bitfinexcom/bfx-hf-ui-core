import _isEmpty from 'lodash/isEmpty'
import _filter from 'lodash/filter'
import { createSelector } from 'reselect'
import memoizeOne from 'memoize-one'

import getAtomicOrders from './get_atomic_orders'

const getFilteredAtomicOrders = createSelector(
  getAtomicOrders,
  (orders) => memoizeOne(activeFilter => {
    if (_isEmpty(activeFilter)) {
      return orders
    }

    return _filter(orders, o => o?.symbol === activeFilter?.wsID)
  }),
)

export default getFilteredAtomicOrders
