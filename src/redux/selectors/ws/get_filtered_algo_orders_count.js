import { createSelector } from 'reselect'
import _size from 'lodash/size'

import getFilteredAlgoOrders from './get_filtered_algo_orders'

const getFilteredAlgoOrdersCount = createSelector(
  getFilteredAlgoOrders,
  (getOrders) => (activeFilter) => _size(getOrders(activeFilter)),
)

export default getFilteredAlgoOrdersCount
