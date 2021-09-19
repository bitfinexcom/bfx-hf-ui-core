import _get from 'lodash/get'
import _map from 'lodash/map'
import { createSelector } from 'reselect'
import { reduxSelectors } from '@ufx-ui/bfx-containers'

import { getPairFromMarket } from '../../../util/market'
import { REDUCER_PATHS } from '../../config'
import { getMarkets } from '../meta'

const { getCurrencySymbolMemo } = reduxSelectors

const path = REDUCER_PATHS.WS

const algoOrders = (state) => {
  return _get(state, `${path}.algoOrders`, [])
}

const algoOrdersWithReplacedPairs = createSelector([getMarkets, algoOrders, getCurrencySymbolMemo], (markets, orders, getCurrencySymbol) => {
  return _map(orders, (order) => {
    const currentMarket = markets[order?.args?.symbol]

    return {
      ...order,
      args: {
        ...order.args,
        uiID: getPairFromMarket(currentMarket, getCurrencySymbol),
      },
    }
  }, [])
})

export default algoOrdersWithReplacedPairs
