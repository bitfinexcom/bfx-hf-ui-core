import { createSelector } from 'reselect'
import _filter from 'lodash/filter'
import _map from 'lodash/map'

import { reduxSelectors } from '@ufx-ui/bfx-containers'
import getAtomicOrders from '../ws/get_atomic_orders'
import { getMarketBySymbol as _getMarketBySymbol } from '../meta'
import { getTooltip } from '../../../util/chart'

const { getCurrencySymbol: _getCurrencySymbol, getIsDerivativePair } = reduxSelectors

const getChartOrdersBySymbol = createSelector(
  [
    getAtomicOrders,
    _getMarketBySymbol,
    _getCurrencySymbol,
    getIsDerivativePair,
  ],
  (orders, getMarketBySymbol, getCurrencySymbol, isDerivativePair) => (wsID, t) => {
    const matched = _filter(orders, o => o.symbol === wsID)

    return _map(matched, (o) => {
      const [tooltip, shortType] = getTooltip(o, {
        t,
        getMarketBySymbol,
        getCurrencySymbol,
        isDerivativePair,
      })
      return {
        ...o,
        tooltip,
        shortType,
      }
    })
  },
)

export default getChartOrdersBySymbol
