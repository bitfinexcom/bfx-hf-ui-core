import _get from 'lodash/get'
import _reduce from 'lodash/reduce'
import _orderBy from 'lodash/orderBy'
import _keys from 'lodash/keys'
import _map from 'lodash/map'
import { createSelector } from 'reselect'
import memoizeOne from 'memoize-one'
import {
  prepareTickers,
  reduxSelectors,
  VOLUME_UNIT,
} from '@ufx-ui/bfx-containers'

import { getIsPaperPair, getPairFromMarket } from '../../../util/market'
import { REDUCER_PATHS } from '../../config'
import { getIsPaperTrading } from '../ui'
import { MARKET_TYPES_KEYS } from '../../constants/market'

const {
  getCurrencySymbolMemo,
  getIsSecuritiesPair,
  getIsTradingPair,
  getIsDerivativePair,
  getTickers,
} = reduxSelectors

const path = REDUCER_PATHS.META

const EMPTY_OBJ = {}

export const getMarketsObject = (state) => _get(state, `${path}.markets`, EMPTY_OBJ)

export const getMarkets = createSelector(
  [getIsPaperTrading, getMarketsObject],
  (isPaperTrading, markets) => {
    return _get(
      markets,
      isPaperTrading
        ? MARKET_TYPES_KEYS.SANDBOX_MARKETS
        : MARKET_TYPES_KEYS.LIVE_MARKETS,
      EMPTY_OBJ,
    )
  },
)

export const getMarketsForExecution = createSelector(
  [
    getMarketsObject,
    getIsTradingPair,
    getIsDerivativePair,
    getIsSecuritiesPair,
  ],
  (markets, isTradingPair, isDerivativePair, isSecuritiesPair) => {
    const liveMarkets = _get(
      markets,
      MARKET_TYPES_KEYS.LIVE_MARKETS,
      EMPTY_OBJ,
    )

    return _reduce(
      liveMarkets,
      (result, value, key) => {
        if (
          isTradingPair(key)
          && !isDerivativePair(key)
          && !isSecuritiesPair(key)
        ) {
          return {
            ...result,
            [key]: value,
          }
        }

        return result
      },
      {},
    )
  },
)

export const getMarketsSortedByVolumeForExecution = createSelector(
  [getMarketsForExecution, getTickers, getCurrencySymbolMemo],
  (liveMarkets, tickers, getCurrencySymbol) => {
    const tickersVolumeUnit = VOLUME_UNIT.USD

    const tickersKeys = _keys(liveMarkets)
    const prepared = prepareTickers(
      tickersKeys,
      tickers,
      tickersVolumeUnit,
      getCurrencySymbol,
    )
    const sortedByVolume = _orderBy(prepared, 'volumeConverted', 'desc')
    return _map(sortedByVolume, (m) => {
      const { id } = m

      return { ...m, ...liveMarkets[id] }
    })
  },
)

export const getMarketPair = createSelector(
  [getMarketsObject, getCurrencySymbolMemo],
  (markets, getCurrencySymbol) => memoizeOne((symbol) => {
    const isPaperMarket = getIsPaperPair(symbol)
    const marketTypeKey = isPaperMarket
      ? MARKET_TYPES_KEYS.SANDBOX_MARKETS
      : MARKET_TYPES_KEYS.LIVE_MARKETS
    const currentMarket = _get(markets, `${marketTypeKey}.${symbol}`, null)

    if (!currentMarket) {
      return symbol
    }

    return getPairFromMarket(currentMarket, getCurrencySymbol)
  }),
)
