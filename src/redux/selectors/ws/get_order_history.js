import _get from 'lodash/get'
import _values from 'lodash/values'

import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS
const EMPTY_OBJ = {}

const getOrderHistory = (state) => _get(state, `${path}.orderHistory`, EMPTY_OBJ)

export default createSelector(getOrderHistory, orderHistory => _values(orderHistory))
