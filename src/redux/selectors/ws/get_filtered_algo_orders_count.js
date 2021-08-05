import { createSelector } from 'reselect'

import getFilteredAlgoOrders from './get_filtered_algo_orders'

const getFilteredAlgoOrdersCount = createSelector(
  getFilteredAlgoOrders,
  (getOrders) => (activeFilter) => getOrders(activeFilter)?.length,
)

export default getFilteredAlgoOrdersCount
