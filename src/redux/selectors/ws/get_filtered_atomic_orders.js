import _isEmpty from 'lodash/isEmpty'
import _reduce from 'lodash/reduce'
import { createSelector } from 'reselect'
import memoizeOne from 'memoize-one'

import getAtomicOrders from './get_atomic_orders'

const getFilteredAtomicOrders = createSelector(
  getAtomicOrders,
  (orders) => memoizeOne(activeFilter => {
    if (_isEmpty(activeFilter)) {
      return orders
    }

    return _reduce(orders, (acc, o) => {
      if (o?.symbol === activeFilter?.wsID) {
        acc[o?.id] = o
      }
      return acc
    }, {})
  }),
)

export default getFilteredAtomicOrders
