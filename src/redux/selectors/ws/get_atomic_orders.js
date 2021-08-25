import _get from 'lodash/get'
import _map from 'lodash/map'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'
import { getMarkets } from '../meta'

const path = REDUCER_PATHS.WS

const atomicOrders = (state) => {
  return _get(state, `${path}.orders`, [])
}

const atomicOrdersWithReplacedPairs = createSelector([getMarkets, atomicOrders], (markets, orders) => {
  return _map(orders, (order) => {
    const { symbol } = order
    const currentMarket = markets[symbol]
    return { ...order, uiID: currentMarket.uiID }
  }, [])
})

export default atomicOrdersWithReplacedPairs
