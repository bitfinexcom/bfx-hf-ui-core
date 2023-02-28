import { takeEvery, takeLatest } from 'redux-saga/effects'

import types from '../../constants/ao'

import onResumeRemoveActiveAlgoOrdersHandler from './on_resume_remove_active_algo_orders_handler'
import getAlgoOrderParams from './get_algo_order_params'
import removeAlgoOrderParams from './remove_algo_order_params'
import saveAlgoOrderParams from './save_algo_order_params'
import requestAOsHistory from './request_aos_history'
import handleActiveAlgoOrders from './handle_active_algo_orders'

export default function* () {
  yield takeEvery(types.RESUME_REMOVE_ACTIVE_AOS, onResumeRemoveActiveAlgoOrdersHandler)
  yield takeEvery(types.GET_AO_PARAMS, getAlgoOrderParams)
  yield takeEvery(types.REMOVE_AO_PARAMS, removeAlgoOrderParams)
  yield takeEvery(types.SAVE_AO_PARAMS, saveAlgoOrderParams)
  yield takeEvery(types.SHOW_AOS_HISTORY, requestAOsHistory)
  yield takeLatest(types.HANDLE_ACTIVE_AOS, handleActiveAlgoOrders)
}
