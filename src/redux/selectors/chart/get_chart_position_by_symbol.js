import { createSelector } from 'reselect'
import _filter from 'lodash/filter'
import _map from 'lodash/map'

import { reduxSelectors } from '@ufx-ui/bfx-containers'
import { getMarketBySymbol as _getMarketBySymbol } from '../meta'
import { getPositionTooltip } from '../../../util/chart'
import { getAllPositions } from '../ws'

const { getCurrencySymbol: _getCurrencySymbol } = reduxSelectors

const getChartOrdersBySymbol = createSelector(
  [
    getAllPositions,
    _getMarketBySymbol,
    _getCurrencySymbol,
  ],
  (positions, getMarketBySymbol, getCurrencySymbol) => (wsID, t) => {
    const matched = _filter(positions, p => p.symbol === wsID)

    return _map(matched, (p) => {
      return {
        ...p,
        tooltip: getPositionTooltip(p, {
          t,
          getMarketBySymbol,
          getCurrencySymbol,
        }),
      }
    })
  },
)

export default getChartOrdersBySymbol
