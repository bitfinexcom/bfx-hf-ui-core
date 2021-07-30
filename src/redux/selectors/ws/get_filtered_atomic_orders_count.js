import { createSelector } from 'reselect'

import getFilteredAtomicOrders from './get_filtered_atomic_orders'

const getFilteredAtomicOrdersCount = createSelector(
  getFilteredAtomicOrders,
  (getOrders) => (activeFilter) => getOrders(activeFilter)?.length,
)

export default getFilteredAtomicOrdersCount
