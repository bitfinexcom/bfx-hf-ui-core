import _get from 'lodash/get'
import { createSelector } from 'reselect'
import memoizeOne from 'memoize-one'
import { reduxSelectors } from '@ufx-ui/bfx-containers'
import { getPairFromMarket } from '../../../util/market'

import { REDUCER_PATHS } from '../../config'

const { getCurrencySymbolMemo } = reduxSelectors

const path = REDUCER_PATHS.META

const EMPTY_OBJ = {}

const getMarkets = (state) => _get(state, `${path}.markets`, EMPTY_OBJ)

export const getMarketPair = createSelector(
  [
    getMarkets,
    getCurrencySymbolMemo,
  ],
  (markets, getCurrencySymbol) => memoizeOne((symbol) => {
    const currentMarket = markets?.[symbol]
    return getPairFromMarket(currentMarket, getCurrencySymbol)
  }),
)

export default getMarkets
