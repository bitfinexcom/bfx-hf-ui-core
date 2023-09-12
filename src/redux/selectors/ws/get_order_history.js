import { createSelector } from 'reselect'
import _get from 'lodash/get'
import _isUndefined from 'lodash/isUndefined'
import _filter from 'lodash/filter'
import _keys from 'lodash/keys'
import _reduce from 'lodash/reduce'

import { REDUCER_PATHS } from '../../config'
import { getMarkets } from '../meta'

const path = REDUCER_PATHS.WS
const EMPTY_OBJ = {}

const getOrderHistory = createSelector(
  getMarkets,
  (state) => _get(state, `${path}.orderHistory`, EMPTY_OBJ),
  (markets, orders) => {
    const filtered = _filter(_keys(orders), (key) => !_isUndefined(markets[orders[key]?.symbol]))
    return _reduce(filtered, (res, key) => ({ ...res, [key]: orders[key] }), {})
  },
)

export default getOrderHistory
