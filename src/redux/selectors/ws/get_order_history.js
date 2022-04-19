import _get from 'lodash/get'
import _values from 'lodash/values'
import { createSelector } from 'reselect'

import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS
const EMPTY_OBJ = {}

const getOrderHistory = (state) => _get(state, `${path}.orderHistory`, EMPTY_OBJ)

const getSortedOrderHistory = createSelector(
  getOrderHistory,
  (orders) => {
    const ordersArr = _values(orders)
    ordersArr.sort((a, b) => b.mtsUpdate - a.mtsUpdate)
    console.log('ordersArr: ', ordersArr)
    return ordersArr
  },
)

export default getSortedOrderHistory
