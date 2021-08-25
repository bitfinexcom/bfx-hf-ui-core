import _get from 'lodash/get'
import _map from 'lodash/map'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'
import { getMarkets } from '../meta'

const path = REDUCER_PATHS.AOS

const activeAlgoOrders = (state) => {
  return _get(state, `${path}.activeAlgoOrders`, [])
}

const activeAlgoOrdersWithReplacedPairs = createSelector([getMarkets, activeAlgoOrders], (markets, orders) => {
  return _map(orders, (order) => {
    const { symbol } = order.args
    const currentMarket = markets[symbol]
    return { ...order, args: { ...order.args, symbol: currentMarket.uiID } }
  }, [])
})

export default activeAlgoOrdersWithReplacedPairs
