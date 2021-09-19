import _get from 'lodash/get'
import _map from 'lodash/map'
import { createSelector } from 'reselect'
import { reduxSelectors } from '@ufx-ui/bfx-containers'
import { getPairFromMarket } from '../../../util/market'
import { REDUCER_PATHS } from '../../config'
import { getMarkets } from '../meta'

const { getCurrencySymbolMemo } = reduxSelectors

const path = REDUCER_PATHS.WS

const orderHistory = (state) => {
  return _get(state, `${path}.orderHistory`, [])
}

const orderHistoryWithReplacedPairs = createSelector([getMarkets, orderHistory, getCurrencySymbolMemo], (markets, orders, getCurrencySymbol) => {
  return _map(orders, (order) => {
    const currentMarket = markets?.[order?.symbol]

    return {
      ...order,
      symbol: getPairFromMarket(currentMarket, getCurrencySymbol),
    }
  }, [])
})

export default orderHistoryWithReplacedPairs
