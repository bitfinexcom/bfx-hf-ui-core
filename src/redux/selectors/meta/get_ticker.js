import { prepareTickers, reduxSelectors } from '@ufx-ui/bfx-containers'
import _isEmpty from 'lodash/isEmpty'
import { createSelector } from 'reselect'
import { getTickersVolumeUnit } from '../ui'

const EMPTY_OBJ = {}

const { getTickers: tickersSelector, getCurrencySymbolMemo } = reduxSelectors

const getTicker = createSelector(
  [tickersSelector, getCurrencySymbolMemo, getTickersVolumeUnit, (_, market) => market],
  (tickers, getCurrencySymbol, tickersVolumeUnit, market) => {
    if (_isEmpty(tickers)) {
      return EMPTY_OBJ
    }

    const [preparedTicker] = prepareTickers([market?.restID], tickers, tickersVolumeUnit, getCurrencySymbol)
    return preparedTicker || EMPTY_OBJ
  },
)

export default getTicker
