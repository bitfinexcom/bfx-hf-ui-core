import { createSelector } from 'reselect'
import _size from 'lodash/size'

import getFilteredAtomicOrders from './get_filtered_atomic_orders'

const getFilteredAtomicOrdersCount = createSelector(
  getFilteredAtomicOrders,
  (getOrders) => (activeFilter) => _size(getOrders(activeFilter)),
)

export default getFilteredAtomicOrdersCount
