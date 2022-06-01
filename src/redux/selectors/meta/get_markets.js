import _get from 'lodash/get'
import { createSelector } from 'reselect'
import memoizeOne from 'memoize-one'
import { reduxSelectors } from '@ufx-ui/bfx-containers'
import { getPairFromMarket } from '../../../util/market'

import { REDUCER_PATHS } from '../../config'
import { getIsPaperTrading } from '../ui'
import { MARKET_TYPES_KEYS } from '../../constants/market'

const { getCurrencySymbolMemo } = reduxSelectors

const path = REDUCER_PATHS.META

const EMPTY_OBJ = {}

const getMarketsObject = (state) => _get(state, `${path}.markets`, EMPTY_OBJ)

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

export const getMarketPair = createSelector(
  [getMarkets, getCurrencySymbolMemo],
  (markets, getCurrencySymbol) => memoizeOne((symbol) => {
    const currentMarket = markets?.[symbol]
    return getPairFromMarket(currentMarket, getCurrencySymbol)
  }),
)

export const getMarketsForExecution = createSelector(
  [getMarketsObject],
  (markets) => _get(markets, MARKET_TYPES_KEYS.LIVE_MARKETS, EMPTY_OBJ),
)
