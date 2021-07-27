import _get from 'lodash/get'
import _map from 'lodash/map'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'
import { getMarketsObject } from '../meta'

const path = REDUCER_PATHS.WS

const orderHistory = (state) => {
  return _get(state, `${path}.orderHistory`, [])
}

const orderHistoryWithReplacedPairs = createSelector([getMarketsObject, orderHistory], (markets, orders) => {
  return _map(orders, (order) => {
    const { symbol } = order
    const currentMarket = markets[symbol]
    return { ...order, symbol: currentMarket.uiID }
  }, [])
})

export default orderHistoryWithReplacedPairs
