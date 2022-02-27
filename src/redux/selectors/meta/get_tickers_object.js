import { createSelector } from 'reselect'
import { reduxSelectors, prepareTickers } from '@ufx-ui/bfx-containers'
import _reduce from 'lodash/reduce'
import _keys from 'lodash/keys'
import _startsWith from 'lodash/startsWith'

import getTickersKeys from './get_tickers_keys'
import { getTickersVolumeUnit } from '../ui'

const { getCurrencySymbolMemo, getTickers } = reduxSelectors

const preparedTickersObject = createSelector(
  [
    getTickersKeys,
    getTickers,
    getCurrencySymbolMemo,
    getTickersVolumeUnit,
  ],
  (tickersKeys, tickers, getCurrencySymbol, tickersVolumeUnit) => {
    const tickersArray = prepareTickers(_keys(tickers), tickers, tickersVolumeUnit, getCurrencySymbol)
    const result = _reduce(tickersArray, (acc, ticker) => {
      if (!_startsWith(ticker?.id, 'f')) {
        acc[ticker?.id] = {
          ...ticker,
          uiID: ticker?.id,
          base: ticker?.baseCcy,
          quote: ticker?.quoteCcy,
        }
      }
      return acc
    }, {})

    return result
  },
)
export default preparedTickersObject
