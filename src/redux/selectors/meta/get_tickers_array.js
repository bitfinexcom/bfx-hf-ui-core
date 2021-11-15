import { createSelector } from 'reselect'
import { reduxSelectors, prepareTickers } from '@ufx-ui/bfx-containers'
import getTickersKeys from './get_tickers_keys'
import { getTickersVolumeUnit } from '../ui'

const { getCurrencySymbolMemo, getTickers } = reduxSelectors

const preparedTickersArray = createSelector(
  [
    getTickersKeys,
    getTickers,
    getCurrencySymbolMemo,
    getTickersVolumeUnit,
  ],
  (tickersKeys, tickers, getCurrencySymbol, tickersVolumeUnit) => {
    return prepareTickers(tickersKeys, tickers, tickersVolumeUnit, getCurrencySymbol)
  },
)
export default preparedTickersArray
