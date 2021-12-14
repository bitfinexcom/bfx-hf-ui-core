import { createSelector } from 'reselect'
import _size from 'lodash/size'
import _isUndefined from 'lodash/isUndefined'
import _filter from 'lodash/filter'
import _keys from 'lodash/keys'

import getFilteredAtomicOrders from './get_filtered_atomic_orders'
import getMarkets from '../meta/get_markets'

const getFilteredAtomicOrdersCount = createSelector(
  getFilteredAtomicOrders,
  getMarkets,
  (getOrders, markets) => (activeFilter) => {
    const orders = getOrders(activeFilter)
    const filtered = _filter(_keys(orders), (key) => !_isUndefined(markets[orders[key]?.symbol]))
    return _size(filtered)
  },
)

export default getFilteredAtomicOrdersCount
