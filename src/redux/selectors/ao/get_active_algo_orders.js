import _get from 'lodash/get'
import _map from 'lodash/map'
import { createSelector } from 'reselect'
import { reduxSelectors } from '@ufx-ui/bfx-containers'

import { getPairFromMarket } from '../../../util/market'
import { REDUCER_PATHS } from '../../config'
import { getMarketsForBothModes } from '../meta'

const { getCurrencySymbolMemo } = reduxSelectors

const path = REDUCER_PATHS.AOS

const EMPTY_ARR = []

export const getActiveAlgoOrders = (state) => _get(state, `${path}.activeAlgoOrders`, EMPTY_ARR)

const activeAlgoOrdersWithReplacedPairs = createSelector(
  [
    getMarketsForBothModes,
    getActiveAlgoOrders,
    getCurrencySymbolMemo,
  ],
  (markets, { main, paper }, getCurrencySymbol) => {
    const prepareActiveOrder = (order) => {
      const currentMarket = markets[order?.args?.symbol]

      return {
        ...order,
        args: {
          ...order?.args,
          symbol: getPairFromMarket(currentMarket, getCurrencySymbol),
        },
      }
    }

    return {
      main: _map(main, prepareActiveOrder),
      paper: _map(paper, prepareActiveOrder),
    }
  },
)

export default activeAlgoOrdersWithReplacedPairs
