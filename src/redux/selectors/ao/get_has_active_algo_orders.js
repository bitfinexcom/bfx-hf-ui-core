import _isEmpty from 'lodash/isEmpty'
import { getActiveAlgoOrders } from './get_active_algo_orders'

export default (state) => !_isEmpty(getActiveAlgoOrders(state))
