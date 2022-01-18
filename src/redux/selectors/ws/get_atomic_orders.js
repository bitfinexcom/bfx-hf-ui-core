import { createSelector } from 'reselect'
import _get from 'lodash/get'
import _isUndefined from 'lodash/isUndefined'
import _filter from 'lodash/filter'
import _keys from 'lodash/keys'
import _reduce from 'lodash/reduce'

import getMarkets from '../meta/get_markets'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS

const EMPTY_OBJ = {}

const getAtomicOrders = createSelector(
  getMarkets,
  (state) => _get(state, `${path}.orders`, EMPTY_OBJ),
  (markets, orders) => {
    const filtered = _filter(_keys(orders), (key) => !_isUndefined(markets[orders[key]?.symbol]))
    return _reduce(filtered, (res, key) => ({ ...res, [key]: orders[key] }), {})
  },
)

export default getAtomicOrders
