import _get from 'lodash/get'
import _map from 'lodash/map'
import { createSelector } from 'reselect'
import { reduxSelectors } from '@ufx-ui/bfx-containers'
import { REDUCER_PATHS } from '../../config'
import { getMarkets } from '../meta'
import { getPairFromMarket } from '../../../util/market'

const { getCurrencySymbolMemo } = reduxSelectors

const path = REDUCER_PATHS.WS

const atomicOrders = (state) => {
  return _get(state, `${path}.orders`, [])
}

const atomicOrdersWithReplacedPairs = createSelector([getMarkets, atomicOrders, getCurrencySymbolMemo], (markets, orders, getCurrencySymbol) => {
  return _map(orders, (order) => {
    const currentMarket = markets?.[order?.symbol]

    return {
      ...order,
      uiID: getPairFromMarket(currentMarket, getCurrencySymbol),
    }
  }, [])
})

export default atomicOrdersWithReplacedPairs
