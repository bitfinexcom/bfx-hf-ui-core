import { takeEvery } from 'redux-saga/effects'

import types from '../../constants/ao'

import getActiveAlgoOrders from './get_active_algo_orders'
import handleActiveAlgoOrders from './handle_active_algo_orders'
import getAlgoOrderParams from './get_algo_order_params'
import removeAlgoOrderParams from './remove_algo_order_params'
import saveAlgoOrderParams from './save_algo_order_params'

export default function* () {
  yield takeEvery(types.GET_ACTIVE_AOS, getActiveAlgoOrders)
  yield takeEvery(types.HANDLE_ACTIVE_AOS, handleActiveAlgoOrders)
  yield takeEvery(types.GET_AO_PARAMS, getAlgoOrderParams)
  yield takeEvery(types.REMOVE_AO_PARAMS, removeAlgoOrderParams)
  yield takeEvery(types.SAVE_AO_PARAMS, saveAlgoOrderParams)
}
