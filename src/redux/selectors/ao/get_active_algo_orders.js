import _get from 'lodash/get'
import _map from 'lodash/map'
import { createSelector } from 'reselect'
import { reduxSelectors } from '@ufx-ui/bfx-containers'

import { getPairFromMarket } from '../../../util/market'
import { REDUCER_PATHS } from '../../config'
import { getMarkets } from '../meta'

const { getCurrencySymbolMemo } = reduxSelectors

const path = REDUCER_PATHS.AOS

const EMPTY_ARR = []

export const getActiveAlgoOrders = (state) => _get(state, `${path}.activeAlgoOrders`, EMPTY_ARR)

const activeAlgoOrdersWithReplacedPairs = createSelector(
  [
    getMarkets,
    getActiveAlgoOrders,
    getCurrencySymbolMemo,
  ],
  (markets, orders, getCurrencySymbol) => {
    return _map(orders, (order) => {
      const currentMarket = markets[order?.args?.symbol]

      return {
        ...order,
        args: {
          ...order?.args,
          symbol: getPairFromMarket(currentMarket, getCurrencySymbol),
        },
      }
    })
  },
)

export default activeAlgoOrdersWithReplacedPairs
